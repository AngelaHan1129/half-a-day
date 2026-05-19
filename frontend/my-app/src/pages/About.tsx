import React from "react";

const About = () => {
  const sections = [
    {
      eyebrow: "Xiaobantian",
      title: "霧裡的小半天",
      content:
        "小半天位在南投鹿谷，主要由竹林、竹豐與和雅三個村落組成，海拔大約在 800 到 1200 公尺左右。因為地形與山勢的關係，這裡經常被雲霧環繞，遠看像是漂浮在半山雲海之中，也因此有了這個充滿畫面感的名字。孟宗竹林與茶園景觀，是這裡最鮮明的風景，也讓小半天成為一個適合慢慢走進去、靜靜感受的山村。",
      align: "left",
      mark: "雲霧、竹海、茶園層層展開",
    },
    {
      eyebrow: "Bamboo Battlefield",
      title: "孟宗竹林古戰場",
      content:
        "說到小半天，最具代表性的景點之一就是孟宗竹林古戰場。步道兩側高聳濃密的孟宗竹，自然形成安靜的綠色隧道，林間空氣清新、光線柔和，也讓這裡成為很多人喜歡健行與攝影的地點。相傳此地與林爽文抗清最後戰役有關，現場也保留象棋殘局意象，讓竹林景致多了一層歷史痕跡。",
      align: "right",
      mark: "竹影深處，仍留著歷史的痕跡",
    },
    {
      eyebrow: "Ecology",
      title: "森林裡的四季生態",
      content:
        "因為海拔與氣候條件良好，小半天擁有相當豐富的森林生態。除了大量竹類植物，鳥類、昆蟲與山林環境也很多樣，一年四季都有不同風景。春夏滿山翠綠，秋冬常有雲海與竹霧交錯；若在春季來訪，也有機會遇上春筍與賞螢等季節限定體驗，讓旅程更多了幾分自然的驚喜。",
      align: "left",
      mark: "春筍、螢光、竹霧與山林氣息",
    },
    {
      eyebrow: "Night Sky",
      title: "夜裡的觀星山村",
      content:
        "喜歡看星星的話，小半天也是很迷人的隱藏版選擇。由於地勢較高、環境相對寧靜，入夜後的天空顯得乾淨而開闊。近年地方旅遊體驗也逐漸把夜晚景色、山林氛圍與觀星感受結合在一起，讓小半天不只白天適合慢遊，到了晚上也有另一種安靜而迷人的層次。",
      align: "right",
      mark: "白日看竹海，入夜看星光",
    },
    {
      eyebrow: "Culture",
      title: "竹與茶交織的日常",
      content:
        "小半天的發展一直與竹林和茶葉緊密相連。早期居民的生活幾乎離不開孟宗竹，從竹藝編織、燒製竹炭到竹製工藝，都能看見竹文化留下的痕跡；而茶園景觀與品茗日常，則構成另一種屬於山村的生活節奏。直到今天，這裡依然保有濃厚的農村景觀與人情味。",
      align: "left",
      mark: "茶香與竹韻，留在山村生活裡",
    },
  ];

  return (
    <main
      className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24"
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
          0% { transform: rotate(0deg) translate3d(0,0,0); }
          50% { transform: rotate(-2.5deg) translate3d(4px,-2px,0); }
          100% { transform: rotate(0deg) translate3d(0,0,0); }
        }

        @keyframes fadeRise {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.16; transform: scale(1); }
          50% { opacity: 0.46; transform: scale(1.18); }
        }

        .about-shell {
          position: relative;
          overflow: hidden;
          border-radius: 2.25rem;
          border: 1px solid var(--app-border);
          background: linear-gradient(180deg, color-mix(in srgb, var(--app-card) 92%, white 8%) 0%, var(--app-card) 100%);
          box-shadow: 0 20px 48px rgba(0,0,0,0.08);
        }

        .about-hero {
          position: relative;
          min-height: 680px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            color-mix(in srgb, var(--app-card) 4%, transparent) 0%,
            color-mix(in srgb, var(--app-card) 10%, transparent) 18%,
            color-mix(in srgb, var(--app-card) 30%, transparent) 38%,
            color-mix(in srgb, var(--app-card) 68%, rgba(9,14,12,0.30)) 68%,
            color-mix(in srgb, var(--app-card) 88%, rgba(9,14,12,0.62)) 100%
          );
        }

        .hero-art {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .mountain {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 45% 55% 0 0 / 100% 100% 0 0;
        }

        .mountain-back {
          height: 44%;
          background: linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 18%, var(--app-card)) 0%, color-mix(in srgb, var(--app-accent) 8%, var(--app-card)) 100%);
          opacity: 0.28;
          transform: translateY(8%);
        }

        .mountain-mid {
          height: 35%;
          left: -8%;
          right: -8%;
          background: linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 26%, var(--app-card)) 0%, color-mix(in srgb, var(--app-accent) 12%, var(--app-card)) 100%);
          opacity: 0.42;
        }

        .mountain-front {
          height: 27%;
          left: -12%;
          right: -12%;
          background: linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 34%, var(--app-card)) 0%, color-mix(in srgb, var(--app-accent) 16%, var(--app-card)) 100%);
          opacity: 0.68;
        }

        .tea-lines {
          position: absolute;
          left: -8%;
          right: -8%;
          bottom: 10%;
          height: 22%;
          opacity: 0.18;
          background:
            radial-gradient(120% 100% at 50% 100%, transparent 60%, color-mix(in srgb, var(--app-text) 10%, transparent) 60.6%, transparent 62%),
            radial-gradient(120% 100% at 50% 100%, transparent 48%, color-mix(in srgb, var(--app-text) 9%, transparent) 48.6%, transparent 50%),
            radial-gradient(120% 100% at 50% 100%, transparent 36%, color-mix(in srgb, var(--app-text) 8%, transparent) 36.6%, transparent 38%);
        }

        .bamboo-grove {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bamboo-stalk {
          position: absolute;
          bottom: -6%;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.18) 20%, color-mix(in srgb, var(--app-accent) 42%, rgba(62,98,67,0.9)) 42%, color-mix(in srgb, var(--app-accent) 24%, rgba(40,72,48,0.9)) 72%, rgba(10,20,14,0.3) 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 32px rgba(50,90,60,0.08);
          transform-origin: bottom center;
          animation: bambooSway 11s ease-in-out infinite;
        }

        .bamboo-stalk::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(to bottom, transparent 0 48px, rgba(18,28,20,0.18) 48px 50px, rgba(230,245,220,0.08) 50px 52px, transparent 52px 96px);
          border-radius: inherit;
          mix-blend-mode: soft-light;
        }

        .bamboo-stalk::after {
          content: "";
          position: absolute;
          top: 0; bottom: 0; left: 28%;
          width: 2px;
          background: rgba(255,255,255,0.12);
          opacity: 0.55; filter: blur(0.3px);
        }

        .stalk-1 { left: 4%; height: 82%; width: 20px; opacity: 0.74; }
        .stalk-2 { left: 10%; height: 88%; width: 16px; opacity: 0.58; animation-delay: -2s; }
        .stalk-3 { left: 16%; height: 76%; width: 14px; opacity: 0.5; animation-delay: -4s; }
        .stalk-4 { right: 5%; height: 84%; width: 19px; opacity: 0.76; animation-delay: -1s; }
        .stalk-5 { right: 11%; height: 90%; width: 15px; opacity: 0.6; animation-delay: -3s; }
        .stalk-6 { right: 17%; height: 72%; width: 14px; opacity: 0.48; animation-delay: -5s; }

        .bamboo-leaves {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .leaf-cluster {
          position: absolute;
          width: 180px; height: 140px;
          transform-origin: center;
          animation: leafSway 9s ease-in-out infinite;
          opacity: 0.78;
        }

        .leaf-cluster span {
          position: absolute;
          width: 78px; height: 14px;
          border-radius: 999px 10px 999px 10px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--app-accent) 48%, rgba(164,212,142,0.85)) 0%, color-mix(in srgb, var(--app-accent) 20%, rgba(72,115,65,0.88)) 68%, rgba(34,60,36,0.88) 100%);
          box-shadow: inset 0 0 8px rgba(255,255,255,0.04);
          transform-origin: left center;
        }

        .leaf-left-a { left: 6%; top: 14%; animation-delay: -1s; }
        .leaf-left-b { left: 12%; top: 32%; width: 160px; height: 120px; animation-delay: -4s; }
        .leaf-right-a { right: 4%; top: 16%; animation-delay: -2s; }
        .leaf-right-b { right: 11%; top: 34%; width: 160px; height: 120px; animation-delay: -5s; }

        .leaf-left-a span:nth-child(1) { left: 10px; top: 18px; transform: rotate(18deg); }
        .leaf-left-a span:nth-child(2) { left: 42px; top: 38px; transform: rotate(6deg); width: 82px; }
        .leaf-left-a span:nth-child(3) { left: 12px; top: 62px; transform: rotate(-12deg); width: 74px; }
        .leaf-left-a span:nth-child(4) { left: 54px; top: 82px; transform: rotate(-24deg); width: 72px; }
        .leaf-left-b span:nth-child(1) { left: 6px; top: 16px; transform: rotate(24deg); width: 70px; }
        .leaf-left-b span:nth-child(2) { left: 28px; top: 42px; transform: rotate(10deg); width: 76px; }
        .leaf-left-b span:nth-child(3) { left: 6px; top: 68px; transform: rotate(-10deg); width: 68px; }
        .leaf-left-b span:nth-child(4) { left: 34px; top: 90px; transform: rotate(-22deg); width: 74px; }
        .leaf-right-a span:nth-child(1) { right: 8px; top: 18px; transform: rotate(162deg); }
        .leaf-right-a span:nth-child(2) { right: 40px; top: 40px; transform: rotate(174deg); width: 82px; }
        .leaf-right-a span:nth-child(3) { right: 12px; top: 64px; transform: rotate(192deg); width: 74px; }
        .leaf-right-a span:nth-child(4) { right: 52px; top: 86px; transform: rotate(204deg); width: 70px; }
        .leaf-right-b span:nth-child(1) { right: 4px; top: 16px; transform: rotate(156deg); width: 70px; }
        .leaf-right-b span:nth-child(2) { right: 26px; top: 42px; transform: rotate(170deg); width: 76px; }
        .leaf-right-b span:nth-child(3) { right: 4px; top: 68px; transform: rotate(188deg); width: 68px; }
        .leaf-right-b span:nth-child(4) { right: 32px; top: 92px; transform: rotate(202deg); width: 74px; }

        .mist-layer { position: absolute; border-radius: 999px; filter: blur(58px); pointer-events: none; }
        .mist-a { top: -2rem; left: -4rem; width: 18rem; height: 18rem; background: color-mix(in srgb, var(--app-accent) 16%, transparent); animation: mistFloatA 18s ease-in-out infinite; }
        .mist-b { right: -4rem; bottom: 2rem; width: 22rem; height: 12rem; background: rgba(214, 200, 175, 0.14); animation: mistFloatB 22s ease-in-out infinite; }
        .mist-c { left: 18%; bottom: 18%; width: 28rem; height: 8rem; background: rgba(240, 244, 239, 0.2); animation: mistFloatB 20s ease-in-out infinite; }

        .sky-points {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(circle at 18% 14%, rgba(255,255,255,0.12) 0 1px, transparent 1.8px),
            radial-gradient(circle at 28% 22%, rgba(255,255,255,0.08) 0 1.2px, transparent 1.8px),
            radial-gradient(circle at 72% 18%, rgba(255,255,255,0.1) 0 1px, transparent 1.5px),
            radial-gradient(circle at 84% 12%, rgba(255,255,255,0.08) 0 1.1px, transparent 1.7px),
            radial-gradient(circle at 90% 24%, rgba(255,255,255,0.08) 0 1px, transparent 1.6px);
          animation: twinkle 5s ease-in-out infinite; opacity: 0.55;
        }

        .hero-content {
          position: relative; width: 100%; padding: 2rem 1.5rem 2rem; animation: fadeRise 900ms ease both;
        }

        .hero-panel {
          position: relative; z-index: 2; max-width: 56rem;
          border: 1px solid color-mix(in srgb, var(--app-border) 70%, transparent); border-radius: 1.75rem;
          background: color-mix(in srgb, var(--app-card) 70%, transparent); backdrop-filter: blur(18px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.12); padding: 1.5rem;
        }

        .hero-kicker { color: var(--app-accent); letter-spacing: 0.24em; }
        .hero-title { color: color-mix(in srgb, var(--app-text) 90%, white 10%); }
        .hero-text { color: color-mix(in srgb, var(--app-text-muted) 78%, var(--app-text) 22%); }
        .hero-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
        .hero-tag {
          border: 1px solid color-mix(in srgb, var(--app-border) 76%, transparent);
          background: color-mix(in srgb, var(--app-card) 64%, transparent);
          color: color-mix(in srgb, var(--app-text-muted) 82%, var(--app-text) 18%);
          border-radius: 999px; padding: 0.55rem 0.95rem; font-size: 0.92rem; backdrop-filter: blur(12px);
        }

        .story-wrap { position: relative; padding: 1rem 1.5rem 2rem; }

        .story-section {
          position: relative;
          display: grid;
          align-items: center; /* 讓內容垂直置中，避免過多上方空白 */
          padding: 3.5rem 0; /* 縮減 padding，讓內容更緊湊 */
          animation: fadeRise 900ms ease both;
        }

        /* 改良的分隔線：帶有雲霧竹林意象的漸層線 */
        .story-section + .story-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 5%;
          right: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--app-accent) 30%, var(--app-border)), transparent);
        }

        .story-inner {
          position: relative;
          z-index: 10;
          width: 100%;
        }

        .story-kicker {
          font-size: 0.78rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--app-accent);
          opacity: 0.92;
          display: flex;
          align-items: center;
        }
        
        .story-kicker::before {
          content: "✦";
          margin-right: 0.5rem;
          font-size: 0.6rem;
          color: color-mix(in srgb, var(--app-accent) 70%, transparent);
        }

        .story-title {
          margin-top: 0.85rem;
          font-size: clamp(2rem, 1.4rem + 2vw, 3.5rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          font-weight: 800;
          color: var(--app-text);
        }

        .story-text {
          margin-top: 1.35rem;
          font-size: clamp(1rem, 0.96rem + 0.3vw, 1.125rem);
          line-height: 2;
          color: var(--app-text-muted);
        }

        .story-mark {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          color: var(--app-text-muted);
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .story-mark::before {
          content: "";
          width: 4.5rem; height: 0.42rem; border-radius: 999px;
          background: linear-gradient(90deg, #b8d59d 0%, #dcc98b 48%, #9eb6a0 100%);
          opacity: 0.76;
        }

        .story-glow {
          position: absolute; width: 18rem; height: 8rem; border-radius: 999px;
          filter: blur(52px); opacity: 0.16; pointer-events: none;
        }

        .story-section.align-left .story-glow { right: 10%; top: 28%; background: color-mix(in srgb, var(--app-accent) 14%, transparent); }
        .story-section.align-right .story-glow { left: 8%; top: 32%; background: rgba(196, 176, 142, 0.14); }

        /* 新增：超大意象數字浮水印，填補空白處 */
        .story-watermark {
          position: absolute;
          font-family: serif;
          font-style: italic;
          font-size: clamp(8rem, 15vw, 18rem);
          font-weight: 900;
          line-height: 1;
          color: color-mix(in srgb, var(--app-accent) 8%, transparent);
          z-index: 0;
          pointer-events: none;
          user-select: none;
          top: 50%;
          transform: translateY(-50%);
        }

        @media (min-width: 768px) {
          .hero-content { padding: 2.5rem 2rem 2.25rem; }
          .hero-panel { padding: 2rem; }
          .story-wrap { padding: 1.25rem 2rem 2.5rem; }
        }

        @media (min-width: 1024px) {
          /* 改用 12 欄網格，破除原本 50/50 死板的留白 */
          .story-section {
            grid-template-columns: repeat(12, 1fr);
            gap: 2rem;
          }

          /* 文字內容佔據 7 欄，比例更舒服 */
          .story-section.align-left .story-inner {
            grid-column: 1 / 8; 
          }
          .story-section.align-right .story-inner {
            grid-column: 6 / 13;
          }

          /* 數字浮水印填補另一側的空白 */
          .story-section.align-left .story-watermark {
            right: 5%;
          }
          .story-section.align-right .story-watermark {
            left: 5%;
          }
        }

        @media (max-width: 768px) {
          .stalk-2, .stalk-5, .leaf-left-b, .leaf-right-b { display: none; }
          .about-hero { min-height: 600px; }
          .story-watermark { 
            top: 10%; 
            right: 5%; 
            transform: none;
            font-size: 8rem;
            opacity: 0.5;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mist-a, .mist-b, .mist-c, .bamboo-stalk, .leaf-cluster, .sky-points, .hero-content, .story-section { animation: none !important; }
        }
      `}</style>

      <section className="about-shell">
        <section className="about-hero">
          <div className="hero-art">
            <div className="mountain mountain-back" />
            <div className="mountain mountain-mid" />
            <div className="mountain mountain-front" />
            <div className="tea-lines" />
          </div>

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
          <div className="sky-points" />

          <div className="hero-content">
            <div className="hero-panel">
              <p className="hero-kicker text-sm uppercase">About Xiaobantian</p>
              <h1 className="hero-title mt-4 text-4xl font-black tracking-tight md:text-6xl">
                關於小半天
              </h1>
              <p className="hero-text mt-6 max-w-3xl text-lg leading-8">
                小半天位於南投鹿谷，是由竹林、竹豐與和雅三村共同組成的山村聚落。
                這裡以孟宗竹林、茶園景觀與豐富生態聞名，也保留了山區聚落緩慢而真實的生活節奏。
              </p>
              <div className="hero-tags">
                {["雲霧山村", "孟宗竹海", "茶海雲海", "觀星夜晚", "竹茶文化"].map((tag) => (
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
              className={`story-section ${section.align === "right" ? "align-right" : "align-left"}`}
            >
              <div className="story-glow" />
              {/* 加入環境數字水印填補空缺 */}
              <div className="story-watermark">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
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
      </section>
    </main>
  );
};

export default About;