type ParticipantSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function ParticipantSelector({
  value,
  onChange,
}: ParticipantSelectorProps) {
  return (
    <div className="grid gap-2">
      <label
        className="text-sm font-semibold"
        style={{ color: "var(--app-text)" }}
      >
        參與人數
      </label>

      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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