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

  return (
    <aside
      className="rounded-[28px] border p-6 transition-colors duration-300 md:p-8"
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-card)",
        boxShadow: "var(--app-shadow)",
        color: "var(--app-text)",
      }}
    >
      <h2
        className="text-lg font-bold"
        style={{ color: "var(--app-text)" }}
      >
        預約摘要
      </h2>

      <div
        className="mt-5 grid gap-4 text-sm"
        style={{ color: "var(--app-text-muted)" }}
      >
        <div>
          <p style={{ color: "var(--app-text-muted)" }}>路線</p>
          <p
            className="mt-1 font-medium"
            style={{ color: "var(--app-text)" }}
          >
            {selectedRoute?.name || "尚未選擇"}
          </p>
        </div>

        <div>
          <p style={{ color: "var(--app-text-muted)" }}>姓名</p>
          <p
            className="mt-1 font-medium"
            style={{ color: "var(--app-text)" }}
          >
            {userName || "尚未填寫"}
          </p>
        </div>

        <div>
          <p style={{ color: "var(--app-text-muted)" }}>Email</p>
          <p
            className="mt-1 font-medium"
            style={{ color: "var(--app-text)" }}
          >
            {userEmail || "尚未填寫"}
          </p>
        </div>

        <div>
          <p style={{ color: "var(--app-text-muted)" }}>電話</p>
          <p
            className="mt-1 font-medium"
            style={{ color: "var(--app-text)" }}
          >
            {userPhone || "未提供"}
          </p>
        </div>

        <div>
          <p style={{ color: "var(--app-text-muted)" }}>出發時間</p>
          <p
            className="mt-1 font-medium"
            style={{ color: "var(--app-text)" }}
          >
            {travelDate || "尚未選擇"}
          </p>
        </div>

        <div>
          <p style={{ color: "var(--app-text-muted)" }}>人數</p>
          <p
            className="mt-1 font-medium"
            style={{ color: "var(--app-text)" }}
          >
            {people} 人
          </p>
        </div>

        <div>
          <p style={{ color: "var(--app-text-muted)" }}>備註</p>
          <p
            className="mt-1 font-medium"
            style={{ color: "var(--app-text)" }}
          >
            {notes || "無"}
          </p>
        </div>
      </div>
    </aside>
  );
}