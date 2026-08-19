import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import {
  Mic, Droplets, ChevronRight, X, Check,
  AlertTriangle, ArrowLeft, Settings, ExternalLink,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Design tokens
───────────────────────────────────────────── */
const C = {
  primary:    "#7091E6",
  primaryDim: "rgba(112,145,230,0.15)",
  peach:      "#FFD0B6",
  peachDeep:  "#F4956A",
  teal:       "#6DC8A4",
  bg:         "#F8F9FA",
  surface:    "#FFFFFF",
  textHi:     "#2B2D42",
  textMd:     "#4A4E69",
  textLo:     "#8D99AE",
  alert:      "#FF8FA3",
  alertDim:   "rgba(255,143,163,0.14)",
  border:     "rgba(43,45,66,0.08)",
  deepBg:     "#12203A",         // measuring screen
  deepRing:   "rgba(112,145,230,0.22)",
} as const;

/* Pretendard → system Korean fallback */
const F = "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const sans = { fontFamily: F } as const;

/* Card shadow */
const cardShadow = "0 4px 24px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03)";

/* ─────────────────────────────────────────────
   Types & constants
───────────────────────────────────────────── */
type Screen =
  | "start" | "skin-concern" | "mic-permission"
  | "permission-success" | "permission-denied"
  | "waiting" | "measuring" | "result";

const SKIN_CONCERNS = ["건조함", "당김", "민감함", "여드름", "트러블", "칙칙함", "모공", "주름"];
const SKIN_STATES   = [
  { emoji: "😖", label: "건조함", value: "dry"    },
  { emoji: "😐", label: "보통",   value: "normal" },
  { emoji: "😊", label: "촉촉함", value: "moist"  },
];
const CARE_PRODUCTS = [
  {
    key: "pith",
    icon: "🌿",
    title: "PITH 딥 칼밍 세럼",
    subtitle: "샤워 후 즉각 진정 케어",
    desc: "히알루론산 3중 + 판테놀 7% 복합 처방",
    badge: "PITH Store",
    color: C.teal,
    sheetTitle: "PITH 딥 칼밍 세럼",
    sheetDesc: "샤워 직후 열감 진정과 수분 공급을 동시에. 히알루론산 3중 분자 + 판테놀 7% 복합 처방으로 피부 장벽을 빠르게 회복합니다.",
    cta: "PITH Store에서 보기",
  },
  {
    key: "clinic",
    icon: "🏥",
    title: "DERNA 피부 클리닉",
    subtitle: "웰니스 맞춤 상담 안내",
    desc: "전문의가 제안하는 개인화된 피부 루틴",
    badge: "클리닉 상담",
    color: C.primary,
    sheetTitle: "DERNA 웰니스 피부 상담",
    sheetDesc: "AquaLog 데이터를 기반으로 피부과 전문의와 맞춤 상담을 진행합니다. 샤워 습관과 피부 상태 기록을 활용한 개인화된 루틴을 제안받으세요.",
    cta: "DERNA 상담 예약하기",
  },
];
const RECOMMENDED = 300;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* ─────────────────────────────────────────────
   Phone shell (no notch — outer frame handles chrome)
───────────────────────────────────────────── */
function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Status bar
───────────────────────────────────────────── */
function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "rgba(255,255,255,0.5)" : C.textLo;
  return (
    <div className="flex items-center justify-between px-7 text-xs font-semibold"
      style={{ paddingTop: "16px", paddingBottom: "6px", color, ...sans }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="4" width="3" height="8" rx="1" fill="currentColor" opacity=".35"/>
          <rect x="4.5" y="2" width="3" height="10" rx="1" fill="currentColor" opacity=".6"/>
          <rect x="9" y="0" width="3" height="12" rx="1" fill="currentColor"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 2.4C10.3 2.4 12.4 3.4 13.8 5L15.3 3.4C13.5 1.3 10.9 0 8 0C5.1 0 2.5 1.3.7 3.4L2.2 5C3.6 3.4 5.7 2.4 8 2.4Z" fill="currentColor" opacity=".4"/>
          <path d="M8 5.3C9.6 5.3 11 6 12 7.1L13.5 5.5C12.1 4 10.2 3.1 8 3.1C5.8 3.1 3.9 4 2.5 5.5L4 7.1C5 6 6.4 5.3 8 5.3Z" fill="currentColor" opacity=".7"/>
          <circle cx="8" cy="10" r="2" fill="currentColor"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="w-6 h-3 rounded-[3px] border" style={{ borderColor: "currentColor" }}>
            <div className="w-3/4 h-full rounded-[2px]" style={{ background: "currentColor" }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Progress dots
───────────────────────────────────────────── */
function ProgressDots({ step, total = 4 }: { step: number; total?: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1 rounded-full transition-all duration-300"
          style={{
            width: i === step ? 20 : 10,
            background: i <= step ? C.primary : C.border,
          }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 1 — Start
═══════════════════════════════════════════ */
function StartScreen({ onNext }: { onNext: () => void }) {
  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen relative overflow-hidden" style={{ background: C.bg }}>
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle at 70% 30%, rgba(112,145,230,0.12) 0%, transparent 65%)` }}/>
        <div className="absolute bottom-40 -left-12 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(255,208,182,0.18) 0%, transparent 70%)` }}/>

        <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
          {/* Logo */}
          <div className="mb-7">
            <div className="w-[56px] h-[56px] rounded-[18px] flex items-center justify-center mb-5"
              style={{ background: C.primary, boxShadow: `0 8px 24px rgba(112,145,230,0.35)` }}>
              <Droplets size={24} color="#fff"/>
            </div>
            <h1 className="text-[40px] font-bold leading-none tracking-tight mb-2"
              style={{ color: C.textHi, ...sans }}>
              AquaLog
            </h1>
            <div className="w-7 h-[2.5px] rounded-full mb-4" style={{ background: C.primary }}/>
            <p className="text-[16px] leading-[1.55] font-medium" style={{ color: C.textMd, ...sans }}>
              자동 샤워 케어로<br/>피부 건강을 지키세요
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-2.5">
            {[
              { icon: "🎙️", text: "물소리 자동 감지 — 앱 터치 불필요" },
              { icon: "⏱️", text: "샤워 시간 실시간 측정 및 기록"    },
              { icon: "🌿", text: "피부 상태 기반 맞춤 케어 추천"     },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: C.surface, boxShadow: cardShadow }}>
                <span className="text-base w-6 text-center">{f.icon}</span>
                <span className="text-sm font-medium" style={{ color: C.textMd, ...sans }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 relative z-10">
          <button onClick={onNext}
            className="w-full flex items-center justify-center gap-2 rounded-[18px] py-[18px] text-[17px] font-bold text-white transition-transform active:scale-[0.97]"
            style={{ background: C.primary, boxShadow: `0 8px 24px rgba(112,145,230,0.3)`, ...sans }}>
            시작하기 <ChevronRight size={20}/>
          </button>
          <p className="text-center text-xs mt-3 font-medium" style={{ color: C.textLo, ...sans }}>
            무료로 시작 · 광고 없음
          </p>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 2 — Skin Concern Selector
═══════════════════════════════════════════ */
function SkinConcernScreen({
  selected, onToggle, onBack, onNext,
}: { selected: string[]; onToggle: (c: string) => void; onBack: () => void; onNext: () => void }) {
  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen" style={{ background: C.bg }}>
        {/* Nav row */}
        <div className="flex items-center justify-between px-5 pt-10 pb-2">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-black/5">
            <ArrowLeft size={22} color={C.textHi}/>
          </button>
          <ProgressDots step={0}/>
          <div className="w-10"/>
        </div>

        {/* Heading */}
        <div className="px-6 pt-2 pb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.textLo, ...sans }}>
            Step 1 / 4
          </p>
          <h2 className="text-[24px] font-bold leading-[1.35]" style={{ color: C.textHi, ...sans }}>
            현재 가장 큰<br/>피부 고민은 무엇인가요?
          </h2>
          <p className="text-sm mt-2 font-medium" style={{ color: C.textLo, ...sans }}>복수 선택 가능합니다</p>
        </div>

        {/* Chips grid */}
        <div className="flex-1 overflow-y-auto px-6" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
          <div className="grid grid-cols-2 gap-3 pb-6">
            {SKIN_CONCERNS.map((c) => {
              const on = selected.includes(c);
              return (
                <button key={c} onClick={() => onToggle(c)}
                  className="py-[18px] px-5 rounded-2xl text-sm font-semibold text-left transition-all active:scale-95 flex flex-col gap-2.5"
                  style={{
                    border: `2px solid ${on ? C.primary : "transparent"}`,
                    background: on ? C.primaryDim : C.surface,
                    color: on ? C.primary : C.textHi,
                    boxShadow: on ? `0 0 0 0px transparent` : cardShadow,
                    ...sans,
                  }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
                    style={{ background: on ? C.primary : C.muted }}>
                    {on && <Check size={11} color="#fff"/>}
                  </div>
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next */}
        <div className="px-6 pb-10 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
          <button onClick={onNext} disabled={selected.length === 0}
            className="w-full rounded-[18px] py-[18px] text-[17px] font-bold transition-all active:scale-[0.97]"
            style={{
              background: selected.length > 0 ? C.primary : C.border,
              color: selected.length > 0 ? "#fff" : C.textLo,
              boxShadow: selected.length > 0 ? `0 8px 24px rgba(112,145,230,0.28)` : "none",
              ...sans,
            }}>
            다음 {selected.length > 0 && `(${selected.length}개 선택됨)`}
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 3 — Mic Permission Bottom Sheet
═══════════════════════════════════════════ */
function MicPermissionScreen({
  onBack, onAllow, onDeny,
}: { onBack: () => void; onAllow: () => void; onDeny: () => void }) {
  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen relative" style={{ background: C.bg }}>
        {/* Nav */}
        <div className="flex items-center justify-between px-5 pt-10 pb-2">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-black/5">
            <ArrowLeft size={22} color={C.textHi}/>
          </button>
          <ProgressDots step={1}/>
          <div className="w-10"/>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
          <div className="relative w-28 h-28 mb-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: C.primaryDim }}/>
            <div className="absolute inset-3 rounded-full" style={{ background: C.primaryDim }}/>
            <div className="absolute inset-7 rounded-full flex items-center justify-center"
              style={{ background: `rgba(112,145,230,0.2)` }}>
              <Mic size={28} color={C.primary}/>
            </div>
          </div>
          <h2 className="text-[22px] font-bold text-center leading-[1.35] mb-3"
            style={{ color: C.textHi, ...sans }}>
            마이크 접근을<br/>허용해 주세요
          </h2>
          <p className="text-sm text-center leading-relaxed font-medium" style={{ color: C.textMd, ...sans }}>
            물소리 감지를 통해 샤워 시작을<br/>자동으로 인식합니다
          </p>
        </div>

        {/* Bottom sheet */}
        <div className="rounded-t-[32px] px-6 pt-6 pb-10"
          style={{ background: C.surface, boxShadow: "0 -4px 32px rgba(0,0,0,0.06)" }}>
          <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: C.border }}/>
          <h3 className="text-[18px] font-bold mb-5" style={{ color: C.textHi, ...sans }}>
            왜 마이크 권한이 필요한가요?
          </h3>
          <div className="space-y-4 mb-7">
            {[
              { icon: "🎙️", text: "물소리 감지를 통한 자동 측정에만 사용됩니다" },
              { icon: "🔒", text: "음성은 절대 녹음되거나 서버에 저장되지 않습니다" },
              { icon: "📊", text: "소리 크기(dB)만 분석하며 내용은 처리되지 않습니다" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-[19px] mt-0.5 w-7 text-center flex-shrink-0">{item.icon}</span>
                <p className="text-sm font-medium leading-relaxed" style={{ color: C.textMd, ...sans }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <button onClick={onAllow}
              className="w-full rounded-[18px] py-[17px] text-[16px] font-bold text-white transition-transform active:scale-[0.97]"
              style={{ background: C.primary, boxShadow: `0 8px 24px rgba(112,145,230,0.28)`, ...sans }}>
              권한 허용하기
            </button>
            <button onClick={onDeny}
              className="w-full py-3 text-sm font-semibold transition-opacity active:opacity-60"
              style={{ color: C.textLo, ...sans }}>
              나중에
            </button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 4a — Permission Success
═══════════════════════════════════════════ */
function PermissionSuccessScreen({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 2200);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen items-center justify-center px-8" style={{ background: C.bg }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(109,200,164,0.14)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: C.teal, boxShadow: "0 8px 24px rgba(109,200,164,0.35)" }}>
            <Check size={28} color="#fff" strokeWidth={2.5}/>
          </div>
        </div>
        <h2 className="text-[26px] font-bold text-center mb-3" style={{ color: C.textHi, ...sans }}>
          준비 완료!
        </h2>
        <p className="text-base text-center font-medium" style={{ color: C.textMd, ...sans }}>
          이제 측정 화면으로 이동합니다
        </p>
        <div className="flex gap-1.5 mt-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: C.primary, animationDelay: `${i * 0.22}s` }}/>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 4b — Permission Denied
═══════════════════════════════════════════ */
function PermissionDeniedScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen" style={{ background: C.bg }}>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: C.alertDim }}>
            <AlertTriangle size={32} color={C.alert}/>
          </div>
          <h2 className="text-[22px] font-bold mb-3" style={{ color: C.textHi, ...sans }}>
            자동 측정 불가
          </h2>
          <p className="text-sm font-medium leading-relaxed mb-8" style={{ color: C.textMd, ...sans }}>
            자동 측정을 위해 마이크 권한이 필요합니다.<br/>
            설정에서 권한을 변경하면<br/>다시 사용할 수 있습니다.
          </p>
          <div className="w-full space-y-3">
            <button
              className="w-full rounded-[18px] py-[17px] text-[16px] font-bold flex items-center justify-center gap-2 text-white transition-transform active:scale-[0.97]"
              style={{ background: C.textHi, ...sans }}>
              <Settings size={18}/> 설정에서 변경하기
            </button>
            <button onClick={onRetry}
              className="w-full rounded-[18px] py-[17px] text-[16px] font-bold transition-transform active:scale-[0.97]"
              style={{ border: `1.5px solid ${C.border}`, color: C.textHi, background: C.surface, ...sans }}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 5 — Waiting (Idle)
═══════════════════════════════════════════ */
function WaitingScreen({ onStart }: { onStart: () => void }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen" style={{ background: C.bg }}>
        {/* App bar */}
        <div className="flex items-center justify-between px-6 pt-10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: C.primary }}>
              <Droplets size={14} color="#fff"/>
            </div>
            <span className="text-sm font-bold" style={{ color: C.textHi, ...sans }}>AquaLog</span>
          </div>
          {/* Listening indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-700"
            style={{
              background: pulse ? C.primaryDim : "rgba(43,45,66,0.05)",
              border: `1px solid ${pulse ? "rgba(112,145,230,0.3)" : "transparent"}`,
            }}>
            <div className="w-1.5 h-1.5 rounded-full transition-colors duration-700"
              style={{ background: pulse ? C.primary : C.textLo }}/>
            <span className="text-[11px] font-semibold" style={{ color: C.textMd, ...sans }}>
              마이크 감지 중
            </span>
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Breathing idle rings */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-10">
            {[{ s: "w-full h-full", d: 0 }, { s: "w-36 h-36", d: 0.5 }, { s: "w-24 h-24", d: 1 }].map((r, i) => (
              <div key={i}
                className={`absolute rounded-full ${r.s}`}
                style={{
                  background: C.primaryDim,
                  animation: `idle-breathe 3.5s ease-in-out infinite`,
                  animationDelay: `${r.d}s`,
                }}/>
            ))}
            <div className="absolute w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: C.primary, boxShadow: `0 8px 24px rgba(112,145,230,0.35)` }}>
              <Mic size={22} color="#fff"/>
            </div>
          </div>

          <h2 className="text-[22px] font-bold text-center leading-[1.4] px-8 mb-3"
            style={{ color: C.textHi, ...sans }}>
            샤워를 시작하면<br/>자동으로 측정됩니다
          </h2>
          <p className="text-sm text-center font-medium" style={{ color: C.textLo, ...sans }}>
            물소리가 감지되면 타이머가 시작됩니다
          </p>
        </div>

        {/* Demo CTA */}
        <div className="px-6 pb-10">
          <button onClick={onStart}
            className="w-full rounded-[18px] py-[17px] text-[16px] font-bold transition-transform active:scale-[0.97]"
            style={{ border: `2px solid ${C.primary}`, color: C.primary, background: "transparent", ...sans }}>
            시뮬레이션 시작 →
          </button>
          <p className="text-center text-xs mt-2.5 font-medium" style={{ color: C.textLo, ...sans }}>
            데모 모드 · 터치로 측정을 시작합니다
          </p>
        </div>
      </div>

      <style>{`
        @keyframes idle-breathe {
          0%, 100% { transform: scale(0.88); opacity: 0.6; }
          50%       { transform: scale(1.08); opacity: 1;   }
        }
      `}</style>
    </PhoneShell>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 6 — Measuring + Time Alert
═══════════════════════════════════════════ */
function MeasuringScreen({
  seconds, showTimeAlert, onDismissAlert, onStop,
}: { seconds: number; showTimeAlert: boolean; onDismissAlert: () => void; onStop: () => void }) {
  const isOver = seconds >= RECOMMENDED;
  const pct    = Math.min(seconds / RECOMMENDED, 1);

  return (
    <PhoneShell>
      <style>{`
        @keyframes breathe-ring {
          0%, 100% { transform: scale(0.85); opacity: 0.12; }
          50%       { transform: scale(1.20); opacity: 0.28; }
        }
        @keyframes breathe-ring-mid {
          0%, 100% { transform: scale(0.88); opacity: 0.18; }
          50%       { transform: scale(1.16); opacity: 0.32; }
        }
        @keyframes breathe-ring-inner {
          0%, 100% { transform: scale(0.92); opacity: 0.22; }
          50%       { transform: scale(1.12); opacity: 0.38; }
        }
      `}</style>

      <div className="flex flex-col min-h-screen relative overflow-hidden"
        style={{
          background: isOver ? "#1F1221" : C.deepBg,
          transition: "background 0.8s ease",
        }}>

        {/* Breathing gradient circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[320px] h-[320px] rounded-full"
            style={{
              background: isOver ? "rgba(255,143,163,0.15)" : `rgba(112,145,230,0.15)`,
              animation: "breathe-ring 4s ease-in-out infinite",
            }}/>
          <div className="absolute w-[220px] h-[220px] rounded-full"
            style={{
              background: isOver ? "rgba(255,143,163,0.2)" : `rgba(112,145,230,0.2)`,
              animation: "breathe-ring-mid 4s ease-in-out infinite 0.7s",
            }}/>
          <div className="absolute w-[140px] h-[140px] rounded-full"
            style={{
              background: isOver ? "rgba(255,143,163,0.25)" : `rgba(112,145,230,0.25)`,
              animation: "breathe-ring-inner 4s ease-in-out infinite 1.4s",
            }}/>
        </div>

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: isOver
            ? "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255,143,163,0.1) 0%, transparent 70%)"
            : "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(112,145,230,0.15) 0%, transparent 70%)",
        }}/>

        {/* Timer content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          {/* Arc progress ring */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-6">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 224 224" fill="none">
              <circle cx="112" cy="112" r="100"
                stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
              <circle cx="112" cy="112" r="100"
                stroke={isOver ? C.alert : C.primary}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 100}`}
                strokeDashoffset={`${2 * Math.PI * 100 * (1 - pct)}`}
                style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.5s ease" }}/>
            </svg>

            <div className="text-center">
              {/* BIG timer — 72px, readable from a distance */}
              <div className="leading-none tabular-nums font-bold"
                style={{
                  fontSize: "72px",
                  color: isOver ? C.alert : "#fff",
                  fontFamily: "'DM Sans', 'Pretendard Variable', Pretendard, sans-serif",
                  fontVariantNumeric: "tabular-nums",
                  transition: "color 0.5s ease",
                }}>
                {fmt(seconds)}
              </div>
              <p className="text-xs font-semibold mt-2" style={{ color: "rgba(255,255,255,0.38)", ...sans }}>
                권장 {fmt(RECOMMENDED)}
              </p>
            </div>
          </div>

          {/* Status badge */}
          {isOver ? (
            <div className="px-5 py-2 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,143,163,0.18)", color: C.alert, ...sans }}>
              권장 시간 초과 중
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "rgba(112,145,230,0.7)" }}/>
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.38)", ...sans }}>
                측정 중
              </span>
            </div>
          )}
        </div>

        {/* Stop button */}
        <div className="px-6 pb-10 relative z-10">
          <button onClick={onStop}
            className="w-full rounded-[18px] py-[17px] text-[16px] font-bold transition-transform active:scale-[0.97]"
            style={{ border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", background: "transparent", ...sans }}>
            샤워 종료
          </button>
        </div>

        {/* Time limit alert modal */}
        {showTimeAlert && (
          <div className="absolute inset-0 flex items-end z-30"
            style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="w-full rounded-t-[32px] px-6 pt-6 pb-10"
              style={{ background: C.surface }}>
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: C.border }}/>
              <div className="text-center">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-[20px] font-bold mb-2" style={{ color: C.textHi, ...sans }}>
                  권장 시간을 넘겼습니다
                </h3>
                <p className="text-sm font-medium leading-relaxed mb-7" style={{ color: C.textMd, ...sans }}>
                  샤워를 마무리해 주세요.<br/>
                  긴 샤워는 피부 장벽을 약화시킬 수 있습니다.
                </p>
                <div className="space-y-3">
                  <button onClick={onStop}
                    className="w-full rounded-[18px] py-[17px] text-[16px] font-bold text-white transition-transform active:scale-[0.97]"
                    style={{ background: C.primary, boxShadow: `0 8px 24px rgba(112,145,230,0.28)`, ...sans }}>
                    샤워 종료하기
                  </button>
                  <button onClick={onDismissAlert}
                    className="w-full py-3 text-sm font-semibold" style={{ color: C.textLo, ...sans }}>
                    계속 측정
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 7 — Result Summary + Care
═══════════════════════════════════════════ */
function ResultScreen({
  seconds, skinState, onSkinState, onRestart,
}: {
  seconds: number;
  skinState: string | null;
  onSkinState: (s: string) => void;
  onRestart: () => void;
}) {
  const [careSheet, setCareSheet] = useState<typeof CARE_PRODUCTS[number] | null>(null);
  const isOver   = seconds > RECOMMENDED;
  const actualMin = +(seconds / 60).toFixed(1);
  const recMin    = +(RECOMMENDED / 60).toFixed(1);

  const chartData = [
    { name: "실제", value: actualMin, fill: isOver ? C.alert : C.primary },
    { name: "권장", value: recMin,    fill: C.teal },
  ];

  return (
    <PhoneShell>
      <div className="flex flex-col min-h-screen relative" style={{ background: C.bg }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: C.primary }}>
              <Droplets size={14} color="#fff"/>
            </div>
            <span className="text-sm font-bold" style={{ color: C.textHi, ...sans }}>오늘의 기록</span>
          </div>
          <button onClick={onRestart}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg active:bg-black/5"
            style={{ color: C.textLo, ...sans }}>
            홈으로
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-10"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>

          {/* ── Summary card ── */}
          <div className="px-5 mb-4">
            <div className="rounded-3xl p-5"
              style={{
                background: isOver
                  ? `linear-gradient(135deg, rgba(255,143,163,0.12) 0%, rgba(255,208,182,0.1) 100%)`
                  : `linear-gradient(135deg, rgba(112,145,230,0.1) 0%, rgba(109,200,164,0.08) 100%)`,
                border: `1px solid ${isOver ? "rgba(255,143,163,0.2)" : "rgba(112,145,230,0.15)"}`,
              }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: isOver ? C.alert : C.primary, ...sans }}>
                {isOver ? "권장 시간보다 길었어요" : "오늘도 피부를 지켜내셨어요!"}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[40px] font-bold leading-none" style={{ color: C.textHi, ...sans }}>
                    {fmt(seconds)}
                  </div>
                  <p className="text-xs mt-1.5 font-semibold" style={{ color: C.textLo, ...sans }}>
                    권장 시간 {fmt(RECOMMENDED)}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    background: isOver ? C.alertDim : C.primaryDim,
                    color: isOver ? C.alert : C.primary,
                    ...sans,
                  }}>
                  {isOver
                    ? `+${fmt(seconds - RECOMMENDED)} 초과`
                    : `${fmt(RECOMMENDED - seconds)} 여유`}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bar chart ── */}
          <div className="px-5 mb-4">
            <p className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: C.textLo, ...sans }}>시간 비교 (분)</p>
            <div className="rounded-2xl p-4" style={{ background: C.surface, boxShadow: cardShadow }}>
              <ResponsiveContainer width="100%" height={148}>
                <BarChart data={chartData} barSize={52} barCategoryGap="45%">
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fontSize: 12, fill: C.textLo, fontFamily: F }}/>
                  <YAxis hide domain={[0, Math.max(actualMin, recMin) * 1.4]}/>
                  <Bar dataKey="value" radius={[12, 12, 4, 4]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill}/>)}
                    <LabelList dataKey="value" position="top"
                      formatter={(v: number) => `${v}분`}
                      style={{ fontSize: "12px", fontWeight: 700, fill: C.textMd, fontFamily: F }}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Skin state log ── */}
          <div className="px-5 mb-4">
            <div className="rounded-2xl p-5" style={{ background: C.surface, boxShadow: cardShadow }}>
              <p className="text-sm font-bold mb-0.5" style={{ color: C.textHi, ...sans }}>
                오늘 피부 상태는 어땠나요?
              </p>
              <p className="text-xs font-medium mb-4" style={{ color: C.textLo, ...sans }}>
                샤워 후 피부 느낌을 기록해 주세요
              </p>
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {SKIN_STATES.map((s) => {
                  const on = skinState === s.value;
                  return (
                    <button key={s.value} onClick={() => onSkinState(s.value)}
                      className="flex flex-col items-center py-3.5 rounded-2xl transition-all active:scale-95"
                      style={{
                        border: `2px solid ${on ? C.primary : "transparent"}`,
                        background: on ? C.primaryDim : C.bg,
                      }}>
                      <span className="text-[26px] mb-1">{s.emoji}</span>
                      <span className="text-xs font-semibold" style={{ color: on ? C.primary : C.textMd, ...sans }}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {!skinState && (
                <button className="w-full text-center text-xs py-1 font-semibold"
                  style={{ color: C.textLo, ...sans }}>
                  나중에 기록하기
                </button>
              )}
              {skinState && (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: C.teal }}>
                    <Check size={10} color="#fff"/>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: C.teal, ...sans }}>기록 완료</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Care recommendation cards ── */}
          <div className="px-5 mb-4">
            <p className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: C.textLo, ...sans }}>맞춤 케어 추천</p>
            <div className="space-y-3">
              {CARE_PRODUCTS.map((p) => (
                <button key={p.key} onClick={() => setCareSheet(p)}
                  className="w-full rounded-2xl p-4 text-left flex items-center gap-4 transition-transform active:scale-[0.97]"
                  style={{ background: C.surface, boxShadow: cardShadow }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: `${p.color}18` }}>
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: C.textHi, ...sans }}>{p.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: p.color, ...sans }}>
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: C.textMd, ...sans }}>{p.subtitle}</p>
                    <p className="text-[11px] font-medium mt-0.5" style={{ color: C.textLo, ...sans }}>{p.desc}</p>
                  </div>
                  <ChevronRight size={16} color={C.textLo} className="flex-shrink-0"/>
                </button>
              ))}
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <div className="px-8 pb-4">
            <p className="text-[11px] text-center font-medium leading-relaxed"
              style={{ color: C.textLo, ...sans }}>
              ⚠️ 해당 정보는 의료 진단이 아닌 웰니스 추천입니다.<br/>
              피부 관련 의학적 문제는 전문의와 상담하세요.
            </p>
          </div>
        </div>

        {/* ── Care bottom sheet ── */}
        {careSheet && (
          <div className="absolute inset-0 flex items-end z-20"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={() => setCareSheet(null)}>
            <div className="w-full rounded-t-[32px] px-6 pt-5 pb-10"
              style={{ background: C.surface }}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-1 rounded-full opacity-0"/>
                <div className="w-10 h-1 rounded-full" style={{ background: C.border }}/>
                <button onClick={() => setCareSheet(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ background: C.bg }}>
                  <X size={16} color={C.textMd}/>
                </button>
              </div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${careSheet.color}18` }}>
                  {careSheet.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                      style={{ background: careSheet.color, ...sans }}>
                      {careSheet.badge}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-bold" style={{ color: C.textHi, ...sans }}>
                    {careSheet.sheetTitle}
                  </h3>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-7" style={{ color: C.textMd, ...sans }}>
                {careSheet.sheetDesc}
              </p>
              <button
                className="w-full rounded-[18px] py-[17px] text-[16px] font-bold flex items-center justify-center gap-2 text-white transition-transform active:scale-[0.97]"
                style={{ background: careSheet.color, ...sans }}>
                <ExternalLink size={16}/>
                {careSheet.cta}
              </button>
              <p className="text-center text-[11px] font-medium mt-3" style={{ color: C.textLo, ...sans }}>
                해당 정보는 의료 진단이 아닌 웰니스 추천입니다
              </p>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

/* ═══════════════════════════════════════════
   ROOT — App shell
═══════════════════════════════════════════ */
export default function App() {
  const [screen,           setScreen]           = useState<Screen>("start");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [seconds,          setSeconds]          = useState(0);
  const [showTimeAlert,    setShowTimeAlert]    = useState(false);
  const [skinState,        setSkinState]        = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (screen === "measuring") {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (next === RECOMMENDED) setShowTimeAlert(true);
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen]);

  const stopMeasuring = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowTimeAlert(false);
    setScreen("result");
  };

  const restart = () => {
    setSeconds(0);
    setSkinState(null);
    setSelectedConcerns([]);
    setScreen("start");
  };

  const toggle = (c: string) =>
    setSelectedConcerns((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  return (
    <div className="min-h-screen" style={{ fontFamily: F }}>
      {screen === "start" && (
        <StartScreen onNext={() => setScreen("skin-concern")}/>
      )}
      {screen === "skin-concern" && (
        <SkinConcernScreen
          selected={selectedConcerns}
          onToggle={toggle}
          onBack={() => setScreen("start")}
          onNext={() => setScreen("mic-permission")}
        />
      )}
      {screen === "mic-permission" && (
        <MicPermissionScreen
          onBack={() => setScreen("skin-concern")}
          onAllow={() => setScreen("permission-success")}
          onDeny={() => setScreen("permission-denied")}
        />
      )}
      {screen === "permission-success" && (
        <PermissionSuccessScreen onNext={() => setScreen("waiting")}/>
      )}
      {screen === "permission-denied" && (
        <PermissionDeniedScreen onRetry={() => setScreen("mic-permission")}/>
      )}
      {screen === "waiting" && (
        <WaitingScreen onStart={() => { setSeconds(0); setScreen("measuring"); }}/>
      )}
      {screen === "measuring" && (
        <MeasuringScreen
          seconds={seconds}
          showTimeAlert={showTimeAlert}
          onDismissAlert={() => setShowTimeAlert(false)}
          onStop={stopMeasuring}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          seconds={seconds}
          skinState={skinState}
          onSkinState={setSkinState}
          onRestart={restart}
        />
      )}
    </div>
  );
}
