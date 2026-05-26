import type { Route } from "../../types/route";

type BookingSummaryProps = {
  routes: Route[];
  routeId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  travelDate: string;
  people: number;
  notes: string;
};

export default function BookingSummary({
  routes,
  routeId,
  userName,
  userEmail,
  userPhone,
  travelDate,
  people,
  notes,
}: BookingSummaryProps) {
  const selectedRoute = routes.find((route) => String(route.id) === routeId);

  // 日期格式化小工具，讓datetime-local的字串呈現得更像手帳乾淨的寫法
  const formatTravelDate = (dateStr: string) => {
    if (!dateStr) return "尚未選擇";
    try {
      const date = new Date(dateStr);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <aside
      className="group/summary hand-drawn-summary-border relative overflow-hidden border-2 p-6 transition-all duration-500 bg-[var(--app-card)] shadow-lg hover:shadow-xl h-fit lg:sticky lg:top-28"
      style={{
        borderColor: "var(--app-border)",
        boxShadow: "var(--app-shadow)",
      }}
    >
      <style>{`
        .hand-drawn-summary-border {
          /* 與左側表單對稱但方向微調的手繪感圓角 */
          border-radius: 15px 225px 15px 255px/255px 15px 255px 15px;
        }
        @keyframes stamp-wiggle {
          0%, 100% { transform: rotate(-5deg) scale(1); }
          50% { transform: rotate(5deg) scale(1.05); }
        }
      `}</style>

      {/* 右下角手繪竹葉小印章塗鴉 */}
      <div 
        className="absolute bottom-4 right-4 z-0 opacity-10 text-[var(--app-accent)] transition-all duration-500 group-hover/summary:opacity-20 group-hover/summary:animate-[stamp-wiggle_2.5s_ease-in-out_infinite] pointer-events-none"
        aria-hidden="true"
      >
        <svg className="h-16 w-16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5,3C13.5,3 10,6.5 10,10.5C10,11.5 10.2,12.5 10.5,13.4L3.6,20.4L5,21.8L11.9,14.9C12.8,15.2 13.8,15.4 14.8,15.4C18.8,15.4 22.3,11.9 22.3,7.9L22.5,3H17.5Z" />
        </svg>
      </div>

      {/* 頂部標題 */}
      <div className="relative z-10 mb-6 flex items-center justify-between border-b-2 pb-4" style={{ borderColor: "var(--app-border)" }}>
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[var(--app-accent)] block uppercase mb-1">
            ✦ Itinerary
          </span>
          <h2 className="text-xl font-black tracking-wider text-[var(--app-text)]">
            預約摘要
          </h2>
        </div>
        <div className="rounded-full px-3 py-1 text-xs border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)]">
          即時預覽
        </div>
      </div>

      {/* 內容清單 */}
      <div className="relative z-10 grid gap-5 text-sm">
        
        {/* 路線 */}
        <div className="border-b border-dashed pb-3 transition-colors duration-300" style={{ borderColor: "var(--app-border)" }}>
          <p className="text-xs font-bold tracking-widest text-[var(--app-muted)] flex items-center gap-2 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--app-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            探索路線
          </p>
          <p className={`font-bold tracking-wide pl-5.5 ${selectedRoute ? "text-[var(--app-text)]" : "text-[var(--app-muted)] italic"}`}>
            {selectedRoute?.name || "尚未選擇路線"}
          </p>
        </div>

        {/* 姓名 */}
        <div className="border-b border-dashed pb-3 transition-colors duration-300" style={{ borderColor: "var(--app-border)" }}>
          <p className="text-xs font-bold tracking-widest text-[var(--app-muted)] flex items-center gap-2 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--app-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            聯絡姓名
          </p>
          <p className={`font-medium pl-5.5 ${userName ? "text-[var(--app-text)]" : "text-[var(--app-muted)] italic"}`}>
            {userName || "尚未填寫"}
          </p>
        </div>

        {/* Email */}
        <div className="border-b border-dashed pb-3 transition-colors duration-300" style={{ borderColor: "var(--app-border)" }}>
          <p className="text-xs font-bold tracking-widest text-[var(--app-muted)] flex items-center gap-2 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--app-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            電子信箱
          </p>
          <p className={`font-medium break-all pl-5.5 ${userEmail ? "text-[var(--app-text)]" : "text-[var(--app-muted)] italic"}`}>
            {userEmail || "尚未填寫"}
          </p>
        </div>

        {/* 電話 */}
        <div className="border-b border-dashed pb-3 transition-colors duration-300" style={{ borderColor: "var(--app-border)" }}>
          <p className="text-xs font-bold tracking-widest text-[var(--app-muted)] flex items-center gap-2 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--app-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            聯絡電話
          </p>
          <p className={`font-medium pl-5.5 ${userPhone ? "text-[var(--app-text)]" : "text-[var(--app-muted)] italic"}`}>
            {userPhone || "未提供"}
          </p>
        </div>

        {/* 出發時間 */}
        <div className="border-b border-dashed pb-3 transition-colors duration-300" style={{ borderColor: "var(--app-border)" }}>
          <p className="text-xs font-bold tracking-widest text-[var(--app-muted)] flex items-center gap-2 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--app-accent-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            出發時間
          </p>
          <p className={`font-bold pl-5.5 ${travelDate ? "text-[var(--app-text)]" : "text-[var(--app-muted)] italic"}`}>
            {formatTravelDate(travelDate)}
          </p>
        </div>

        {/* 人數 */}
        <div className="border-b border-dashed pb-3 transition-colors duration-300" style={{ borderColor: "var(--app-border)" }}>
          <p className="text-xs font-bold tracking-widest text-[var(--app-muted)] flex items-center gap-2 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--app-accent-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            預約人數
          </p>
          <p className="font-bold text-[var(--app-text)] pl-5.5 flex items-baseline gap-0.5">
            {people} <span className="text-xs font-normal text-[var(--app-muted)]">人</span>
          </p>
        </div>

        {/* 備註 */}
        <div>
          <p className="text-xs font-bold tracking-widest text-[var(--app-muted)] flex items-center gap-2 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--app-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            特別備註
          </p>
          <p className="font-medium text-[var(--app-text-muted)] pl-5.5 whitespace-pre-line leading-relaxed">
            {notes || "無"}
          </p>
        </div>
        
      </div>
    </aside>
  );
}