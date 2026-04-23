type BookingCalendarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function BookingCalendar({
  value,
  onChange,
}: BookingCalendarProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-white">出發時間</label>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
        required
      />
    </div>
  );
}