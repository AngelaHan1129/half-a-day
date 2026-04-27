import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DoorReveal from "../../components/story/DoorReveal";
import { PATHS } from "../../app/router/paths";
import logo from "../../assets/小半天logo.svg";
import heroBg from "../../assets/images/xiaobantian-hero.jpg";

const bgImage = heroBg;

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[200vh] overflow-clip text-white">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="小半天山林茶園風景"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/28 to-lime-50/20"></div>
<div className="absolute inset-0 bg-black/8"></div>
      </div>

      <DoorReveal />

      <div className="sticky top-0 z-10 grid min-h-screen place-items-center px-4 md:px-6">
        <div className="grid w-full max-w-6xl gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mx-auto"
          >
            <img
              src={logo}
              alt="小半天休閒農業區 Logo"
              className="mx-auto w-[320px] brightness-0 invert drop-shadow-[0_18px_48px_rgba(0,0,0,0.45)] md:w-[520px] xl:w-[680px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => navigate(PATHS.spots)}
              className="rounded-full bg-lime-300 px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-lime-200"
            >
              開始探索景點
            </button>

            <button
              onClick={() => navigate(PATHS.ar)}
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
            >
              體驗 AR 導覽
            </button>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="mt-2 grid place-items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/70"
          >
            <span>Scroll to open</span>
            <span className="text-2xl">↓</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;