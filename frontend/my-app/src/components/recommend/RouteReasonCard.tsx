type RouteReasonCardProps = {
  title: string;
  content: string;
};

export default function RouteReasonCard({
  title,
  content,
}: RouteReasonCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
      <h3 className="text-base font-bold text-lime-300">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/80">
        {content}
      </p>
    </article>
  );
}