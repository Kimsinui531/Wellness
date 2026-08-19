export const colors = {
  primary: '#7091E6',
  primaryDim: 'rgba(112,145,230,0.15)',
  peach: '#FFD0B6',
  peachDeep: '#F4956A',
  teal: '#6DC8A4',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  textHi: '#2B2D42',
  textMd: '#4A4E69',
  textLo: '#8D99AE',
  alert: '#FF8FA3',
  alertDim: 'rgba(255,143,163,0.14)',
  border: 'rgba(43,45,66,0.08)',
  deepBg: '#12203A',
  deepRing: 'rgba(112,145,230,0.22)',
  muted: '#F0F2F8',
} as const;

export type ColorToken = keyof typeof colors;
