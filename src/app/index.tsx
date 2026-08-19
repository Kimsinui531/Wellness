import { useState } from 'react';
import { Linking } from 'react-native';

import {
  MeasuringScreen,
  MicPermissionScreen,
  PermissionDeniedScreen,
  PermissionSuccessScreen,
  ResultScreen,
  SkinConcernScreen,
  StartScreen,
  WaitingScreen,
} from '@/screens';
import type { AppScreen } from '@/types/app-screen';

export default function HomeScreen() {
  const [screen, setScreen] = useState<AppScreen>('start');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [lastElapsedSeconds, setLastElapsedSeconds] = useState(0);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((currentConcerns) =>
      currentConcerns.includes(concern)
        ? currentConcerns.filter((currentConcern) => currentConcern !== concern)
        : [...currentConcerns, concern],
    );
  };

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      // Keep the permission-denied screen stable if the platform cannot open settings.
    }
  };

  switch (screen) {
    case 'skin-concern':
      return (
        <SkinConcernScreen
          selectedConcerns={selectedConcerns}
          onToggleConcern={toggleConcern}
          onBack={() => setScreen('start')}
          onNext={() => setScreen('mic-permission')}
        />
      );
    case 'mic-permission':
      return (
        <MicPermissionScreen
          onBack={() => setScreen('skin-concern')}
          onAllow={() => setScreen('permission-success')}
          onDeny={() => setScreen('permission-denied')}
        />
      );
    case 'permission-success':
      return <PermissionSuccessScreen onComplete={() => setScreen('waiting')} />;
    case 'permission-denied':
      return (
        <PermissionDeniedScreen
          onRetry={() => setScreen('mic-permission')}
          onOpenSettings={openSettings}
        />
      );
    case 'waiting':
      return <WaitingScreen onDetected={() => setScreen('measuring')} />;
    case 'measuring':
      return (
        <MeasuringScreen
          onFinish={(elapsedSeconds) => {
            setLastElapsedSeconds(elapsedSeconds);
            setScreen('result');
          }}
        />
      );
    case 'result':
      return (
        <ResultScreen
          elapsedSeconds={lastElapsedSeconds}
          recommendedSeconds={300}
          onRestart={() => {
            setLastElapsedSeconds(0);
            setSelectedConcerns([]);
            setScreen('start');
          }}
        />
      );
    case 'start':
    default:
      return <StartScreen onStart={() => setScreen('skin-concern')} />;
  }
}
