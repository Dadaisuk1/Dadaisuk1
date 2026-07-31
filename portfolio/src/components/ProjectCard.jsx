function ProjectCard({ project }) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-white/10">
      <div className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold">
        {project.tag}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-cream">{project.title}</h3>
      <p className="mt-2 text-sm text-gold/80">{project.period}</p>
      <p className="mt-4 text-sm leading-7 text-cream/75">{project.blurb}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-[#0D1B2A]/70 px-3 py-1 text-xs text-cream/80"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

export default ProjectCard;
