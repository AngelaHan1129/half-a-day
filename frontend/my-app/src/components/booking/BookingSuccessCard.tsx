import type { Booking } from '../../types/booking';

type BookingSuccessCardProps = {
  booking: Booking;
  onReset: () => void;
};

export default function BookingSuccessCard({
  booking,
  onReset,
}: BookingSuccessCardProps) {
  return (
    <div className="rounded-[28px] border border-emerald-400/30 bg-emerald-500/10 p-6 md:p-8">
      <h2 className="text-2xl font-black text-white">預約成功</h2>

      <div className="mt-5 grid gap-3 text-sm text-white/85">
        <p><strong>預約編號：</strong>{booking.id}</p>
        <p><strong>姓名：</strong>{booking.userName}</p>
        <p><strong>Email：</strong>{booking.userEmail}</p>
        <p><strong>路線：</strong>{booking.route?.name ?? '未提供'}</p>
        <p><strong>出發時間：</strong>{booking.travelDate}</p>
        <p><strong>人數：</strong>{booking.people}</p>
        <p><strong>狀態：</strong>{booking.status}</p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-slate-950"
      >
        再建立一筆預約
      </button>
    </div>
  );
}