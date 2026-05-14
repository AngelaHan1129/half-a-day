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
      <label
        className="text-sm font-semibold"
        style={{ color: "var(--app-text)" }}
      >
        出發時間
      </label>

      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-surface)",
          color: "var(--app-text)",
          boxShadow: "var(--app-shadow)",
        }}
        required
      />
    </div>
  );
}