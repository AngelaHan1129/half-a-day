import SpotCard, { type SpotCardItem } from "../components/common/SpotCard";

const spotList: SpotCardItem[] = [
  {
    id: "bamboo-battlefield",
    name: "孟宗竹林古戰場",
    village: "竹林村",
    category: "歷史景點",
    description:
      "結合竹林地景與地方歷史記憶的代表性景點，適合做沉浸式導覽與故事型互動體驗。",
    image: "https://picsum.photos/seed/xiaobantian-bamboo/900/700",
  },
  {
    id: "dexing-waterfall",
    name: "德興瀑布",
    village: "和雅村",
    category: "自然景點",
    description:
      "瀑布、水氣與山林步道相互交織，適合安排生態觀察、視差推進與空間式敘事設計。",
    image: "https://picsum.photos/seed/xiaobantian-waterfall/900/700",
  },
  {
    id: "ginkgo-forest",
    name: "銀杏森林",
    village: "竹豐村",
    category: "季節景點",
    description:
      "秋冬季最具代表性的景觀資源之一，可延伸為四季旅程與拍照打卡體驗的重要節點。",
    image: "https://picsum.photos/seed/xiaobantian-ginkgo/900/700",
  },
  {
    id: "shima-park",
    name: "石馬公園",
    village: "竹林村",
    category: "休憩景點",
    description:
      "適合作為家庭旅遊與聚落導覽的起點，可結合附近景點與商家形成順遊路線。",
    image: "https://picsum.photos/seed/xiaobantian-park/900/700",
  },
];

const Spots = () => {
  return (
    <main className="bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.14),transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <p className="text-sm uppercase tracking-[0.24em] text-lime-300">
            Scenic Spots
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
            探索小半天景點
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
            從竹林、瀑布到銀杏森林，將自然地景、地方歷史與四季活動整合成可互動探索的景點導覽。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-lime-300 px-4 py-2 text-sm font-bold text-slate-950">
            全部
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10">
            自然景點
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10">
            歷史景點
          </button>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10">
            季節景點
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {spotList.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Spots;