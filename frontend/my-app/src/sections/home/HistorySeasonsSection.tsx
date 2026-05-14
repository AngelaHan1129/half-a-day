import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import historyBg from "../../assets/images/xiaobantian-history.jpg";

type SeasonKey = "spring" | "summer" | "autumn" | "winter";

type SeasonItem = {
  key: SeasonKey;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  months: string;
  tags: string[];
  cta: string;
  gradient: string;
  glow: string;
  image: string;
};

const seasons: SeasonItem[] = [
  {
    key: "spring",
    label: "春",
    title: "春季挖筍趣，走進甦醒的竹林",
    subtitle: "春季主題",
    description:
      "每到春季，小半天的竹林開始熱鬧起來。旅人可以跟著在地節奏認識孟宗竹、體驗挖筍活動，感受山林與農事生活交錯的春日時光。",
    months: "3–4 月",
    tags: ["挖筍體驗", "竹林導覽", "親子農遊"],
    cta: "查看春季路線",
    gradient: "from-lime-200 via-emerald-300 to-emerald-700",
    glow:
      "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_22%),radial-gradient(circle_at_70%_30%,rgba(190,242,100,0.22),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(16,185,129,0.18),transparent_30%)]",
    image: "https://picsum.photos/seed/xiaobantian-spring/1200/900",
  },
  {
    key: "summer",
    label: "夏",
    title: "夏夜茶席與星空，讓山林慢慢發光",
    subtitle: "夏季主題",
    description:
      "夏季的小半天適合延伸成夜間體驗場景，從茶席、晚風吹拂到星空氛圍，都能形成沉浸式導覽與夜間活動推薦的核心內容。",
    months: "5–8 月",
    tags: ["茶席活動", "夜間氛圍", "星空體驗"],
    cta: "查看夏季活動",
    gradient: "from-sky-200 via-cyan-300 to-blue-800",
    glow:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.32),transparent_20%),radial-gradient(circle_at_74%_28%,rgba(56,189,248,0.24),transparent_28%),radial-gradient(circle_at_52%_76%,rgba(34,211,238,0.14),transparent_30%)]",
    image: "https://picsum.photos/seed/xiaobantian-summer/1200/900",
  },
  {
    key: "autumn",
    label: "秋",
    title: "秋天的銀杏與山色，展開層層風景",
    subtitle: "秋季主題",
    description:
      "秋季可作為景觀敘事最強的一段，銀杏色彩、山景層次與茶席主題活動都很適合做視覺切換與場景推進。",
    months: "9–11 月",
    tags: ["銀杏景觀", "茶席美學", "拍照打卡"],
    cta: "查看秋季景點",
    gradient: "from-amber-200 via-yellow-300 to-orange-700",
    glow:
      "bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.36),transparent_20%),radial-gradient(circle_at_76%_24%,rgba(253,224,71,0.26),transparent_28%),radial-gradient(circle_at_48%_78%,rgba(251,146,60,0.18),transparent_30%)]",
    image: "https://picsum.photos/seed/xiaobantian-autumn/1200/900",
  },
  {
    key: "winter",
    label: "冬",
    title: "冬日雲海與靜山，讓旅程回到純粹",
    subtitle: "冬季主題",
    description:
      "冬季的小半天可以用更安靜、空氣感更強的視覺去呈現，結合雲海、冷色山景與深色介面，形成首頁後段的節奏收束。",
    months: "12–2 月",
    tags: ["雲海景觀", "山林慢旅", "靜態探索"],
    cta: "查看冬季行程",
    gradient: "from-slate-200 via-slate-400 to-slate-900",
    glow:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.34),transparent_22%),radial-gradient(circle_at_74%_30%,rgba(148,163,184,0.22),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(226,232,240,0.12),transparent_30%)]",
    image: "https://picsum.photos/seed/xiaobantian-winter/1200/900",
  },
];

const blockVariants = {
  initial: { opacity: 0, y: 28, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.985 },
};

