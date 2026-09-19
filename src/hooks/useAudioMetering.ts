import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
  type RecordingOptions,
  type RecordingStatus,
} from 'expo-audio';

const STATUS_UPDATE_INTERVAL_MS = 200;

const METERING_RECORDING_OPTIONS: RecordingOptions = {
  ...RecordingPresets.LOW_QUALITY,
  directory: 'cache',
  isMeteringEnabled: true,
};

type MeteringStatus =
  | 'idle'
  | 'checking-permission'
  | 'preparing'
  | 'recording'
  | 'stopped'
  | 'error';

type OperationReason = 'mount' | 'foreground' | 'background' | 'inactive' | 'unmount' | 'manual';

export function useAudioMetering(enabled = true) {
  const mountedRef = useRef(false);
  const appIsActiveRef = useRef(AppState.currentState === 'active');
  const operationIdRef = useRef(0);
  const operationQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [status, setStatus] = useState<MeteringStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleRecordingStatus = useCallback((recordingStatus: RecordingStatus) => {
    if (mountedRef.current && recordingStatus.hasError) {
      setStatus('error');
      setError(recordingStatus.error ?? '녹음 상태를 확인할 수 없습니다.');
    }
  }, []);

  const recorder = useAudioRecorder(METERING_RECORDING_OPTIONS, handleRecordingStatus);
  const recorderState = useAudioRecorderState(recorder, STATUS_UPDATE_INTERVAL_MS);

  const logRecorderEvent = useCallback(
    (event: string, caughtError?: unknown) => {
      if (!__DEV__) return;

      try {
        const actualState = recorder.getStatus();
        console.info(`[audio-metering] ${new Date().toISOString()} ${event}`, {
          isRecording: actualState.isRecording,
          canRecord: actualState.canRecord,
          durationMillis: actualState.durationMillis,
          error: caughtError instanceof Error ? caughtError.message : caughtError,
        });
      } catch (statusError) {
        console.warn(
          `[audio-metering] ${new Date().toISOString()} ${event}; status unavailable`,
          {
            error: caughtError instanceof Error ? caughtError.message : caughtError,
            statusError: statusError instanceof Error ? statusError.message : statusError,
          },
        );
      }
    },
    [recorder],
  );

  const enqueue = useCallback((operation: () => Promise<void>) => {
    const nextOperation = operationQueueRef.current.then(operation, operation);
    operationQueueRef.current = nextOperation.catch(() => undefined);
    return nextOperation;
  }, []);

  const stopRecorderAndReleaseMode = useCallback(
    async (reason: OperationReason) => {
      let stopError: unknown = null;

      try {
        const currentState = recorder.getStatus();
        if (currentState.isRecording || currentState.canRecord) {
          await recorder.stop();
        }
      } catch (caughtError) {
        stopError = caughtError;
        logRecorderEvent(`stop failed (${reason})`, caughtError);
      }

      try {
        await setAudioModeAsync({
          allowsRecording: false,
          allowsBackgroundRecording: false,
          shouldPlayInBackground: false,
        });
      } catch (caughtError) {
        stopError ??= caughtError;
        logRecorderEvent(`audio mode release failed (${reason})`, caughtError);
      }

      if (stopError) throw stopError;

      if (recorder.getStatus().isRecording) {
        const verificationError = new Error('Recorder still reports isRecording=true after stop.');
        logRecorderEvent(`stop verification failed (${reason})`, verificationError);
        throw verificationError;
      }

      logRecorderEvent(`stop completed (${reason})`);
    },
    [logRecorderEvent, recorder],
  );

  const stop = useCallback((reason: OperationReason) => {
    const operationId = ++operationIdRef.current;
    logRecorderEvent(`stop requested (${reason})`);

    // Quiesce native capture synchronously before iOS can suspend JavaScript.
    try {
      if (recorder.getStatus().isRecording) {
        recorder.pause();
        logRecorderEvent(`immediate pause completed (${reason})`);
      }
    } catch (caughtError) {
      logRecorderEvent(`immediate pause failed (${reason})`, caughtError);
    }

    return enqueue(async () => {
      try {
        await stopRecorderAndReleaseMode(reason);
        if (mountedRef.current && operationId === operationIdRef.current) {
          setStatus('stopped');
        }
      } catch (caughtError) {
        if (mountedRef.current && operationId === operationIdRef.current) {
          setStatus('error');
          setError(getErrorMessage(caughtError, '녹음을 정리하지 못했습니다.'));
        }
      }
    });
  }, [enqueue, logRecorderEvent, recorder, stopRecorderAndReleaseMode]);

  const start = useCallback((reason: OperationReason = 'manual') => {
    const operationId = ++operationIdRef.current;
    logRecorderEvent(`start requested (${reason})`);

    return enqueue(async () => {
      const isCurrentOperation = () =>
        mountedRef.current &&
        enabled &&
        appIsActiveRef.current &&
        operationId === operationIdRef.current;

      if (!isCurrentOperation()) {
        return;
      }

      try {
        setError(null);
        setStatus('checking-permission');

        const permission = await getRecordingPermissionsAsync();
        if (!isCurrentOperation()) {
          return;
        }
        if (!permission.granted) {
          setStatus('error');
          setError('마이크 권한이 허용되지 않았습니다.');
          return;
        }

        setStatus('preparing');
        await setAudioModeAsync({
          allowsRecording: true,
          allowsBackgroundRecording: false,
          playsInSilentMode: true,
          shouldPlayInBackground: false,
        });

        if (!isCurrentOperation()) {
          await stopRecorderAndReleaseMode(reason);
          return;
        }

        await recorder.prepareToRecordAsync();
        if (!isCurrentOperation()) {
          await stopRecorderAndReleaseMode(reason);
          return;
        }

        recorder.record();
        if (!isCurrentOperation()) {
          await stopRecorderAndReleaseMode(reason);
          return;
        }

        if (!recorder.getStatus().isRecording) {
          throw new Error('Recorder did not report isRecording=true after record().');
        }

        setStatus('recording');
        logRecorderEvent(`start completed (${reason})`);
      } catch (caughtError) {
        try {
          await stopRecorderAndReleaseMode(reason);
        } catch (cleanupError) {
          logRecorderEvent(`start failure cleanup failed (${reason})`, cleanupError);
        }

        if (isCurrentOperation()) {
          setStatus('error');
          setError(getErrorMessage(caughtError, '마이크 녹음을 시작하지 못했습니다.'));
        }
      }
    });
  }, [enabled, enqueue, logRecorderEvent, recorder, stopRecorderAndReleaseMode]);

  useEffect(() => {
    mountedRef.current = true;
    appIsActiveRef.current = AppState.currentState === 'active';

    if (enabled && appIsActiveRef.current) {
      void start('mount');
    }

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (__DEV__) {
        console.info(`[audio-metering] ${new Date().toISOString()} AppState changed`, {
          nextState,
        });
      }
      appIsActiveRef.current = nextState === 'active';
      if (appIsActiveRef.current && enabled) {
        void start('foreground');
      } else {
        void stop(nextState === 'background' ? 'background' : 'inactive');
      }
    });

    return () => {
      mountedRef.current = false;
      appIsActiveRef.current = false;
      subscription.remove();
      void stop('unmount');
    };
  }, [enabled, start, stop]);

  return {
    status,
    isRecording: recorderState.isRecording,
    metering:
      recorderState.isRecording && typeof recorderState.metering === 'number'
        ? recorderState.metering
        : null,
    error,
    restart: () => start('manual'),
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
