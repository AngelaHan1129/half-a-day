// components/story/DoorReveal.tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import doorImage from "../../assets/images/door-bamboo.jpg";

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
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0.3, 0]); 

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0">
      {/* 滾動 overlay */}
      <motion.div
  style={{ opacity: overlayOpacity }}
  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]"
/>

      {/* 中央圓形元素 */}
      <motion.div
        style={{ scale: centerScale, opacity: centerOpacity }}
        className="absolute inset-0 grid place-items-center"
      >
      </motion.div>

      {/* 左門 */}
      <motion.div
        style={{ x: leftX }}
        className="absolute left-0 top-0 h-full w-1/2 border-r border-white/10 shadow-[inset_-12px_0_30px_rgba(0,0,0,0.18)]"
      >
        {/* 左右門的 style 設定 */}
        <div
          className="absolute inset-0  border border-white/10"
          style={{
            backgroundImage: `url(${doorImage})`,
            backgroundSize: "200% 100%",        // 讓左右門各分擔原圖的 50%
            backgroundPosition: "left center",  // 左門顯示原圖左半
            backgroundRepeat: "no-repeat",
          }}
        />
      </motion.div>

      {/* 右門 */}
      <motion.div
        style={{ x: rightX }}
        className="absolute right-0 top-0 h-full w-1/2 border-l border-white/10 shadow-[inset_12px_0_30px_rgba(0,0,0,0.18)]"
      >
        <div
          className="absolute inset-0  border border-white/10"
          style={{
            backgroundImage: `url(${doorImage})`,
            backgroundSize: "200% 100%",        // 左右門加起來是 200% 寬
            backgroundPosition: "right center", // 右門顯示原圖右半
            backgroundRepeat: "no-repeat",
          }}
        />
      </motion.div>
    </div>
  );
};

export default DoorReveal;