const imageVariants = {
  initial: { opacity: 0, scale: 1.04 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

const getSeasonByProgress = (latest: number): SeasonKey => {
  if (latest < 0.68) return "spring";
  if (latest < 0.79) return "summer";
  if (latest < 0.9) return "autumn";
  return "winter";
};

const HistorySeasonsSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeSeason, setActiveSeason] = useState<SeasonKey>("spring");
  const [phase, setPhase] = useState<"history" | "seasons">("history");
  const [manualSeason, setManualSeason] = useState(false);

  const currentSeason = useMemo(
    () => seasons.find((season) => season.key === activeSeason) ?? seasons[0],
    [activeSeason]
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPhase(latest < 0.52 ? "history" : "seasons");

    if (latest < 0.52) {
      setManualSeason(false);
      return;
    }

    const nextSeason = getSeasonByProgress(latest);

    if (manualSeason) {
      if (nextSeason !== activeSeason) {
        setManualSeason(false);
        setActiveSeason(nextSeason);
      }
      return;
    }

    setActiveSeason(nextSeason);
  });

  const bgZoom = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const handleSeasonClick = (seasonKey: SeasonKey) => {
    setPhase("seasons");
    setManualSeason(true);
    setActiveSeason(seasonKey);
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[320vh] overflow-clip text-white"
    >
      <div className="sticky top-0 h-screen">
        <motion.div
          style={{ scale: bgZoom, y: bgY }}
          className="absolute inset-0"
        >
          <img
            src={historyBg}
            alt="小半天"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60" />
        </motion.div>

        <div className="relative h-full px-4 md:px-6">
          <div className="mx-auto h-full max-w-7xl">
            <AnimatePresence mode="wait">
              {phase === "history" ? (
                <motion.div
                  key="history"
                  variants={blockVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="flex h-full items-center justify-center"
                >
                  <div className="w-full max-w-5xl">
                    <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-black/20 p-6 shadow-2xl backdrop-blur-lg md:p-8">
                      <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-lime-300">
                        竹林推進 · 地方故事
                      </div>

                      <h2 className="mt-4 max-w-3xl text-[clamp(2.5rem,5vw,5rem)] font-black leading-[1.08] tracking-[-0.03em] text-white">
                        穿過竹林之後，你會看見小半天的名字從山霧裡浮現
                      </h2>

                      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                        相傳先民從東埔蚋東望，山上雲霧繚繞，彷彿身處半天之間，
                        僅見一小塊台地，因此命名為「小半天」。
                        這裡不只是山林景觀，更承載著聚落發展、農業生活與四季農遊的地方記憶。
                      </p>

                      <div className="mt-6 grid gap-3 md:grid-cols-3">
                        {[
                          { title: "歷史", desc: "開墾故事與地方由來" },
                          { title: "地景", desc: "竹林、瀑布、雲海與銀杏" },
                          { title: "體驗", desc: "四季農遊與茶席活動" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <p className="text-xs uppercase tracking-[0.18em] text-lime-300">
                              {item.title}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white md:text-base">
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="seasons"
                  variants={blockVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="flex h-full items-start justify-center pt-[12vh]"
                >
                  <div className="w-full">
                    <div className="max-w-3xl">
                      <p className="text-sm uppercase tracking-[0.24em] text-lime-300">
                        Four Seasons Journey
                      </p>

                      <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                        跟著四季，重新認識小半天
                      </h2>

                      <p className="mt-6 text-base leading-8 text-white/70 md:text-lg">
                        以季節為主軸切換旅程節奏，從春季挖筍、夏夜茶席，到秋日銀杏與冬日雲海，
                        讓首頁成為使用者探索遊程的入口。
                      </p>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                      {seasons.map((season) => {
                        const isActive = season.key === activeSeason;

                        return (
                          <button
                            key={season.key}
                            type="button"
                            onClick={() => handleSeasonClick(season.key)}
                            className={[
                              "relative rounded-full px-5 py-3 text-sm font-bold transition md:text-base",
                              isActive
                                ? "bg-lime-300 text-slate-950"
                                : "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                            ].join(" ")}
                            aria-pressed={isActive}
                          >
                            {season.label}
                            {isActive && (
                              <motion.span
                                layoutId="history-season-pill"
                                className="absolute inset-0 -z-10 rounded-full"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 30,
                                }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSeason.key + "-content"}
                          variants={blockVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.45, ease: "easeOut" }}
                          className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-8 lg:p-10"
                        >
                          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70">
                            {currentSeason.subtitle}
                          </div>

                          <h3 className="mt-5 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                            {currentSeason.title}
                          </h3>

                          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-lime-300/90">
                            {currentSeason.months}
                          </p>

                          <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
                            {currentSeason.description}
                          </p>

                          <div className="mt-8 flex flex-wrap gap-3">
                            {currentSeason.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-white/75"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-10">
                            <button className="rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-lime-200">
                              {currentSeason.cta}
                            </button>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      <div className="relative min-h-[420px] overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentSeason.key + "-image"}
                            variants={imageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            className="absolute inset-0"
                          >
                            <img
                              src={currentSeason.image}
                              alt={currentSeason.title}
                              className="h-full w-full object-cover"
                            />
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${currentSeason.gradient} opacity-40 mix-blend-overlay`}
                            />
                            <div
                              className={`absolute inset-0 ${currentSeason.glow}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                          </motion.div>
                        </AnimatePresence>

                        <div className="absolute left-6 top-6 z-10 rounded-full border border-white/15 bg-slate-950/50 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/75 backdrop-blur">
                          Seasonal Mood
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
                          <div className="max-w-md rounded-[24px] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl">
                            <p className="text-sm uppercase tracking-[0.2em] text-lime-300/90">
                              {currentSeason.label}季精選
                            </p>
                            <p className="mt-3 text-lg font-semibold text-white md:text-xl">
                              用視覺、旅程與活動切換，讓首頁每次切頁都像換了一個季節。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySeasonsSection;