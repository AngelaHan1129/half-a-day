import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const DoorReveal = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.45], ["0%", "-82%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.45], ["0%", "82%"]);
  const centerScale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1.12]);
  const centerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.55], [0.35, 0.65, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0.7, 0.15]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0">
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_30%,rgba(8,15,14,0.55)_100%)]"
      />

      <motion.div
        style={{ scale: centerScale, opacity: centerOpacity }}
        className="absolute inset-0 grid place-items-center"
      >
        <div className="aspect-[16/10] w-[min(72vw,780px)] rounded-[28px] border border-white/15 bg-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-md" />
      </motion.div>

      <motion.div
        style={{ x: leftX }}
        className="absolute left-0 top-0 h-full w-1/2 border-r border-white/10 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 shadow-[inset_-12px_0_30px_rgba(0,0,0,0.18)]"
      >
        <div className="absolute inset-[6%_10%_6%_12%] rounded-[24px] border border-white/10" />
      </motion.div>

      <motion.div
        style={{ x: rightX }}
        className="absolute right-0 top-0 h-full w-1/2 border-l border-white/10 bg-gradient-to-b from-emerald-950 via-emerald-800 to-emerald-950 shadow-[inset_12px_0_30px_rgba(0,0,0,0.18)]"
      >
        <div className="absolute inset-[6%_12%_6%_10%] rounded-[24px] border border-white/10" />
      </motion.div>
    </div>
  );
};

export default DoorReveal;