type PlaceholderPageProps = {
  title: string;
};

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
    </main>
  );
}