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
      <label className="text-sm font-semibold text-white">參與人數</label>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
        required
      />
    </div>
  );
}