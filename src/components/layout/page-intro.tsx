export function PageIntro({
  kicker,
  title,
  lede,
}: {
  kicker?: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="border-b border-line-dark bg-void py-14 text-center">
      {kicker ? (
        <p className="mb-3 text-[11px] tracking-[0.28em] text-rose uppercase">{kicker}</p>
      ) : null}
      <h1 className="font-display text-3xl font-medium text-paper md:text-4xl">{title}</h1>
      {lede ? (
        <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-mist">{lede}</p>
      ) : null}
    </div>
  );
}
