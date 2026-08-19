# AquaLog

Zero-UI 맞춤형 샤워 케어 모바일 앱 demo입니다.

멋쟁이사자처럼 해커톤용 프로젝트이며, 현재는 Expo Go에서 확인 가능한 UI demo flow와 마이크 권한 요청 기능까지 구현되어 있습니다.

## Tech Stack

- React Native
- Expo SDK 54
- Expo Router
- TypeScript
- expo-audio
- Android / iOS

## 처음 실행하는 방법

### 1. 필수 설치

아래 프로그램이 먼저 설치되어 있어야 합니다.

- Node.js LTS
- Git
- Expo Go 앱
  - Android: Google Play Store에서 Expo Go 설치
  - iOS: App Store에서 Expo Go 설치

### 2. 프로젝트 가져오기

```bash
git clone https://github.com/Kimsinui531/Wellness.git
cd Wellness
```

이미 zip으로 받은 경우에는 압축을 풀고 프로젝트 폴더로 이동하면 됩니다.

### 3. dependency 설치

```bash
npm install
```

Windows PowerShell에서 `npm` 또는 `npx` 실행이 막히면 아래처럼 `.cmd`를 붙여 실행합니다.

```powershell
npm.cmd install
```

### 4. 앱 실행

```bash
npx expo start -c
```

Windows PowerShell에서 `npx`가 막히면 아래 명령어를 사용합니다.

```powershell
npx.cmd expo start -c
```

터미널에 QR 코드가 나오면 휴대폰의 Expo Go 앱으로 스캔합니다.

- PC와 휴대폰은 같은 Wi-Fi에 연결되어 있어야 합니다.
- Expo Go에서 접속하면 AquaLog 시작 화면이 보여야 합니다.

## 개발 중 자주 쓰는 명령어

TypeScript 오류 확인:

```bash
npx tsc --noEmit
```

Expo 프로젝트 상태 확인:

```bash
npx expo-doctor
```

캐시 초기화 후 다시 실행:

```bash
npx expo start -c
```

## 현재 구현된 기능

- Start 화면
- 피부 고민 선택 화면
- 마이크 권한 안내 화면
- 실제 마이크 권한 요청
- 권한 허용 / 거부 분기
- 권한 거부 시 설정 앱 이동
- 권한 성공 화면
- Waiting demo 화면
- Measuring demo 화면
- Result demo 화면

## 아직 구현하지 않은 기능

- 실제 물소리 감지
- 실제 녹음 분석
- dB threshold 로직
- Backend API
- DB 저장
- 제품 추천 알고리즘
- 외부 서비스 연동

## 프로젝트 구조

```text
src/
  app/
    _layout.tsx
    index.tsx
  components/
    common/
    result/
    shower/
  constants/
  hooks/
  screens/
  services/
  types/

figma-reference/
```

## 주의사항

`figma-reference` 폴더는 Figma에서 다운로드한 디자인 참고용 코드입니다.

- 수정하지 않습니다.
- 실제 앱 코드에 그대로 복사하지 않습니다.
- React Native + Expo + TypeScript 기준으로 새로 구현합니다.

## 마이크 권한 안내

현재 앱은 `expo-audio`를 사용해 OS 마이크 권한 요청만 수행합니다.

AquaLog는 향후 샤워 물소리를 감지하여 샤워 시간을 자동 측정하기 위해 마이크 권한을 사용합니다. 현재 단계에서는 음성 파일을 저장하거나 서버로 전송하지 않습니다.
