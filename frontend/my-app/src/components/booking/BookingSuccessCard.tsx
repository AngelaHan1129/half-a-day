import type { Booking } from "../../types/booking";

type BookingSuccessCardProps = {
  booking: Booking;
  onReset: () => void;
};

export default function BookingSuccessCard({
  booking,
  onReset,
}: BookingSuccessCardProps) {
  return (
    <div
      className="rounded-[28px] border p-6 transition-colors duration-300 md:p-8"
      style={{
        borderColor: "rgba(34, 197, 94, 0.22)",
        background:
          "linear-gradient(180deg, color-mix(in srgb, #22c55e 12%, var(--app-card)), var(--app-card))",
        boxShadow: "var(--app-shadow)",
        color: "var(--app-text)",
      }}
    >
      <h2
        className="text-2xl font-black"
        style={{ color: "var(--app-text)" }}
      >
        預約成功
      </h2>

      <div
        className="mt-5 grid gap-3 text-sm"
        style={{ color: "var(--app-text-muted)" }}
      >
        <p>
          <strong style={{ color: "var(--app-text)" }}>預約編號：</strong>
          {booking.id}
        </p>
        <p>
          <strong style={{ color: "var(--app-text)" }}>姓名：</strong>
          {booking.userName}
        </p>
        <p>
          <strong style={{ color: "var(--app-text)" }}>Email：</strong>
          {booking.userEmail}
        </p>
        <p>
          <strong style={{ color: "var(--app-text)" }}>路線：</strong>
          {booking.route?.name ?? "未提供"}
        </p>
        <p>
          <strong style={{ color: "var(--app-text)" }}>出發時間：</strong>
          {booking.travelDate}
        </p>
        <p>
          <strong style={{ color: "var(--app-text)" }}>人數：</strong>
          {booking.people}
        </p>
        <p>
          <strong style={{ color: "var(--app-text)" }}>狀態：</strong>
          {booking.status}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-full px-5 py-3 text-sm font-bold transition-colors duration-300"
        style={{
          background: "var(--app-accent)",
          color: "#ffffff",
        }}
      >
        再建立一筆預約
      </button>
    </div>
  );
}