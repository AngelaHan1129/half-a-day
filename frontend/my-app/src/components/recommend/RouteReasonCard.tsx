type RouteReasonCardProps = {
  title: string;
  content: string;
};

export default function RouteReasonCard({
  title,
  content,
}: RouteReasonCardProps) {
  return (
    <article
      className="rounded-3xl border p-5 transition-colors duration-300"
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-card)",
        boxShadow: "var(--app-shadow)",
      }}
    >
      <h3
        className="text-base font-bold"
        style={{ color: "var(--app-accent)" }}
      >
        {title}
      </h3>

      <p
        className="mt-3 whitespace-pre-wrap text-sm leading-7"
        style={{ color: "var(--app-text-muted)" }}
      >
        {content}
      </p>
    </article>
  );
}