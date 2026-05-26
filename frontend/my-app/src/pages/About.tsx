import { useMemo } from "react";
import { useCwaScene } from "../hooks/useCwaScene";
import { getSceneSummary } from "../utils/cwaMapper";

type StorySection = {
  eyebrow: string;
  title: string;
  content: string;
  align: "left" | "right";
  mark: string;
};

type SceneVariant =
  | "sunrise-clear"
  | "sunrise-cloudy"
  | "sunrise-rain"
  | "day-clear"
  | "day-cloudy"
  | "day-rain"
  | "sunset-clear"
  | "sunset-cloudy"
  | "sunset-rain"
  | "night-clear"
  | "night-cloudy"
  | "night-rain";

const sections: StorySection[] = [
  {
    eyebrow: "Xiaobantian",
    title: "在山霧與竹影之間，重新閱讀小半天。",
    content:
      "位於南投縣鹿谷鄉的小半天，由竹林、竹豐與和雅三村組成。這裡以茶葉、竹筍、竹炭構成著名的「三金」產業，也以雲霧繚繞的山村節律，形塑出不同於一般景點型觀光的深度農遊氣質。",
    align: "left",
    mark: "三村・三金・山村節律",
  },
  {
    eyebrow: "Bamboo Landscape",
    title: "竹林不是背景，而是地方生活的骨架。",
    content:
      "從孟宗竹的栽植、竹筍採收，到竹炭與竹編延伸工藝，竹子在小半天不只是風景，也是產業、記憶與生活技術。介面因此以竹節、竹影與柔性擺動作為主要視覺語彙。",
    align: "right",
    mark: "竹林・竹筍・竹炭",
  },
  {
    eyebrow: "Tea Rhythm",
    title: "茶園與山徑，讓旅程跟著節氣移動。",
    content:
      "小半天位在凍頂烏龍茶的重要產區，從晨霧、採茶到焙火文化，都讓這裡適合發展具有時間感的旅遊體驗。因此平台不只展示景點，而是用四季遊程與即時天氣來引導更貼近當下的探索方式。",
    align: "left",
    mark: "茶園・節氣・導覽推薦",
  },
  {
    eyebrow: "Night Sky",
    title: "夜晚的小半天，適合被安靜地看見。",
    content:
      "當白天的人潮散去，山區的風、雲、月光與民宿燈火，反而讓地方故事更有層次。這也是為什麼夜間介面應該切換成更深、更柔和的視覺氛圍，讓導覽從資訊轉變成情境。",
    align: "right",
    mark: "夜景・月相・沉浸式瀏覽",
  },
  {
    eyebrow: "Local Culture",
    title: "數位平台的價值，是讓地方知識被再次看見。",
    content:
      "從冬筍挑選、製茶發酵，到地方故事與食農教育，小半天真正珍貴的是那些原本分散在農友、職人與社區裡的知識。介面設計的任務，不只是漂亮，而是把這些內容轉成能被理解、被探索、也能被預約的入口。",
    align: "left",
    mark: "故事・技藝・智慧農遊",
  },
];

