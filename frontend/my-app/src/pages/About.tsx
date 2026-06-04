import { useMemo, useRef, useEffect, useState, type CSSProperties } from "react";
import { useCwaScene } from "../hooks/useCwaScene";
import { getSceneSummary } from "../utils/cwaMapper";

import aboutImg from "../assets/images/about.jpg";
import bambooImg from "../assets/images/bamboo.jpg";
import bambooTeaImg from "../assets/images/bambooTea.jpg";
import doorBambooImg from "../assets/images/door-bamboo.jpg";
import lightImg from "../assets/images/light.jpg";
import lightRabbitImg from "../assets/images/lightRabbit.jpg";
import sunImg from "../assets/images/sun.jpg";
import teaImg from "../assets/images/tea.jpg";
import heroImg from "../assets/images/xiaobantian-hero.jpg";
import historyImg from "../assets/images/xiaobantian-history.jpg";

const attractions = [
  {
    id: "bridge",
    name: "小半天高架橋",
    image: "https://www.lugu.org.tw/images/viewpointpic01.jpg",
    desc: "三跨式脊背橋，總長三百七十公尺，橋面離地約六十公尺，橋墩間距達一百公尺，牢固壯麗，成為地方新地標。",
    tag: "建築地標",
  },
  {
    id: "park",
    name: "石馬公園",
    image: "https://www.lugu.org.tw/images/viewpointpic02.jpg",
    desc: "墓園轉型公園，種下櫸木、梅及櫻等花木，綠草花卉如茵，造就小半天石馬公園。",
    tag: "生態公園",
  },
  {
    id: "bamboo",
    name: "竹藝工坊小半天旅遊中心",
    image: "https://www.lugu.org.tw/images/viewpointpic03.jpg",
    desc: "921 大地震後由社區媽媽成立，推廣竹編技藝與在地竹產業文化，作品精緻專業。",
    tag: "工藝文化",
  },
  {
    id: "waterfall",
    name: "德興瀑布",
    image: "https://www.lugu.org.tw/images/viewpointpic04.jpg",
    desc: "上下雙層瀑布，總高約五十餘公尺，潭水清澈，終年流水潺潺，清涼無比。",
    tag: "自然景觀",
  },
  {
    id: "halfbridge",
    name: "半天橋",
    image: "https://www.lugu.org.tw/images/viewpointpic05.jpg",
    desc: "古早聯絡道路，如今動植物生態豐富、風景優美，是值得推薦的好去處。",
    tag: "古道步道",
  },
  {
    id: "canal",
    name: "長源圳生態步道",
    image: "https://www.lugu.org.tw/images/viewpointpic06.jpg",
    desc: "民國 12 年開工，彎山越壁、架橋通渠，歷半年餘竣工，感念先人辛勤拓墾精神。",
    tag: "歷史圳道",
  },
  {
    id: "battlefield",
    name: "孟宗竹林古戰場",
    image: "https://www.lugu.org.tw/images/viewpointpic07.jpg",
    desc: "林爽文事件最後戰役之地，深幽的竹林氛圍也是《戲說台灣》等影視劇最愛的取景地之一。",
    tag: "歷史與影視",
  },
  {
    id: "stone",
    name: "大石公",
    image: "https://www.lugu.org.tw/images/viewpointpic08.jpg",
    desc: "又名蟾蜍公或招財公，屹立不搖守護全村。這類具濃厚信仰色彩的場域，常為傳奇鄉野劇增添靈感。",
    tag: "民俗信仰",
  },
  {
    id: "tea",
    name: "大崙山觀光茶園",
    image: "https://www.lugu.org.tw/images/viewpointpic09.jpg",
    desc: "東南亞面積最大銀杏林，金黃銀杏與青綠茶園相互輝映，遠眺中部五縣市，景色秀麗。",
    tag: "茶園秘境",
  },
];

type StorySection = {
  eyebrow: string;
  title: string;
  content: string;
  align: "left" | "right";
  mark: string;
  image: string;
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
    image: historyImg,
  },
  {
    eyebrow: "Bamboo Landscape",
    title: "竹林不是背景，而是地方生活的骨架。",
    content:
      "從孟宗竹的栽植、竹筍採收，到竹炭與竹編延伸工藝，竹子在小半天不只是風景，也是產業、記憶與生活技術。介面因此以竹節、竹影與柔性擺動作為主要視覺語彙。",
    align: "right",
    mark: "竹林・竹筍・竹炭",
    image: bambooImg,
  },
  {
    eyebrow: "Tea Rhythm",
    title: "茶園與山徑，讓旅程跟著節氣移動。",
    content:
      "小半天位在凍頂烏龍茶的重要產區，從晨霧、採茶到焙火文化，都讓這裡適合發展具有時間感的旅遊體驗。因此平台不只展示景點，而是用四季遊程與即時天氣來引導更貼近當下的探索方式。",
    align: "left",
    mark: "茶園・節氣・導覽推薦",
    image: teaImg,
  },
  {
    eyebrow: "Night Sky",
    title: "夜晚的小半天，適合被安靜地看見。",
    content:
      "當白天的人潮散去，山區的風、雲、月光與民宿燈火，反而讓地方故事更有層次。這也是為什麼夜間介面應該切換成更深、更柔和的視覺氛圍，讓導覽從資訊轉變成情境。",
    align: "right",
    mark: "夜景・月相・沉浸式瀏覽",
    image: lightImg,
  },
  {
    eyebrow: "Local Culture",
    title: "數位平台的價值，是讓地方知識被再次看見。",
    content:
      "從冬筍挑選、製茶發酵，到地方故事與食農教育，小半天真正珍貴的是那些原本分散在農友、職人與社區裡的知識。介面設計的任務，不只是漂亮，而是把這些內容轉成能被理解、被探索、也能被預約的入口。",
    align: "left",
    mark: "故事・技藝・智慧農遊",
    image: doorBambooImg,
  },
];

