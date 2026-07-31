function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-serif text-3xl font-semibold text-cream sm:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-base leading-8 text-cream/70">{subtitle}</p> : null}
    </div>
  );
}

export default SectionHeading;
