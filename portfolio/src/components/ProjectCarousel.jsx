import { useEffect, useRef, useState } from 'react';

function ProjectCarousel({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      {
        root: track,
        threshold: 0.55,
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [projects]);

  const scrollToIndex = (index) => {
    const target = cardRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
          {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-full border border-white/15 bg-[#0D1B2A]/80 px-4 py-2 text-sm text-[#F7F3E9] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-full border border-white/15 bg-[#0D1B2A]/80 px-4 py-2 text-sm text-[#F7F3E9] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            onClick={() => scrollToIndex(Math.min(projects.length - 1, activeIndex + 1))}
            disabled={activeIndex === projects.length - 1}
          >
            Next
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex gap-6 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth"
        tabIndex={0}
        aria-label="Project carousel"
      >
        {projects.map((project, index) => (
          <article
            key={project.title}
            data-index={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="min-w-[min(90vw,540px)] snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-[#11233a]/95 shadow-2xl backdrop-blur-xl"
          >
            {project.image ? (
              <img
                src={project.image}
                alt={project.imageAlt || ''}
                className="aspect-video w-full object-cover object-top"
                loading="lazy"
              />
            ) : null}
            <div className="p-6">
              <div className="inline-flex rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                {project.tag}
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[#F7F3E9]">{project.title}</h3>
              <p className="mt-2 text-sm text-[#D4AF37]/80">{project.period}</p>
              <p className="mt-4 text-sm leading-7 text-[#F7F3E9]/80">{project.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-[#0D1B2A]/70 px-3 py-1 text-xs text-[#F7F3E9]/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
              {project.liveUrl || project.githubUrl ? (
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#D4AF37] transition hover:text-[#F7F3E9]"
                    >
                      Live demo ↗
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#D4AF37] transition hover:text-[#F7F3E9]"
                    >
                      GitHub ↗
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 w-2 rounded-full transition ${
              index === activeIndex ? 'bg-[#D4AF37]' : 'bg-white/20'
            }`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectCarousel;
