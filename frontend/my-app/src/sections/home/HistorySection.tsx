import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const bambooStalksLeft = [0, 1, 2, 3, 4];
const bambooStalksRight = [0, 1, 2, 3];

const HistorySection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const mistY = useTransform(scrollYProgress, [0, 1], [80, -100]);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0.2, 0.6, 0.35, 0.15]);

  const contentY = useTransform(scrollYProgress, [0, 0.45, 1], [100, 0, -30]);
  const contentOpacity = useTransform(scrollYProgress, [0.05, 0.22, 0.9], [0, 1, 1]);
  const contentScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.92, 1, 1.02]);

  const leftLayerY = useTransform(scrollYProgress, [0, 1], [140, -140]);
  const rightLayerY = useTransform(scrollYProgress, [0, 1], [90, -110]);

  const leftLeafX = useTransform(scrollYProgress, [0, 1], [-30, 20]);
  const rightLeafX = useTransform(scrollYProgress, [0, 1], [30, -24]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[220vh] overflow-clip bg-[linear-gradient(180deg,#f1f8ea_0%,#bfd8b4_18%,#5d7f64_52%,#1e3026_78%,#08110d_100%)] text-white"
    >
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <motion.div
          style={{ scale: bgScale }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.35),transparent_32%),radial-gradient(circle_at_50%_52%,rgba(229,255,214,0.18),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.28)_100%)]" />
        </motion.div>

        <motion.div
          style={{ y: mistY, opacity: mistOpacity }}
          className="absolute inset-0"
        >
          <div className="absolute left-[5%] top-[12%] h-56 w-56 rounded-full bg-white/20 blur-3xl md:h-72 md:w-72" />
          <div className="absolute right-[8%] top-[24%] h-72 w-72 rounded-full bg-lime-100/10 blur-3xl md:h-96 md:w-96" />
          <div className="absolute bottom-[18%] left-[25%] h-40 w-80 rounded-full bg-white/10 blur-3xl" />
        </motion.div>

        <motion.div
          style={{ y: leftLayerY, x: leftLeafX }}
          className="absolute inset-y-0 left-[-4%] z-[2] hidden w-[28%] md:block"
        >
          {bambooStalksLeft.map((item) => (
            <div
              key={item}
              className="absolute bottom-[-8%] rounded-full bg-[linear-gradient(180deg,rgba(37,88,53,0.95),rgba(15,45,24,0.96))] shadow-[inset_-4px_0_8px_rgba(255,255,255,0.12),inset_6px_0_14px_rgba(0,0,0,0.25)]"
              style={{
                left: `${item * 16 + 4}%`,
                width: `${item % 2 === 0 ? 18 : 14}px`,
                height: `${92 + item * 10}%`,
              }}
            />
          ))}

          <div className="absolute left-[18%] top-[14%] h-32 w-24 rotate-[-24deg] rounded-full bg-lime-200/10 blur-2xl" />
          <div className="absolute left-[35%] top-[35%] h-24 w-20 rotate-[18deg] rounded-full bg-lime-100/10 blur-xl" />
          <div className="absolute left-[8%] bottom-[24%] h-40 w-28 rotate-[18deg] rounded-full bg-emerald-200/10 blur-2xl" />
        </motion.div>

        <motion.div
          style={{ y: rightLayerY, x: rightLeafX }}
          className="absolute inset-y-0 right-[-4%] z-[2] hidden w-[24%] md:block"
        >
          {bambooStalksRight.map((item) => (
            <div
              key={item}
              className="absolute bottom-[-8%] rounded-full bg-[linear-gradient(180deg,rgba(29,77,44,0.96),rgba(10,30,18,0.98))] shadow-[inset_-4px_0_8px_rgba(255,255,255,0.1),inset_6px_0_14px_rgba(0,0,0,0.25)]"
              style={{
                right: `${item * 18 + 6}%`,
                width: `${item % 2 === 0 ? 16 : 12}px`,
                height: `${95 + item * 9}%`,
              }}
            />
          ))}

          <div className="absolute right-[20%] top-[18%] h-28 w-24 rotate-[22deg] rounded-full bg-lime-100/10 blur-2xl" />
          <div className="absolute right-[8%] top-[42%] h-24 w-20 rotate-[-22deg] rounded-full bg-emerald-200/10 blur-xl" />
          <div className="absolute right-[18%] bottom-[28%] h-44 w-28 rotate-[-16deg] rounded-full bg-lime-200/10 blur-2xl" />
        </motion.div>

        <div className="relative z-10 grid min-h-screen place-items-center px-4 md:px-6">
          <motion.div
            style={{
              y: contentY,
              opacity: contentOpacity,
              scale: contentScale,
            }}
            className="w-full max-w-5xl"
          >
            <div className="mx-auto max-w-4xl rounded-[32px] border border-white/15 bg-slate-950/35 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10 lg:p-12">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/75">
                竹林推進 · 地方故事
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                穿過竹林之後，
                <br />
                你會看見小半天的名字從山霧裡浮現
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-8 text-white/80 md:text-lg">
                相傳先民從東埔蚋東望，山上雲霧繚繞，彷彿身處半天之間，
                僅見一小塊台地，因此命名為「小半天」。
                這裡不只是山林景觀，更承載著聚落發展、農業生活與四季農遊的地方記憶。
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-lime-300">
                    歷史
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    開墾故事與地方由來
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    從先民開拓到聚落形成，這片台地一路累積成今日的小半天。
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-lime-300">
                    地景
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    竹林、瀑布、雲海與銀杏
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    山霧與林相交錯，形成最具沉浸感的在地風景。
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-lime-300">
                    體驗
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    四季農遊與茶席活動
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    依季節展開的旅程，讓使用者不只是看見，也能走進地方生活。
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75">
                  竹林村
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75">
                  竹豐村
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75">
                  和雅村
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08110d] to-transparent" />
      </div>
    </section>
  );
};

export default HistorySection;