function formatTimeRange(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "資料更新中";

  const start = new Date(startTime);
  const end = new Date(endTime);

  const isValidStart = Number.isFinite(start.getTime());
  const isValidEnd = Number.isFinite(end.getTime());

  if (!isValidStart || !isValidEnd) {
    return `${startTime} ~ ${endTime}`;
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${pad(start.getMonth() + 1)}/${pad(start.getDate())} ${pad(
    start.getHours()
  )}:${pad(start.getMinutes())} ~ ${pad(end.getMonth() + 1)}/${pad(
    end.getDate()
  )} ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

function getMoonIcon(phase: string) {
  const moonMap: Record<string, string> = {
    new: "🌑",
    crescent: "🌒",
    half: "🌓",
    gibbous: "🌔",
    full: "🌕",
  };

  return moonMap[phase] ?? "🌙";
}

function getMoonLabel(phase: string) {
  const labelMap: Record<string, string> = {
    new: "新月",
    crescent: "眉月",
    half: "半月",
    gibbous: "凸月",
    full: "滿月",
  };

  return labelMap[phase] ?? phase ?? "月相";
}

function getSceneHeadline(variant: SceneVariant) {
  const map: Record<SceneVariant, string> = {
    "sunrise-clear": "晨光剛越過山線，竹影與茶園慢慢亮起來。",
    "sunrise-cloudy": "清晨的雲層壓低了山谷，光線變得安靜而柔霧。",
    "sunrise-rain": "天剛亮，細雨已先落進竹林與山徑。",
    "day-clear": "順著山霧、茶園與竹影，走進小半天的節氣節奏。",
    "day-cloudy": "雲影覆上山頭，整座聚落像被霧輕輕包住。",
    "day-rain": "雨絲落下後，小半天更適合慢慢走、慢慢看。",
    "sunset-clear": "橘紅晚霞滑過山線，聚落與茶園都染上一層餘光。",
    "sunset-cloudy": "日落被厚雲揉成灰橘色，山村顯得更沉穩。",
    "sunset-rain": "黃昏的雨幕讓山谷更深，燈火也更早亮起。",
    "night-clear": "夜色落進山谷，雲霧仍在竹林之間緩慢流動。",
    "night-cloudy": "夜雲掩住月光，山村只留下微弱而安靜的亮面。",
    "night-rain": "雨夜裡的山村更安靜，只剩燈火與濕潤月色。",
  };

  return map[variant];
}

export default function About() {
  const { sceneState, sceneMeta, loading, error } = useCwaScene({
    locationName: "鹿谷鄉",
    countyName: "南投縣",
    datasetId: "F-D0047-023",
  });

  const sceneVariant = useMemo<SceneVariant>(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const isNight = sceneState.timePhase === "night";

    const isSunrise = !isNight && currentHour >= 5 && currentHour <= 7;
    const isSunset = !isNight && currentHour >= 17 && currentHour <= 18;

    if (isNight) {
      if (sceneState.weatherMood === "rainy") return "night-rain";
      if (sceneState.weatherMood === "cloudy") return "night-cloudy";
      return "night-clear";
    }

    if (isSunrise) {
      if (sceneState.weatherMood === "rainy") return "sunrise-rain";
      if (sceneState.weatherMood === "cloudy") return "sunrise-cloudy";
      return "sunrise-clear";
    }

    if (isSunset) {
      if (sceneState.weatherMood === "rainy") return "sunset-rain";
      if (sceneState.weatherMood === "cloudy") return "sunset-cloudy";
      return "sunset-clear";
    }

    if (sceneState.weatherMood === "rainy") return "day-rain";
    if (sceneState.weatherMood === "cloudy") return "day-cloudy";
    return "day-clear";
  }, [sceneState.timePhase, sceneState.weatherMood]);

  const isNightScene = sceneVariant.startsWith("night");
  const isCloudyScene = sceneVariant.includes("cloudy");
  const isRainyScene = sceneVariant.includes("rain");
  const heroClass = `about-hero hero-${sceneVariant}`;

  const weatherLabel = sceneMeta.weatherText ?? "資料更新中";
  const validTime = formatTimeRange(sceneMeta.startTime, sceneMeta.endTime);
  const sceneSummary = getSceneSummary(sceneState);
  const moonPhaseValue = sceneState.moonPhase ?? "crescent";

  const heroTags = useMemo(() => {
    const tags = [
      `${sceneMeta.countyName}・${sceneMeta.locationName}`,
      `天氣｜${weatherLabel}`,
      `場景｜${sceneSummary}`,
    ];

    if ((sceneMeta.pop ?? 0) > 0) {
      tags.push(`降雨機率｜${sceneMeta.pop}%`);
    }

    tags.push(`預報區間｜${validTime}`);

    if (isNightScene) {
      tags.push(`月相｜${getMoonLabel(moonPhaseValue)}`);
    }

    return tags;
  }, [
    sceneMeta.countyName,
    sceneMeta.locationName,
    weatherLabel,
    sceneSummary,
    sceneMeta.pop,
    validTime,
    isNightScene,
    moonPhaseValue,
  ]);

  const heroTitle = getSceneHeadline(sceneVariant);

  const heroText = isRainyScene
    ? "目前天氣偏濕潤，平台可優先引導茶席、竹炭與室內食農體驗，讓行程更貼近山區天候。"
    : isCloudyScene
    ? "現在的山區氣氛適合慢走與深度探索，從竹林步道到聚落故事，都能在雲影之間被更柔和地看見。"
    : "天氣較穩定，適合串連步道、茶園與聚落節點，展開一段跨村落的智慧農遊旅程。";

  return (
    <main
      className={`about-page ${
        isNightScene ? "theme-night" : "theme-day"
      } ${
        isRainyScene
          ? "weather-rainy"
          : isCloudyScene
          ? "weather-cloudy"
          : "weather-clear"
      }`}
      style={{ color: "var(--app-text)" }}
    >
      <style>{`
        @keyframes mistFloatA {
          0% { transform: translate3d(-4%, 0, 0) scale(1); opacity: 0.18; }
          50% { transform: translate3d(5%, -2%, 0) scale(1.08); opacity: 0.3; }
          100% { transform: translate3d(-4%, 0, 0) scale(1); opacity: 0.18; }
        }

        @keyframes mistFloatB {
          0% { transform: translate3d(4%, 0, 0) scale(1.02); opacity: 0.12; }
          50% { transform: translate3d(-3%, 3%, 0) scale(1.1); opacity: 0.22; }
          100% { transform: translate3d(4%, 0, 0) scale(1.02); opacity: 0.12; }
        }

        @keyframes bambooSway {
          0% { transform: rotate(0deg) translateX(0); }
          50% { transform: rotate(1.2deg) translateX(4px); }
          100% { transform: rotate(0deg) translateX(0); }
        }

        @keyframes leafSway {
          0% { transform: rotate(0deg) translate3d(0, 0, 0); }
          50% { transform: rotate(-2.5deg) translate3d(4px, -2px, 0); }
          100% { transform: rotate(0deg) translate3d(0, 0, 0); }
        }

        @keyframes fadeRise {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.16; transform: scale(1); }
          50% { opacity: 0.46; transform: scale(1.18); }
        }

        @keyframes rainDrop {
          0% { transform: translateY(-10px); opacity: 0; }
          20% { opacity: 0.5; }
          100% { transform: translateY(46px); opacity: 0; }
        }

        @keyframes ambientFloatSlow {
          0% { transform: translate3d(-2%, 0, 0) scale(1); }
          50% { transform: translate3d(2%, -2%, 0) scale(1.06); }
          100% { transform: translate3d(-2%, 0, 0) scale(1); }
        }

        @keyframes ambientFloatWide {
          0% { transform: translate3d(2%, 0, 0) scale(1.02); }
          50% { transform: translate3d(-3%, 2%, 0) scale(1.08); }
          100% { transform: translate3d(2%, 0, 0) scale(1.02); }
        }

        @keyframes ambientPulse {
          0%, 100% { opacity: 0.16; transform: scale(1); }
          50% { opacity: 0.28; transform: scale(1.08); }
        }

        @keyframes ambientStarDrift {
          0% { transform: translateY(0); opacity: 0.28; }
          50% { transform: translateY(-8px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 0.28; }
        }

        @keyframes ambientRainFall {
          0% { transform: translate3d(0, -24px, 0); opacity: 0; }
          18% { opacity: 0.45; }
          100% { transform: translate3d(-12px, 140px, 0); opacity: 0; }
        }

        @keyframes cloudDrift {
          0% { transform: translateX(-5%); }
          50% { transform: translateX(5%); }
          100% { transform: translateX(-5%); }
        }

        @keyframes watermark-wiggle {
          0%, 100% { transform: translateY(-50%) rotate(-2deg); }
          50% { transform: translateY(-53%) rotate(2deg) scale(1.03); }
        }

        .about-page {
          position: relative;
          min-height: 100vh;
          /* 加上 overflow-x 防止左右跑版爆出螢幕 */
          overflow-x: hidden;
          isolation: isolate;
          background: linear-gradient(180deg, var(--app-bg) 0%, color-mix(in srgb, var(--app-bg) 93%, var(--app-text) 7%) 100%);
        }

        .page-ambient {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .page-content {
          position: relative;
          z-index: 2;
        }

        .ambient-gradient, .ambient-orb, .ambient-mist, .ambient-ridges, .ambient-stars, .ambient-rain, .ambient-moon-glow, .page-fog, .page-bamboo {
          position: absolute;
          pointer-events: none;
        }

        .ambient-gradient {
          filter: blur(60px);
          opacity: 0.34;
          animation: ambientFloatWide 24s ease-in-out infinite;
        }

        .ambient-gradient-a { top: -10%; left: -10%; width: 30rem; height: 30rem; background: color-mix(in srgb, var(--app-accent) 18%, transparent); }
        .ambient-gradient-b { top: 24%; right: -10%; width: 28rem; height: 24rem; background: color-mix(in srgb, var(--app-accent-2) 14%, transparent); animation-delay: -8s; }
        .ambient-gradient-c { bottom: 8%; left: 18%; width: 34rem; height: 18rem; background: color-mix(in srgb, var(--app-text) 8%, transparent); animation-delay: -14s; }

        .ambient-orb { border-radius: 999px; filter: blur(80px); animation: ambientPulse 14s ease-in-out infinite; }
        .ambient-orb-a { top: 12%; right: 12%; width: 14rem; height: 14rem; background: color-mix(in srgb, var(--app-accent) 12%, transparent); }
        .ambient-orb-b { bottom: 12%; left: 8%; width: 18rem; height: 18rem; background: color-mix(in srgb, var(--app-accent-2) 10%, transparent); animation-delay: -6s; }

        .ambient-mist { left: -8%; right: -8%; border-radius: 999px; filter: blur(46px); opacity: 0.22; animation: ambientFloatSlow 22s ease-in-out infinite; }
        .ambient-mist-top { top: 8%; height: 9rem; background: color-mix(in srgb, var(--app-surface) 20%, transparent); }
        .ambient-mist-mid { top: 34%; height: 12rem; background: color-mix(in srgb, var(--app-card) 15%, transparent); animation-delay: -7s; }
        .ambient-mist-bottom { bottom: 10%; height: 10rem; background: color-mix(in srgb, var(--app-surface) 12%, transparent); animation-delay: -12s; }

        .page-fog { left: -8rem; right: -8rem; bottom: 3rem; height: 18rem; border-radius: 999px; filter: blur(76px); background: color-mix(in srgb, var(--app-surface) 30%, transparent); animation: ambientFloatSlow 26s ease-in-out infinite; }
        .page-fog::before, .page-fog::after { content: ""; position: absolute; border-radius: 999px; filter: blur(24px); }
        .page-fog::before { left: 10%; top: -5rem; width: 28rem; height: 12rem; background: color-mix(in srgb, var(--app-card) 15%, transparent); }
        .page-fog::after { right: 12%; top: -1rem; width: 34rem; height: 14rem; background: color-mix(in srgb, var(--app-surface) 10%, transparent); }

        .page-bamboo { top: 0; bottom: 0; width: 18rem; opacity: 0.12; filter: blur(1px); }
        .page-bamboo-left { left: 0; background: linear-gradient(90deg, transparent 0 14%, color-mix(in srgb, var(--app-accent) 20%, transparent) 14% 16%, transparent 16% 28%, color-mix(in srgb, var(--app-accent) 16%, transparent) 28% 30%, transparent 30% 42%, color-mix(in srgb, var(--app-accent) 14%, transparent) 42% 44%, transparent 44%); }
        .page-bamboo-right { right: 0; background: linear-gradient(90deg, transparent 0 58%, color-mix(in srgb, var(--app-accent) 14%, transparent) 58% 60%, transparent 60% 72%, color-mix(in srgb, var(--app-accent) 18%, transparent) 72% 74%, transparent 74% 86%, color-mix(in srgb, var(--app-accent) 22%, transparent) 86% 88%, transparent 88%); }

        .ambient-ridges { left: -8%; right: -8%; border-radius: 45% 55% 0 0 / 100% 100% 0 0; }
        .ambient-ridges-back { bottom: 26%; height: 18rem; opacity: 0.12; background: linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 18%, transparent) 0%, color-mix(in srgb, var(--app-text) 14%, transparent) 100%); }
        .ambient-ridges-mid { bottom: 6%; height: 14rem; opacity: 0.16; background: linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 16%, transparent) 0%, color-mix(in srgb, var(--app-text) 18%, transparent) 100%); }

        .ambient-stars { inset: 0; opacity: 0.58; background: radial-gradient(circle at 12% 16%, color-mix(in srgb, var(--app-text) 70%, white) 0 1px, transparent 1.8px), radial-gradient(circle at 24% 28%, color-mix(in srgb, var(--app-text) 42%, white) 0 1px, transparent 1.7px), radial-gradient(circle at 68% 14%, color-mix(in srgb, var(--app-text) 62%, white) 0 1px, transparent 1.8px), radial-gradient(circle at 78% 24%, color-mix(in srgb, var(--app-text) 42%, white) 0 1.1px, transparent 1.9px); animation: ambientStarDrift 8s ease-in-out infinite; }
        .ambient-moon-glow { top: 8%; right: 10%; width: 12rem; height: 12rem; border-radius: 999px; background: radial-gradient(circle, color-mix(in srgb, var(--app-accent-2) 18%, transparent) 0%, color-mix(in srgb, var(--app-accent-2) 8%, transparent) 38%, transparent 68%); filter: blur(10px); opacity: 0.72; }
        
        .ambient-rain { inset: 0; overflow: hidden; opacity: 0.72; }
        .ambient-rain span { position: absolute; top: -10%; width: 1.4px; height: 96px; border-radius: 999px; background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--app-accent) 26%, transparent)); animation: ambientRainFall 2.8s linear infinite; }

        .about-hero {
          position: relative;
          min-height: 760px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid var(--app-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.03) 18%, color-mix(in srgb, var(--app-surface) 12%, transparent) 64%, color-mix(in srgb, var(--app-card) 34%, transparent) 100%), var(--hero-sky, linear-gradient(180deg, rgba(210,225,218,0.35), rgba(39,53,44,0.85)));
          box-shadow: var(--app-shadow);
        }

        .tea-lines {
          position: absolute; left: -8%; right: -8%; bottom: 10%; height: 22%; opacity: 0.18;
          background:
            radial-gradient(120% 100% at 50% 100%, transparent 60%, color-mix(in srgb, var(--app-text) 10%, transparent) 60.6%, transparent 62%),
            radial-gradient(120% 100% at 50% 100%, transparent 48%, color-mix(in srgb, var(--app-text) 9%, transparent) 48.6%, transparent 50%),
            radial-gradient(120% 100% at 50% 100%, transparent 36%, color-mix(in srgb, var(--app-text) 8%, transparent) 36.6%, transparent 38%);
        }

        .bamboo-grove, .bamboo-leaves { position: absolute; inset: 0; pointer-events: none; }
        .bamboo-stalk {
          position: absolute; bottom: -6%; border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.18) 20%, color-mix(in srgb, var(--app-accent) 42%, rgba(62,98,67,0.9)) 42%, color-mix(in srgb, var(--app-accent) 24%, rgba(40,72,48,0.9)) 72%, rgba(10,20,14,0.3) 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 32px rgba(50,90,60,0.08);
          transform-origin: bottom center; animation: bambooSway 11s ease-in-out infinite;
        }

        .bamboo-stalk::before { content: ""; position: absolute; inset: 0; border-radius: inherit; background: repeating-linear-gradient(to bottom, transparent 0 48px, rgba(18,28,20,0.18) 48px 50px, rgba(230,245,220,0.08) 50px 52px, transparent 52px 96px); mix-blend-mode: soft-light; }
        .bamboo-stalk::after { content: ""; position: absolute; top: 0; bottom: 0; left: 28%; width: 2px; background: rgba(255,255,255,0.12); opacity: 0.55; filter: blur(0.3px); }

        .stalk-1 { left: 4%; height: 82%; width: 20px; opacity: 0.74; }
        .stalk-2 { left: 10%; height: 88%; width: 16px; opacity: 0.58; animation-delay: -2s; }
        .stalk-3 { left: 16%; height: 76%; width: 14px; opacity: 0.5; animation-delay: -4s; }
        .stalk-4 { right: 5%; height: 84%; width: 19px; opacity: 0.76; animation-delay: -1s; }
        .stalk-5 { right: 11%; height: 90%; width: 15px; opacity: 0.6; animation-delay: -3s; }
        .stalk-6 { right: 17%; height: 72%; width: 14px; opacity: 0.48; animation-delay: -5s; }

        .leaf-cluster { position: absolute; width: 180px; height: 140px; transform-origin: center; animation: leafSway 9s ease-in-out infinite; opacity: 0.78; }
        .leaf-cluster span { position: absolute; width: 78px; height: 14px; border-radius: 999px 10px 999px 10px; background: linear-gradient(90deg, color-mix(in srgb, var(--app-accent) 48%, rgba(164,212,142,0.85)) 0%, color-mix(in srgb, var(--app-accent) 20%, rgba(72,115,65,0.88)) 68%, rgba(34,60,36,0.88) 100%); box-shadow: inset 0 0 8px rgba(255,255,255,0.04); transform-origin: left center; }

        .leaf-left-a { left: 6%; top: 14%; animation-delay: -1s; }
        .leaf-left-b { left: 12%; top: 32%; width: 160px; height: 120px; animation-delay: -4s; }
        .leaf-right-a { right: 4%; top: 16%; animation-delay: -2s; }
        .leaf-right-b { right: 11%; top: 34%; width: 160px; height: 120px; animation-delay: -5s; }

        .leaf-left-a span:nth-child(1) { left: 10px; top: 18px; transform: rotate(18deg); }
        .leaf-left-a span:nth-child(2) { left: 42px; top: 38px; width: 82px; transform: rotate(6deg); }
        .leaf-left-a span:nth-child(3) { left: 12px; top: 62px; width: 74px; transform: rotate(-12deg); }
        .leaf-left-a span:nth-child(4) { left: 54px; top: 82px; width: 72px; transform: rotate(-24deg); }
        .leaf-left-b span:nth-child(1) { left: 6px; top: 16px; width: 70px; transform: rotate(24deg); }
        .leaf-left-b span:nth-child(2) { left: 28px; top: 42px; width: 76px; transform: rotate(10deg); }
        .leaf-left-b span:nth-child(3) { left: 6px; top: 68px; width: 68px; transform: rotate(-10deg); }
        .leaf-left-b span:nth-child(4) { left: 34px; top: 90px; width: 74px; transform: rotate(-22deg); }
        .leaf-right-a span:nth-child(1) { right: 8px; top: 18px; transform: rotate(162deg); }
        .leaf-right-a span:nth-child(2) { right: 40px; top: 40px; width: 82px; transform: rotate(174deg); }
        .leaf-right-a span:nth-child(3) { right: 12px; top: 64px; width: 74px; transform: rotate(192deg); }
        .leaf-right-a span:nth-child(4) { right: 52px; top: 86px; width: 70px; transform: rotate(204deg); }
        .leaf-right-b span:nth-child(1) { right: 4px; top: 16px; width: 70px; transform: rotate(156deg); }
        .leaf-right-b span:nth-child(2) { right: 26px; top: 42px; width: 76px; transform: rotate(170deg); }
        .leaf-right-b span:nth-child(3) { right: 4px; top: 68px; width: 68px; transform: rotate(188deg); }
        .leaf-right-b span:nth-child(4) { right: 32px; top: 92px; width: 74px; transform: rotate(202deg); }

        .mist-layer { position: absolute; border-radius: 999px; filter: blur(58px); pointer-events: none; }
        .mist-a { top: -2rem; left: -4rem; width: 18rem; height: 18rem; background: color-mix(in srgb, var(--app-accent) 16%, transparent); animation: mistFloatA 18s ease-in-out infinite; }
        .mist-b { right: -4rem; bottom: 2rem; width: 22rem; height: 12rem; background: color-mix(in srgb, var(--app-accent-2) 14%, transparent); animation: mistFloatB 22s ease-in-out infinite; }
        .mist-c { left: 18%; bottom: 18%; width: 28rem; height: 8rem; background: color-mix(in srgb, var(--app-surface) 20%, transparent); animation: mistFloatB 20s ease-in-out infinite; }

        .cloud-layer { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .cloud { position: absolute; border-radius: 999px; filter: blur(24px); animation: cloudDrift 28s ease-in-out infinite; }
        .cloud-1 { top: 12%; left: 10%; width: 260px; height: 80px; background: color-mix(in srgb, var(--app-text) 15%, transparent); }
        .cloud-2 { top: 22%; right: 12%; width: 320px; height: 96px; background: color-mix(in srgb, var(--app-text) 12%, transparent); animation-delay: -10s; }
        .cloud-3 { top: 30%; left: 26%; width: 240px; height: 74px; background: color-mix(in srgb, var(--app-text) 10%, transparent); animation-delay: -18s; }

        .moon-icon { position: absolute; top: 10%; right: 10%; z-index: 2; font-size: 4rem; opacity: 0.9; filter: drop-shadow(0 0 18px color-mix(in srgb, var(--app-accent-2) 30%, transparent)); }
        
        /* 修正跑版關鍵：hero-content 相對定位定牢，不讓 Flexbox 撐爆 */
        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 2.5rem 1.5rem;
          animation: fadeRise 900ms ease both;
        }

        .hero-panel {
          position: relative;
          z-index: 20;
          max-width: 54rem;
          border: 1px solid var(--app-border);
          border-radius: 20px;
          background: var(--app-surface);
          backdrop-filter: blur(20px);
          box-shadow: var(--app-shadow);
          padding: 2rem;
        }

        .hero-kicker { color: var(--app-accent); letter-spacing: 0.24em; font-weight: bold; }
        .hero-title { color: var(--app-text); font-weight: 900; }
        .hero-text { color: var(--app-text-muted); line-height: 1.8; }
        
        .hero-meta-card {
          margin-top: 1.25rem; display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
          border: 1px solid var(--app-border); background: var(--app-card); border-radius: 12px; padding: 0.6rem 1rem;
        }

        .hero-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.25rem; }
        .hero-tag {
          border: 1px solid var(--app-border); background: var(--app-card); color: var(--app-text-muted);
          border-radius: 999px; padding: 0.45rem 0.85rem; font-size: 0.85rem;
        }

        .hero-status { margin-top: 1rem; border-radius: 12px; padding: 0.85rem 1rem; font-size: 0.9rem; }
        .hero-status.loading { border: 1px solid var(--app-border); background: var(--app-card); color: var(--app-text-muted); }
        .hero-status.error { border: 1px solid rgba(244, 63, 94, 0.2); background: rgba(244, 63, 94, 0.05); color: #e11d48; }

        .story-wrap { margin-top: 2rem; padding: 1rem 0; background: transparent; }
        .story-section { position: relative; display: grid; align-items: center; padding: 4rem 0; animation: fadeRise 900ms ease both; }
        
        .story-section::before {
          content: ""; position: absolute; top: 0; left: 5%; right: 5%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--app-border), transparent);
          border-top: 1px dashed var(--app-border);
        }

        .story-inner { position: relative; z-index: 10; width: 100%; border: 2px solid transparent; padding: 2rem; transition: all 0.4s ease; }
        
        .story-section:hover .story-inner {
          background: var(--app-card);
          border-color: var(--app-border);
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
          box-shadow: var(--app-shadow);
        }

        .story-kicker { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--app-accent); font-weight: bold; display: flex; align-items: center; }
        .story-kicker::before { content: "✦"; margin-right: 0.4rem; color: var(--app-accent-2); }
        .story-title { margin-top: 0.75rem; font-size: 1.6rem; line-height: 1.4; font-weight: 900; color: var(--app-text); tracking-wide; }
        .story-text { margin-top: 1rem; font-size: 0.95rem; line-height: 1.85; color: var(--app-text-muted); }
        
        .story-mark { margin-top: 1.25rem; display: flex; align-items: center; gap: 0.5rem; color: var(--app-accent); font-size: 0.85rem; font-weight: bold; }
        .story-mark::before { content: ""; width: 2rem; height: 6px; border-radius: 4px; background: color-mix(in srgb, var(--app-accent) 30%, transparent); }

        .story-glow { position: absolute; width: 18rem; height: 8rem; border-radius: 999px; filter: blur(52px); opacity: 0.12; pointer-events: none; }
        .story-section.align-left .story-glow { right: 10%; top: 28%; background: color-mix(in srgb, var(--app-accent) 14%, transparent); }
        .story-section.align-right .story-glow { left: 8%; top: 32%; background: color-mix(in srgb, var(--app-accent-2) 14%, transparent); }

        .story-watermark {
          position: absolute; font-family: serif; font-style: italic; font-size: clamp(6rem, 12vw, 12rem); font-weight: 900;
          line-height: 1; color: color-mix(in srgb, var(--app-accent) 6%, transparent); z-index: 0; pointer-events: none;
          user-select: none; top: 50%; transform: translateY(-50%); transition: all 0.4s ease;
        }
        .story-section:hover .story-watermark {
          color: color-mix(in srgb, var(--app-accent-2) 15%, transparent);
          animation: watermark-wiggle 3s ease-in-out infinite;
        }

        .weather-clear .ambient-rain { display: none; }

        @media (min-width: 1024px) {
          /* 修正跑版關鍵 2：將原本無限撐開的 7rem gap 改為合理值 2rem */
          .story-section { grid-template-columns: repeat(12, 1fr); gap: 2rem; }
          /* 調整跨度以補足失去的超寬 Gap 空間 */
          .story-section.align-left .story-inner { grid-column: 1 / 9; }
          .story-section.align-right .story-inner { grid-column: 5 / 13; }
          .story-section.align-left .story-watermark { right: 8%; }
          .story-section.align-right .story-watermark { left: 8%; }
        }

        @media (max-width: 768px) {
          .stalk-2, .stalk-5, .bamboo-grove, .bamboo-leaves { display: none; }
          .about-hero { min-height: 520px; }
          .story-inner { padding: 1rem; border-radius: 16px !important; }
          .story-watermark { top: 4%; right: 4%; transform: none !important; font-size: 5rem; opacity: 0.6; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mist-a, .mist-b, .mist-c, .bamboo-stalk, .leaf-cluster, .sky-points, .hero-content, .story-section, .rain-layer span, .ambient-gradient, .ambient-orb, .ambient-mist, .ambient-stars, .ambient-rain span, .cloud, .page-fog {
            animation: none !important;
          }
        }
      `}</style>

      {/* 2D大畫布與生境圖層 */}
      <div className="page-ambient" aria-hidden="true">
        <div className="ambient-gradient ambient-gradient-a" />
        <div className="ambient-gradient ambient-gradient-b" />
        <div className="ambient-gradient ambient-gradient-c" />

        <div className="ambient-orb ambient-orb-a" />
        <div className="ambient-orb ambient-orb-b" />

        <div className="ambient-mist ambient-mist-top" />
        <div className="ambient-mist ambient-mist-mid" />
        <div className="ambient-mist ambient-mist-bottom" />

        <div className="page-fog" />

        <div className="page-bamboo page-bamboo-left" />
        <div className="page-bamboo page-bamboo-right" />

        <div className="ambient-ridges ambient-ridges-back" />
        <div className="ambient-ridges ambient-ridges-mid" />

        {isNightScene && <div className="ambient-stars" />}
        {isNightScene && <div className="ambient-moon-glow" />}

        {isRainyScene && (
          <div className="ambient-rain">
            {Array.from({ length: 24 }).map((_, index) => (
              <span
                key={index}
                style={{
                  left: `${index * 4.2}%`,
                  animationDelay: `${(index % 7) * 0.18}s`,
                  opacity: 0.05 + (index % 5) * 0.03,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 主面板排版區塊 */}
      <div className="page-content mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <section className={heroClass}>
          {/* 將 hero-art 的 Z-index 歸零，防止擠壓與穿透 */}
          <div className="hero-art">
            <div className="mountain mountain-back" />
            <div className="mountain mountain-mid" />
            <div className="mountain mountain-front" />
            <div className="tea-lines" />

            <div className="bamboo-grove">
              <div className="bamboo-stalk stalk-1" />
              <div className="bamboo-stalk stalk-2" />
              <div className="bamboo-stalk stalk-3" />
              <div className="bamboo-stalk stalk-4" />
              <div className="bamboo-stalk stalk-5" />
              <div className="bamboo-stalk stalk-6" />
            </div>

            <div className="bamboo-leaves">
              <div className="leaf-cluster leaf-left-a">
                <span /><span /><span /><span />
              </div>
              <div className="leaf-cluster leaf-left-b">
                <span /><span /><span /><span />
              </div>
              <div className="leaf-cluster leaf-right-a">
                <span /><span /><span /><span />
              </div>
              <div className="leaf-cluster leaf-right-b">
                <span /><span /><span /><span />
              </div>
            </div>

            <div className="mist-layer mist-a" />
            <div className="mist-layer mist-b" />
            <div className="mist-layer mist-c" />

            {isCloudyScene && (
              <div className="cloud-layer" aria-hidden="true">
                <span className="cloud cloud-1" />
                <span className="cloud cloud-2" />
                <span className="cloud cloud-3" />
              </div>
            )}

            {isNightScene && <div className="sky-points" />}

            {isNightScene && (
              <div className="moon-icon" aria-hidden="true">
                {getMoonIcon(moonPhaseValue)}
              </div>
            )}

            {isRainyScene && (
              <div className="rain-layer" aria-hidden="true">
                {Array.from({ length: 14 }).map((_, index) => (
                  <span
                    key={index}
                    style={{
                      left: `${6 + index * 6.8}%`,
                      animationDelay: `${(index % 5) * 0.25}s`,
                      opacity: 0.12 + (index % 3) * 0.06,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="hero-content">
            <div className="hero-panel">
              <p className="hero-kicker text-xs uppercase">✦ Live Climate Scene</p>

              <h1 className="hero-title mt-3 text-2xl font-black tracking-wide md:text-4xl">
                {heroTitle}
              </h1>

              <p className="hero-text mt-4 text-sm md:text-base">
                {heroText}
              </p>

              <div className="hero-meta-card text-xs font-medium text-[var(--app-text-muted)] flex items-center gap-2">
                <span className="text-[var(--app-accent)] font-bold">南投鹿谷鄉即時同步</span>
                <span>•</span>
                <span>預報區間：{validTime}</span>
              </div>

              {loading && (
                <div className="hero-status loading flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent"></span>
                  正在連線氣象署讀取最新山區預報...
                </div>
              )}

              {!loading && error && (
                <div className="hero-status error">
                  無法讀取即時天候：{error}
                </div>
              )}

              <div className="hero-tags">
                {heroTags.map((tag) => (
                  <span key={tag} className="hero-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="story-wrap">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className={`story-section ${
                section.align === "right" ? "align-right" : "align-left"
              }`}
            >
              <div className="story-watermark">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="story-inner">
                <p className="story-kicker">{section.eyebrow}</p>
                <h2 className="story-title">{section.title}</h2>
                <p className="story-text">{section.content}</p>
                <div className="story-mark">
                  <span>{section.mark}</span>
                </div>
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}