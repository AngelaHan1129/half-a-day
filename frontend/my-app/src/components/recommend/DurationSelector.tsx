type DurationSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

const durationOptions = [
  { label: '2 小時', value: 2 },
  { label: '3 小時', value: 3 },
  { label: '4 小時', value: 4 },
  { label: '5 小時', value: 5 },
  { label: '6 小時', value: 6 },
];

export default function DurationSelector({
  value,
  onChange,
}: DurationSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-white">可安排時數</label>
      <div className="flex flex-wrap gap-3">
        {durationOptions.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'rounded-full px-4 py-2 text-sm transition',
                active
                  ? 'bg-cyan-300 font-bold text-slate-950'
                  : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}