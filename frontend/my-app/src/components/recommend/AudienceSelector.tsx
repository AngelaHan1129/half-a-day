type AudienceSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const audienceOptions = [
  { label: '自己一人', value: 'solo' },
  { label: '情侶', value: 'couple' },
  { label: '朋友', value: 'friends' },
  { label: '家庭', value: 'family' },
  { label: '長輩同行', value: 'elderly' },
];

export default function AudienceSelector({
  value,
  onChange,
}: AudienceSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-white">同行對象</label>
      <div className="flex flex-wrap gap-3">
        {audienceOptions.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'rounded-full px-4 py-2 text-sm transition',
                active
                  ? 'bg-lime-300 font-bold text-slate-950'
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