// ==================== 影視朝聖特區 (戲說台灣) ====================
function DramaPilgrimageSection() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="drama-section py-16 md:py-24 relative overflow-hidden" id="drama-tour">
      {/* 裝飾背景 */}
      <div className="absolute inset-0 bg-card/40 backdrop-blur-sm -z-10" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="drama-content order-2 lg:order-1">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-bold mb-3">✦ Filming Location Pilgrimage</p>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight text-[var(--app-text)]">
              跟著《戲說台灣》<br className="hidden lg:block" />走進傳奇山村
            </h2>
            <p className="mt-5 text-[var(--app-text-muted)] text-base leading-relaxed">
              小半天得天獨厚的自然景觀與深厚的民俗底蘊，曾吸引知名長壽台劇《戲說台灣》特別來到此地拍攝【小半天媽祖】系列單元。從迷霧繚繞的孟宗竹林、沁涼的德興瀑布，到聚落裡的信仰中心，劇組將小半天的靜謐與傳奇色彩完美收錄於鏡頭之中。
            </p>
            <p className="mt-3 text-[var(--app-text-muted)] text-base leading-relaxed">
              現在，你不只能透過數位平台欣賞美景，更能親自踏上「影視朝聖之旅」，實地探索劇中場景，感受螢光幕外最真實的竹風茶香與在地人情味。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://www.youtube.com/watch?v=5HpR_hOsjDw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-accent/20"
              >
                <span>▶</span> 觀看《小半天媽祖》全集
              </a>
              <a
                href="#attractions"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border/80 bg-surface/50 text-[var(--app-text)] rounded-full font-bold hover:bg-card transition-colors"
              >
                探索劇中景點 ↓
              </a>
            </div>
          </div>

          <div className="drama-video-wrap order-1 lg:order-2 relative aspect-[4/3] lg:aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-border/60 group">
            <img
              src="https://i.ytimg.com/vi/5HpR_hOsjDw/maxresdefault.jpg"
              alt="戲說台灣 小半天媽祖 取景地"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-colors duration-500" />

            <a
              href="https://www.youtube.com/watch?v=5HpR_hOsjDw"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center z-10"
              aria-label="播放戲說台灣小半天媽祖全集"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/90 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--app-accent-rgb),0.4)] group-hover:scale-110 transition-transform">
                <span className="text-3xl md:text-4xl ml-2">▶</span>
              </div>
            </a>

            <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-md font-bold tracking-wider z-10 border border-white/20">
              影視朝聖熱門
            </div>

            <div className="absolute bottom-5 left-5 right-5 z-10">
              <h3 className="text-white font-bold text-lg md:text-xl line-clamp-1">【戲說台灣】小半天媽祖 全集</h3>
              <p className="text-white/80 text-sm mt-1">3小時42分 • 三立電視</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== YouTube 影片故事區塊 ====================
