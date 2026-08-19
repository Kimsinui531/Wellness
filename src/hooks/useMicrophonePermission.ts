import { useCallback, useEffect, useState } from 'react';
import {
  getRecordingPermissionsAsync,
  PermissionStatus,
  requestRecordingPermissionsAsync,
  type PermissionResponse,
} from 'expo-audio';

type MicrophonePermissionState = {
  status: PermissionStatus | null;
  isGranted: boolean;
  isDenied: boolean;
  requestPermission: () => Promise<PermissionResponse>;
};

export function useMicrophonePermission(): MicrophonePermissionState {
  const [permission, setPermission] = useState<PermissionResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    getRecordingPermissionsAsync()
      .then((currentPermission) => {
        if (isMounted) {
          setPermission(currentPermission);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPermission(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const requestPermission = useCallback(async () => {
    const currentPermission = await getRecordingPermissionsAsync();

    if (currentPermission.granted) {
      setPermission(currentPermission);
      return currentPermission;
    }

    const requestedPermission = await requestRecordingPermissionsAsync();
    setPermission(requestedPermission);
    return requestedPermission;
  }, []);

  const status = permission?.status ?? null;

  return {
    status,
    isGranted: permission?.granted === true,
    isDenied: status === PermissionStatus.DENIED && permission?.granted !== true,
    requestPermission,
  };
}
