import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import historyBg from "../../assets/images/xiaobantian-history.jpg";

const HistorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 背景：固定不動，只有輕微縮放
  const bgScale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1.05, 1, 1, 1]);
  // 內容：縮小、往上、透明
  const contentScale = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [1, 1, 0.8, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0, 0, -20, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[160vh] overflow-clip text-white"
    >
      <div className="sticky top-0 min-h-screen">
        {/* 背景照片（固定） */}
        <motion.div
          style={{ scale: bgScale }}
          className="absolute inset-0"
        >
          <img
            src={historyBg}
            alt="小半天歷史文化"
            className="h-full w-full object-cover"
          />
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/30 to-slate-950/70" />
        </motion.div>

        {/* 內容區：隨著 scroll 往上縮小、最後消失 */}
        <div className="relative z-10 grid min-h-screen place-items-center px-4 md:px-6">
          <motion.div
            style={{
              scale: contentScale,
              y: contentY,
              opacity: contentOpacity,
            }}
            className="w-full max-w-5xl"
          >
            <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-lg md:p-12">
              {/* 標題、內文、卡片等內容不變 */}
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-lime-300">
                竹林推進 · 地方故事
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                穿過竹林之後，<br />
                你會看見小半天的名字從山霧裡浮現
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-8 text-white/90 md:text-lg">
                相傳先民從東埔蚋東望，山上雲霧繚繞，彷彿身處半天之間，
                僅見一小塊台地，因此命名為「小半天」。
                這裡不只是山林景觀，更承載著聚落發展、農業生活與四季農遊的地方記憶。
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  { title: "歷史", desc: "開墾故事與地方由來" },
                  { title: "地景", desc: "竹林、瀑布、雲海與銀杏" },
                  { title: "體驗", desc: "四季農遊與茶席活動" },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-lime-300">{item.title}</p>
                    <p className="mt-2 font-semibold text-white">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;