function VideoStories() {
  const videos = [
    {
      id: "Wwx9YTYcTYs",
      title: "媲美日本京都嵐山竹林｜小半天孟宗竹林",
      desc: "清風徐來、竹影搖曳，被譽為台灣最美竹林秘境",
      duration: "9:12",
      thumbnail: "https://img.youtube.com/vi/Wwx9YTYcTYs/maxresdefault.jpg",
      tag: "航拍美景",
    },
    {
      id: "WlsIHdnI--Q",
      title: "【戲說台灣】小半天媽祖 第1集",
      desc: "長壽台劇《戲說台灣》於小半天實地取景，帶你認識小半天的傳奇故事。",
      duration: "22:20",
      thumbnail: "https://i.ytimg.com/vi/WlsIHdnI--Q/maxresdefault.jpg",
      tag: "影視朝聖",
    },
    {
      id: "yreYqQKs1wE",
      title: "小半天風景區完整導覽",
      desc: "高架橋、德興瀑布、石馬公園、半天橋一次看完",
      duration: "6:50",
      thumbnail: "https://img.youtube.com/vi/yreYqQKs1wE/maxresdefault.jpg",
      tag: "景點總覽",
    },
    {
      id: "qQmo4PJPcJ8",
      title: "竹藝與茶文化體驗日",
      desc: "竹編、竹炭、茶席，體驗小半天在地生活智慧",
      duration: "12:30",
      thumbnail: "https://img.youtube.com/vi/qQmo4PJPcJ8/maxresdefault.jpg",
      tag: "體驗分享",
    },
  ];

  return (
    <section className="video-stories-section py-12 md:py-16 bg-[color-mix(in_srgb,var(--app-surface)_40%,transparent)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-bold">✦ Visual Journey</p>
          <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">用影片走進小半天</h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto text-base">
            比照片更有溫度，比文字更真實。<br />
            還沒出門，就先感受竹風、茶香與山村的呼吸。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-card group block relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border border-white/50">
                    <span className="text-4xl text-black ml-1">▶</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded font-mono tracking-wider">
                  {video.duration}
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-accent text-white text-xs px-3 py-1 rounded-full font-bold tracking-wider">
                    {video.tag}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[16px] leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-muted mt-2 line-clamp-2">{video.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.youtube.com/results?search_query=%E5%B0%8F%E5%8D%8A%E5%A4%A9+%E9%B9%BF%E8%B0%B7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium text-sm"
          >
            搜尋更多小半天相關影片 →
          </a>
        </div>
      </div>
    </section>
  );
}

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

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function PhotoCarousel() {
  const slides = [
    {
      src: sunImg,
      alt: "小半天晨間山光",
      title: "晨間山光",
      subtitle: "晨霧剛散，山線與茶園一起亮起來。",
    },
    {
      src: bambooTeaImg,
      alt: "竹影與茶席",
      title: "竹影茶席",
      subtitle: "竹與茶不是裝飾，而是地方生活的節奏。",
    },
    {
      src: lightRabbitImg,
      alt: "夜間燈飾與柔和光影",
      title: "夜燈微光",
      subtitle: "入夜之後，光影讓小半天變得更安靜也更有故事。",
    },
    {
      src: aboutImg,
      alt: "小半天聚落風景",
      title: "山村片刻",
      subtitle: "不是急著打卡，而是慢慢走進聚落的呼吸。",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
  const nextIndex = (activeIndex + 1) % slides.length;

  return (
    <section className="photo-carousel-section" aria-label="小半天照片輪播">
      <div className="photo-carousel-head">
        <p className="photo-carousel-kicker">Photo Journey</p>
        <h2 className="photo-carousel-title">用照片慢慢看見小半天</h2>
        <p className="photo-carousel-text">
          讓光線、竹影與山村節奏，一張一張帶你走進地方的氣味。
        </p>
      </div>

      <div className="photo-carousel-shell">
        <button
          type="button"
          className="photo-carousel-arrow arrow-left"
          onClick={prevSlide}
          aria-label="上一張照片"
        >
          ←
        </button>

        <div className="photo-carousel-stage">
          <div className="photo-side-card side-left" aria-hidden="true">
            <img src={slides[prevIndex].src} alt="" loading="lazy" decoding="async" />
          </div>

          <div className="photo-main-card">
            <div className="photo-main-image-wrap">
              <img
                key={slides[activeIndex].src}
                src={slides[activeIndex].src}
                alt={slides[activeIndex].alt}
                loading="lazy"
                decoding="async"
                width={1200}
                height={860}
                className="photo-main-image"
              />
            </div>

            <div className="photo-main-overlay">
              <span className="photo-main-index">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="photo-main-copy">
                <h3>{slides[activeIndex].title}</h3>
                <p>{slides[activeIndex].subtitle}</p>
              </div>
            </div>
          </div>

          <div className="photo-side-card side-right" aria-hidden="true">
            <img src={slides[nextIndex].src} alt="" loading="lazy" decoding="async" />
          </div>
        </div>

        <button
          type="button"
          className="photo-carousel-arrow arrow-right"
          onClick={nextSlide}
          aria-label="下一張照片"
        >
          →
        </button>
      </div>

      <div className="photo-carousel-dots" role="tablist" aria-label="照片切換">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`切換到${slide.title}`}
            className={`photo-dot ${activeIndex === index ? "is-active" : ""}`}
            onClick={() => goToSlide(index)}
          >
            <span className="photo-dot-line" />
            <span className="photo-dot-label">{slide.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function AttractionCard({
  item,
  index,
}: {
  item: (typeof attractions)[0];
  index: number;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`attraction-card ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${index * 0.06}s` } as CSSProperties}
    >
      <div className="attraction-img-wrap">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          width={400}
          height={260}
        />
        <span className="attraction-tag">{item.tag}</span>
      </div>
      <div className="attraction-body">
        <h3 className="attraction-name">{item.name}</h3>
        <p className="attraction-desc">{item.desc}</p>
      </div>
    </div>
  );
}

function getHeroBackgroundImage(variant: SceneVariant) {
  const imageMap: Record<SceneVariant, string> = {
    "sunrise-clear": sunImg,
    "sunrise-cloudy": aboutImg,
    "sunrise-rain": bambooTeaImg,
    "day-clear": heroImg,
    "day-cloudy": bambooImg,
    "day-rain": bambooTeaImg,
    "sunset-clear": sunImg,
    "sunset-cloudy": historyImg,
    "sunset-rain": lightImg,
    "night-clear": lightRabbitImg,
    "night-cloudy": lightImg,
    "night-rain": lightImg,
  };
  return imageMap[variant] ?? heroImg;
}

function getHeroOverlayClass(variant: SceneVariant) {
  if (variant.includes("rain")) return "overlay-rain";
  if (variant.includes("cloudy")) return "overlay-cloudy";
  if (variant.includes("sunrise")) return "overlay-sunrise";
  if (variant.includes("sunset")) return "overlay-sunset";
  if (variant.includes("night")) return "overlay-night";
  return "overlay-clear";
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
  const heroBackgroundImage = getHeroBackgroundImage(sceneVariant);
  const heroOverlayClass = getHeroOverlayClass(sceneVariant);

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
      className={`about-page ${isNightScene ? "theme-night" : "theme-day"
        } ${isRainyScene
          ? "weather-rainy"
          : isCloudyScene
            ? "weather-cloudy"
            : "weather-clear"
        }`}
      style={{ color: "var(--app-text)" }}
    >
      <style>{`
/* 原本保留的樣式 */
@keyframes carouselImageEnter {
  from { opacity: 0; transform: scale(1.04); }
  to { opacity: 1; transform: scale(1); }
}

.photo-carousel-section { margin-top: 2.4rem; padding: 1.2rem 0 0; }
.photo-carousel-head { max-width: 42rem; margin: 0 auto 1.4rem; text-align: center; }
.photo-carousel-kicker { font-size: 0.75rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--app-accent); font-weight: 800; }
.photo-carousel-title { margin-top: 0.65rem; font-size: clamp(1.45rem, 2vw, 2.1rem); line-height: 1.25; font-weight: 900; color: var(--app-text); }
.photo-carousel-text { margin-top: 0.75rem; font-size: 0.95rem; line-height: 1.8; color: var(--app-text-muted); }
.photo-carousel-shell { position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 1rem; }

.photo-carousel-arrow { width: 3rem; height: 3rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--app-border) 84%, transparent); background: color-mix(in srgb, var(--app-surface) 84%, transparent); backdrop-filter: blur(10px); color: var(--app-text); font-size: 1.1rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 10px 26px color-mix(in srgb, var(--app-text) 8%, transparent); transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
.photo-carousel-arrow:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--app-accent) 12%, var(--app-surface)); color: var(--app-accent); }

.photo-carousel-stage { position: relative; min-height: 32rem; display: grid; grid-template-columns: minmax(0, 0.18fr) minmax(0, 1fr) minmax(0, 0.18fr); align-items: center; gap: 1rem; }
.photo-side-card { position: relative; height: 22rem; overflow: hidden; opacity: 0.55; filter: saturate(0.82); transition: transform 0.5s ease, opacity 0.4s ease; }
.photo-side-card img { width: 100%; height: 100%; object-fit: cover; }
.photo-side-card.side-left { border-radius: 2rem 0.8rem 2.4rem 0.9rem; transform: translateX(1rem) scale(0.94); }
.photo-side-card.side-right { border-radius: 0.9rem 2rem 1rem 2.6rem; transform: translateX(-1rem) scale(0.94); }
.photo-side-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, color-mix(in srgb, var(--app-bg) 8%, transparent) 0%, color-mix(in srgb, var(--app-bg) 28%, transparent) 100%); }

.photo-main-card { position: relative; min-height: 32rem; overflow: hidden; border-radius: 2.2rem 0.9rem 2.8rem 1rem; border: 1px solid color-mix(in srgb, var(--app-border) 82%, transparent); background: color-mix(in srgb, var(--app-card) 92%, transparent); box-shadow: 0 24px 60px color-mix(in srgb, var(--app-text) 10%, transparent), 0 2px 0 color-mix(in srgb, white 18%, transparent) inset; isolation: isolate; }
.photo-main-card::before { content: ""; position: absolute; inset: auto 10% -18px 10%; height: 30px; background: color-mix(in srgb, var(--app-accent) 16%, transparent); filter: blur(24px); z-index: 0; }
.photo-main-image-wrap { position: relative; width: 100%; height: 100%; min-height: 32rem; overflow: hidden; }
.photo-main-image { width: 100%; height: 100%; object-fit: cover; animation: carouselImageEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1); }
.photo-main-overlay { position: absolute; inset: auto 0 0 0; z-index: 2; display: flex; gap: 1rem; align-items: flex-end; padding: 1.3rem 1.35rem 1.25rem; background: linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--app-bg) 18%, transparent) 30%, color-mix(in srgb, var(--app-bg) 72%, transparent) 100%); }
.photo-main-index { flex-shrink: 0; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1; font-weight: 900; color: color-mix(in srgb, white 72%, var(--app-text)); opacity: 0.92; }
.photo-main-copy h3 { font-size: 1.25rem; font-weight: 900; color: white; line-height: 1.2; }
.photo-main-copy p { margin-top: 0.45rem; font-size: 0.92rem; line-height: 1.7; color: color-mix(in srgb, white 82%, transparent); max-width: 34rem; }

.photo-carousel-dots { margin-top: 1.15rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }
.photo-dot { display: inline-flex; align-items: center; gap: 0.55rem; padding: 0.45rem 0.75rem; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--app-border) 80%, transparent); background: color-mix(in srgb, var(--app-card) 84%, transparent); color: var(--app-text-muted); transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease; }
.photo-dot:hover { transform: translateY(-1px); color: var(--app-text); }
.photo-dot.is-active { background: color-mix(in srgb, var(--app-accent) 12%, var(--app-surface)); color: var(--app-accent); border-color: color-mix(in srgb, var(--app-accent) 34%, var(--app-border)); }
.photo-dot-line { width: 1.6rem; height: 2px; border-radius: 999px; background: currentColor; opacity: 0.72; }
.photo-dot-label { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; }

@keyframes mistFloatA { 0% { transform: translate3d(-4%, 0, 0) scale(1); opacity: 0.18; } 50% { transform: translate3d(5%, -2%, 0) scale(1.08); opacity: 0.3; } 100% { transform: translate3d(-4%, 0, 0) scale(1); opacity: 0.18; } }
@keyframes mistFloatB { 0% { transform: translate3d(4%, 0, 0) scale(1.02); opacity: 0.12; } 50% { transform: translate3d(-3%, 3%, 0) scale(1.1); opacity: 0.22; } 100% { transform: translate3d(4%, 0, 0) scale(1.02); opacity: 0.12; } }
@keyframes bambooSway { 0% { transform: rotate(0deg) translateX(0); } 50% { transform: rotate(1.2deg) translateX(4px); } 100% { transform: rotate(0deg) translateX(0); } }
@keyframes leafSway { 0% { transform: rotate(0deg) translate3d(0,0,0); } 50% { transform: rotate(-2.5deg) translate3d(4px,-2px,0); } 100% { transform: rotate(0deg) translate3d(0,0,0); } }
@keyframes fadeRise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
@keyframes ambientFloatSlow { 0% { transform: translate3d(-2%, 0, 0) scale(1); } 50% { transform: translate3d(2%, -2%, 0) scale(1.06); } 100% { transform: translate3d(-2%, 0, 0) scale(1); } }
@keyframes ambientFloatWide { 0% { transform: translate3d(2%, 0, 0) scale(1.02); } 50% { transform: translate3d(-3%, 2%, 0) scale(1.08); } 100% { transform: translate3d(2%, 0, 0) scale(1.02); } }
@keyframes ambientPulse { 0%, 100% { opacity: 0.16; transform: scale(1); } 50% { opacity: 0.28; transform: scale(1.08); } }
@keyframes ambientStarDrift { 0% { transform: translateY(0); opacity: 0.28; } 50% { transform: translateY(-8px); opacity: 0.5; } 100% { transform: translateY(0); opacity: 0.28; } }
@keyframes ambientRainFall { 0% { transform: translate3d(0, -24px, 0); opacity: 0; } 18% { opacity: 0.45; } 100% { transform: translate3d(-12px, 140px, 0); opacity: 0; } }
@keyframes cloudDrift { 0% { transform: translateX(-5%); } 50% { transform: translateX(5%); } 100% { transform: translateX(-5%); } }
@keyframes heroImgKen { 0% { transform: scale(1) translateX(0) translateY(0); } 100% { transform: scale(1.06) translateX(-1.5%) translateY(-1%); } }
@keyframes attractionReveal { from { opacity: 0; transform: translateY(32px) scale(0.96); filter: blur(8px); clip-path: inset(14% 0 0 0); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); clip-path: inset(0 0 0 0); } }

.about-page { position: relative; min-height: 100vh; overflow-x: hidden; isolation: isolate; background: radial-gradient(circle at top, color-mix(in srgb, var(--app-accent) 7%, transparent), transparent 34%), linear-gradient(180deg, var(--app-bg) 0%, color-mix(in srgb, var(--app-bg) 93%, var(--app-text) 7%) 100%); }
.page-ambient { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.page-content { position: relative; z-index: 2; }
.ambient-gradient, .ambient-orb, .ambient-mist, .ambient-ridges, .ambient-stars, .ambient-rain, .ambient-moon-glow, .page-fog, .page-bamboo { position: absolute; pointer-events: none; }
.ambient-gradient { filter: blur(60px); opacity: 0.3; animation: ambientFloatWide 24s ease-in-out infinite; }
.ambient-gradient-a { top: -10%; left: -10%; width: 30rem; height: 30rem; background: color-mix(in srgb, var(--app-accent) 16%, transparent); }
.ambient-gradient-b { top: 24%; right: -10%; width: 28rem; height: 24rem; background: color-mix(in srgb, var(--app-accent-2) 12%, transparent); animation-delay: -8s; }
.ambient-gradient-c { bottom: 8%; left: 18%; width: 34rem; height: 18rem; background: color-mix(in srgb, var(--app-text) 7%, transparent); animation-delay: -14s; }
.ambient-orb { border-radius: 999px; filter: blur(80px); animation: ambientPulse 14s ease-in-out infinite; }
.ambient-orb-a { top: 12%; right: 12%; width: 14rem; height: 14rem; background: color-mix(in srgb, var(--app-accent) 10%, transparent); }
.ambient-orb-b { bottom: 12%; left: 8%; width: 18rem; height: 18rem; background: color-mix(in srgb, var(--app-accent-2) 8%, transparent); animation-delay: -6s; }
.ambient-mist { left: -8%; right: -8%; border-radius: 999px; filter: blur(46px); opacity: 0.18; animation: ambientFloatSlow 22s ease-in-out infinite; }
.ambient-mist-top { top: 8%; height: 9rem; background: color-mix(in srgb, var(--app-surface) 20%, transparent); }
.ambient-mist-mid { top: 34%; height: 12rem; background: color-mix(in srgb, var(--app-card) 14%, transparent); animation-delay: -7s; }
.ambient-mist-bottom { bottom: 10%; height: 10rem; background: color-mix(in srgb, var(--app-surface) 10%, transparent); animation-delay: -12s; }
.page-fog { left: -8rem; right: -8rem; bottom: 3rem; height: 18rem; border-radius: 999px; filter: blur(76px); background: color-mix(in srgb, var(--app-surface) 24%, transparent); animation: ambientFloatSlow 26s ease-in-out infinite; }

.page-bamboo-grove { position: absolute; top: 0; bottom: 0; width: clamp(8rem, 12vw, 12rem); pointer-events: none; z-index: 1; opacity: 0.42; filter: blur(0.2px); }
.page-bamboo-grove-left { left: 0; }
.page-bamboo-grove-right { right: 0; }
.page-bamboo-stalk { position: absolute; bottom: -4%; border-radius: 999px; background: linear-gradient(90deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.58) 16%, color-mix(in srgb, var(--app-accent) 36%, rgba(116, 150, 113, 0.88)) 42%, color-mix(in srgb, var(--app-accent) 18%, rgba(76, 105, 74, 0.88)) 72%, rgba(24, 40, 28, 0.24) 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12), inset -3px 0 10px rgba(0,0,0,0.08), 0 8px 28px color-mix(in srgb, var(--app-accent) 10%, transparent); transform-origin: bottom center; animation: bambooSway 12s ease-in-out infinite; }
.page-bamboo-stalk::before { content: ""; position: absolute; inset: 0; border-radius: inherit; background: repeating-linear-gradient(to bottom, transparent 0 46px, rgba(32, 46, 31, 0.16) 46px 48px, rgba(255,255,255,0.18) 48px 50px, transparent 50px 94px); mix-blend-mode: soft-light; }
.page-bamboo-stalk::after { content: ""; position: absolute; top: 0; bottom: 0; left: 26%; width: 2px; background: rgba(255,255,255,0.34); opacity: 0.72; filter: blur(0.4px); }
.page-stalk-1 { left: 10%; width: 16px; height: 78%; opacity: 0.72; }
.page-stalk-2 { left: 34%; width: 13px; height: 86%; opacity: 0.58; animation-delay: -2s; }
.page-stalk-3 { left: 56%; width: 11px; height: 72%; opacity: 0.46; animation-delay: -4s; }
.page-stalk-4 { right: 10%; width: 16px; height: 82%; opacity: 0.72; }
.page-stalk-5 { right: 34%; width: 13px; height: 88%; opacity: 0.58; animation-delay: -3s; }
.page-stalk-6 { right: 56%; width: 11px; height: 70%; opacity: 0.46; animation-delay: -5s; }

.ambient-ridges-back { bottom: 26%; height: 18rem; opacity: 0.1; background: linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 14%, transparent) 0%, color-mix(in srgb, var(--app-text) 12%, transparent) 100%); }
.ambient-ridges-mid { bottom: 6%; height: 14rem; opacity: 0.14; background: linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 12%, transparent) 0%, color-mix(in srgb, var(--app-text) 16%, transparent) 100%); }

.about-hero { position: relative; min-height: 760px; display: flex; align-items: flex-end; overflow: hidden; border-radius: 1.75rem; border: 1px solid color-mix(in srgb, var(--app-border) 88%, transparent); box-shadow: var(--app-shadow); }
.hero-photo-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; border-radius: inherit; }
.hero-photo-bg img { width: 100%; height: 100%; object-fit: cover; object-position: right center; animation: heroImgKen 10s ease-in-out alternate infinite; transform-origin: center center; filter: saturate(0.95) contrast(1.02); }
.hero-photo-overlay { position: absolute; inset: 0; z-index: 1; border-radius: inherit; }

.hero-photo-overlay.overlay-clear, .hero-photo-overlay.overlay-sunrise, .hero-photo-overlay.overlay-sunset, .hero-photo-overlay.overlay-cloudy, .hero-photo-overlay.overlay-rain, .hero-photo-overlay.overlay-night { background: linear-gradient(to right, color-mix(in srgb, var(--app-bg) 97%, transparent) 0%, color-mix(in srgb, var(--app-bg) 92%, transparent) 12%, color-mix(in srgb, var(--app-bg) 82%, transparent) 24%, color-mix(in srgb, var(--app-bg) 66%, transparent) 38%, color-mix(in srgb, var(--app-bg) 42%, transparent) 56%, color-mix(in srgb, var(--app-bg) 18%, transparent) 76%, color-mix(in srgb, var(--app-bg) 6%, transparent) 100%), linear-gradient(180deg, color-mix(in srgb, var(--app-bg) 16%, transparent) 0%, transparent 28%, color-mix(in srgb, var(--app-bg) 18%, transparent) 64%, color-mix(in srgb, var(--app-bg) 78%, transparent) 100%); }

.hero-left-fog { position: absolute; inset: 0 auto 0 0; width: min(56%, 780px); z-index: 2; pointer-events: none; background: radial-gradient(ellipse at left center, color-mix(in srgb, var(--app-bg) 66%, transparent) 0%, color-mix(in srgb, var(--app-bg) 42%, transparent) 36%, transparent 72%); filter: blur(28px); }
.tea-lines { position: absolute; left: -8%; right: -8%; bottom: 10%; height: 22%; opacity: 0.16; z-index: 2; background: radial-gradient(120% 100% at 50% 100%, transparent 60%, color-mix(in srgb, var(--app-text) 10%, transparent) 60.6%, transparent 62%), radial-gradient(120% 100% at 50% 100%, transparent 48%, color-mix(in srgb, var(--app-text) 8%, transparent) 48.6%, transparent 50%); }

.hero-content { position: relative; z-index: 10; width: 100%; padding: 2.5rem 1.5rem; animation: fadeRise 900ms ease both; }
.hero-panel { position: relative; z-index: 20; max-width: 54rem; padding: 2rem 2rem 1.9rem; border: 1px solid color-mix(in srgb, var(--app-border) 80%, transparent); border-radius: 2rem 1rem 2.4rem 1rem; background: linear-gradient(180deg, color-mix(in srgb, var(--app-surface) 88%, transparent), color-mix(in srgb, var(--app-surface) 76%, transparent)); backdrop-filter: blur(22px) saturate(1.05); box-shadow: 0 18px 50px color-mix(in srgb, var(--app-text) 10%, transparent), 0 2px 0 color-mix(in srgb, white 26%, transparent) inset; }

.hero-kicker { color: var(--app-accent); letter-spacing: 0.24em; font-weight: bold; }
.hero-title { color: var(--app-text); font-weight: 900; }
.hero-text { color: var(--app-text-muted); line-height: 1.85; max-width: 42rem; }
.hero-meta-card { margin-top: 1.25rem; display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; border: 1px solid color-mix(in srgb, var(--app-border) 85%, transparent); background: color-mix(in srgb, var(--app-card) 86%, transparent); border-radius: 999px; padding: 0.6rem 1rem; }
.hero-tags { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 1.25rem; }
.hero-tag { border: 1px solid color-mix(in srgb, var(--app-border) 84%, transparent); background: color-mix(in srgb, var(--app-card) 86%, transparent); color: var(--app-text-muted); border-radius: 999px; padding: 0.45rem 0.85rem; font-size: 0.85rem; }

.story-wrap { margin-top: 2.5rem; padding: 1rem 0; }
.story-section { position: relative; display: grid; align-items: center; padding: 4.2rem 0; }
.story-section::before { content: ""; position: absolute; top: 0; left: 5%; right: 5%; height: 1px; background: linear-gradient(90deg, transparent, var(--app-border), transparent); border-top: 1px dashed var(--app-border); }
.story-inner { position: relative; z-index: 10; width: 100%; padding: 2rem; transition: transform 0.4s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; border: 1px solid transparent; }
.story-section:hover .story-inner { background: color-mix(in srgb, var(--app-card) 82%, transparent); border-color: color-mix(in srgb, var(--app-border) 84%, transparent); border-radius: 2rem 0.75rem 2.5rem 0.85rem; box-shadow: 0 14px 32px color-mix(in srgb, var(--app-text) 6%, transparent); transform: translateY(-2px); }
.story-photo-wrap { position: relative; z-index: 10; overflow: hidden; aspect-ratio: 4 / 3; border-radius: 1.4rem; box-shadow: 0 18px 40px color-mix(in srgb, var(--app-text) 8%, transparent); }
.story-photo-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
.story-section:hover .story-photo-wrap img { transform: scale(1.1); }
.story-kicker { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--app-accent); font-weight: bold; display: flex; align-items: center; }
.story-kicker::before { content: "✦"; margin-right: 0.4rem; color: var(--app-accent-2); }
.story-title { margin-top: 0.75rem; font-size: 1.6rem; line-height: 1.4; font-weight: 900; color: var(--app-text); }
.story-text { margin-top: 1rem; font-size: 0.95rem; line-height: 1.85; color: var(--app-text-muted); }
.story-mark { margin-top: 1.25rem; display: flex; align-items: center; gap: 0.5rem; color: var(--app-accent); font-size: 0.85rem; font-weight: bold; }
.story-mark::before { content: ""; width: 2rem; height: 6px; border-radius: 4px; background: color-mix(in srgb, var(--app-accent) 30%, transparent); }
.story-watermark { position: absolute; font-family: serif; font-style: italic; font-size: clamp(6rem, 12vw, 12rem); font-weight: 900; line-height: 1; color: color-mix(in srgb, var(--app-accent) 6%, transparent); z-index: 0; pointer-events: none; user-select: none; top: 50%; transform: translateY(-50%); }

.attractions-wrap { margin-top: 3rem; padding-bottom: 1rem; }
.attractions-head { max-width: 46rem; margin-bottom: 1.5rem; }
.attractions-kicker { font-size: 0.75rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--app-accent); font-weight: 800; }
.attractions-title { margin-top: 0.65rem; font-size: clamp(1.5rem, 2vw, 2.3rem); line-height: 1.25; font-weight: 900; color: var(--app-text); }
.attractions-text { margin-top: 0.75rem; font-size: 0.95rem; line-height: 1.8; color: var(--app-text-muted); }
.attractions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.2rem; }
.attraction-card { overflow: hidden; border-radius: 1.3rem; border: 1px solid color-mix(in srgb, var(--app-border) 82%, transparent); background: color-mix(in srgb, var(--app-card) 90%, transparent); box-shadow: 0 14px 28px color-mix(in srgb, var(--app-text) 6%, transparent); opacity: 0; transform: translateY(32px) scale(0.96); filter: blur(8px); }
.attraction-card.is-visible { animation: attractionReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: var(--reveal-delay); }
.attraction-img-wrap { position: relative; overflow: hidden; aspect-ratio: 4 / 2.65; }
.attraction-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
.attraction-card:hover .attraction-img-wrap img { transform: scale(1.06); }
.attraction-tag { position: absolute; top: 0.8rem; right: 0.8rem; display: inline-flex; align-items: center; border-radius: 999px; padding: 0.38rem 0.72rem; background: color-mix(in srgb, var(--app-surface) 84%, transparent); border: 1px solid color-mix(in srgb, var(--app-border) 84%, transparent); font-size: 0.72rem; font-weight: 800; color: var(--app-accent); backdrop-filter: blur(10px); }
.attraction-body { padding: 1rem 1rem 1.15rem; }
.attraction-name { font-size: 1rem; font-weight: 900; color: var(--app-text); line-height: 1.45; }
.attraction-desc { margin-top: 0.65rem; font-size: 0.9rem; line-height: 1.75; color: var(--app-text-muted); }


/* ==================== 新增：小鳥與落葉動畫 ==================== */
.falling-leaf {
  position: absolute;
  width: clamp(12px, 1.5vw, 18px);
  height: clamp(12px, 1.5vw, 18px);
  border-radius: 0 80% 0 80%;
  background: color-mix(in srgb, var(--app-accent) 65%, transparent);
  box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.3);
  pointer-events: none;
  z-index: 4;
  opacity: 0;
}

@keyframes leafFallL {
  0% { transform: translate(0, -5vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.5; }
  100% { transform: translate(6vw, 90vh) rotate(320deg); opacity: 0; }
}
@keyframes leafFallR {
  0% { transform: translate(0, -5vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.5; }
  100% { transform: translate(-6vw, 90vh) rotate(-320deg); opacity: 0; }
}

/* 將 delay 改為負數，讓動畫在網頁載入時就處於「已播放中」的狀態 */
.leaf-l1 { left: 4%; top: -5%; animation: leafFallL 16s ease-in-out infinite -2s; }
.leaf-l2 { left: 10%; top: -8%; animation: leafFallL 20s ease-in-out infinite -8s; }
.leaf-l3 { left: 2%; top: -2%; animation: leafFallL 18s ease-in-out infinite -14s; }
.leaf-r1 { right: 5%; top: -6%; animation: leafFallR 17s ease-in-out infinite -4s; }
.leaf-r2 { right: 11%; top: -3%; animation: leafFallR 22s ease-in-out infinite -10s; }
.leaf-r3 { right: 3%; top: -9%; animation: leafFallR 19s ease-in-out infinite -16s; }

.ambient-bird {
  position: absolute;
  top: 0; left: 0;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
}
.bird-svg {
  color: color-mix(in srgb, var(--app-text) 55%, transparent);
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
}
.bird-wings {
  transform-origin: center;
  animation: birdFlap 0.5s ease-in-out infinite alternate;
}
@keyframes birdFlap {
  0% { transform: scaleY(1); }
  100% { transform: scaleY(0.15); }
}

@keyframes flyRight {
  0% { transform: translate(-10vw, 15vh) scale(0.65); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.7; }
  100% { transform: translate(110vw, 8vh) scale(0.85); opacity: 0; }
}
@keyframes flyLeft {
  0% { transform: translate(110vw, 25vh) scale(0.55) scaleX(-1); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translate(-10vw, 38vh) scale(0.75) scaleX(-1); opacity: 0; }
}

/* 同樣將鳥的飛行動畫 delay 改為負數，確保一載入就有鳥在畫面上飛 */
.bird-1 { animation: flyRight 24s linear infinite -6s; }
.bird-2 { animation: flyLeft 28s linear infinite -14s; }
.bird-3 { animation: flyRight 30s linear infinite -22s; margin-top: 18vh; }


@media (min-width: 1024px) {
  .story-section { grid-template-columns: repeat(12, 1fr); gap: 2rem; }
  .story-section.align-left .story-photo-wrap { grid-column: 1 / 6; }
  .story-section.align-left .story-inner { grid-column: 6 / 13; }
  .story-section.align-right .story-inner { grid-column: 1 / 8; }
  .story-section.align-right .story-photo-wrap { grid-column: 8 / 13; grid-row: 1; }
  .story-section.align-left .story-watermark { right: 8%; }
  .story-section.align-right .story-watermark { left: 8%; }
}

@media (max-width: 1024px) {
  .photo-carousel-stage { grid-template-columns: 1fr; min-height: auto; }
  .photo-side-card { display: none; }
  .photo-main-card, .photo-main-image-wrap { min-height: 28rem; }
  .photo-carousel-shell { grid-template-columns: 1fr; gap: 0.9rem; }
  .photo-carousel-arrow { position: absolute; top: 50%; z-index: 3; transform: translateY(-50%); }
  .photo-carousel-arrow.arrow-left { left: 0.7rem; }
  .photo-carousel-arrow.arrow-right { right: 0.7rem; }
}

@media (max-width: 768px) {
  .about-hero { min-height: 560px; }
  .hero-content, .hero-panel { padding: 1.25rem; }
  .hero-panel { border-radius: 1.2rem; }
  .photo-carousel-section { margin-top: 2rem; }
  .photo-main-card, .photo-main-image-wrap { min-height: 22rem; border-radius: 1.4rem; }
  .story-section { padding: 3rem 0; }
  .story-inner { padding: 1.1rem; }
  .story-watermark { top: 3%; right: 4%; left: auto !important; transform: none; font-size: 4.5rem; opacity: 0.45; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-photo-bg img, .ambient-gradient, .ambient-orb, .ambient-mist, .photo-main-image, .attraction-card.is-visible { animation: none !important; }
  .photo-side-card, .story-photo-wrap img, .attraction-img-wrap img { transition: none !important; }
  .falling-leaf, .ambient-bird, .bird-wings { animation: none !important; display: none; }
}
      `}</style>

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
        
        <div className="page-bamboo-grove page-bamboo-grove-left" aria-hidden="true">
          <div className="page-bamboo-stalk page-stalk-1" />
          <div className="page-bamboo-stalk page-stalk-2" />
          <div className="page-bamboo-stalk page-stalk-3" />
        </div>
        <div className="page-bamboo-grove page-bamboo-grove-right" aria-hidden="true">
          <div className="page-bamboo-stalk page-stalk-4" />
          <div className="page-bamboo-stalk page-stalk-5" />
          <div className="page-bamboo-stalk page-stalk-6" />
        </div>

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

        {/* =============== 新增：動態點綴 小鳥與落葉 =============== */}
        <div className="ambient-leaves">
          <div className="falling-leaf leaf-l1" />
          <div className="falling-leaf leaf-l2" />
          <div className="falling-leaf leaf-l3" />
          <div className="falling-leaf leaf-r1" />
          <div className="falling-leaf leaf-r2" />
          <div className="falling-leaf leaf-r3" />
        </div>

        <div className="ambient-birds">
          <div className="ambient-bird bird-1">
            <svg width="32" height="32" viewBox="0 0 24 24" className="bird-svg">
              <g className="bird-wings">
                <path d="M12 14c-3-3-7-3-10-2 3-1 8-1 10 2z" fill="currentColor" />
                <path d="M12 14c3-3 7-3 10-2-3-1-8-1-10 2z" fill="currentColor" />
              </g>
            </svg>
          </div>
          <div className="ambient-bird bird-2">
            <svg width="28" height="28" viewBox="0 0 24 24" className="bird-svg">
              <g className="bird-wings" style={{ animationDelay: '-0.3s' }}>
                <path d="M12 14c-3-3-7-3-10-2 3-1 8-1 10 2z" fill="currentColor" />
                <path d="M12 14c3-3 7-3 10-2-3-1-8-1-10 2z" fill="currentColor" />
              </g>
            </svg>
          </div>
          <div className="ambient-bird bird-3">
            <svg width="36" height="36" viewBox="0 0 24 24" className="bird-svg">
              <g className="bird-wings" style={{ animationDelay: '-0.1s' }}>
                <path d="M12 14c-3-3-7-3-10-2 3-1 8-1 10 2z" fill="currentColor" />
                <path d="M12 14c3-3 7-3 10-2-3-1-8-1-10 2z" fill="currentColor" />
              </g>
            </svg>
          </div>
        </div>
        {/* ======================================================= */}
      </div>

      <div className="page-content mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <section className={heroClass}>
          <div className="hero-photo-bg">
            <img
              src={heroBackgroundImage}
              alt="小半天山村景色"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className={`hero-photo-overlay ${heroOverlayClass}`} />
          <div className="hero-left-fog" />
          <div className="tea-lines" />

          <div className="hero-content">
            <div className="hero-panel">
              <p className="hero-kicker text-xs uppercase">✦ Live Climate Scene</p>
              <h1 className="hero-title mt-3 text-2xl font-black tracking-wide md:text-4xl">
                {heroTitle}
              </h1>
              <p className="hero-text mt-4 text-sm md:text-base">{heroText}</p>

              <div className="hero-meta-card text-xs font-medium text-[var(--app-text-muted)] flex items-center gap-2">
                <span className="text-[var(--app-accent)] font-bold">南投鹿谷鄉即時同步</span>
                <span>•</span>
                <span>預報區間：{validTime}</span>
              </div>

              {loading && (
                <div className="hero-status loading flex items-center gap-2 mt-4 text-sm">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent"></span>
                  正在連線氣象署讀取最新山區預報...
                </div>
              )}

              {!loading && error && (
                <div className="hero-status error mt-4 text-sm text-red-500">
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

        <PhotoCarousel />

        {/* 戲說台灣 影視朝聖專區 */}
        <DramaPilgrimageSection />

        <VideoStories />

        <section className="story-wrap">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className={`story-section ${section.align === "right" ? "align-right" : "align-left"
                }`}
            >
              <div className="story-watermark">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="story-photo-wrap">
                <img
                  src={section.image}
                  alt={section.title}
                  loading="lazy"
                  decoding="async"
                />
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

        {/* 景點卡片渲染區塊 */}
        <section id="attractions" className="attractions-wrap">
          <div className="attractions-head">
            <p className="attractions-kicker">Local Attractions</p>
            <h2 className="attractions-title">走進小半天的風景與故事</h2>
            <p className="attractions-text">
              從古戰場的深幽竹林到終年不斷的瀑布清流，小半天的每個角落都藏著時間的印記。不妨跟著戲劇的腳步或節氣的引導，親身一探究竟。
            </p>
          </div>
          <div className="attractions-grid">
            {attractions.map((item, index) => (
              <AttractionCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}