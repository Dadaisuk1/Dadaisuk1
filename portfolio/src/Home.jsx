import { Icon } from '@mdi/react';
import { mdiEmail, mdiGithub, mdiLinkedin } from '@mdi/js';
import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import SectionHeading from './components/SectionHeading';
import SkillPill from './components/SkillPill';
import { colorTokens, contactLinks, heroContent, projects, skillGroups, stats } from './data/portfolioData';

const contactIconMap = {
  Email: mdiEmail,
  GitHub: mdiGithub,
  LinkedIn: mdiLinkedin,
};

function Home() {
  return (
    <div
      className="min-h-screen text-cream"
      style={{
        backgroundImage: `linear-gradient(115deg, ${colorTokens.bgStart} 0%, ${colorTokens.bgEnd} 100%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-4rem] h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute right-[-4rem] top-[28vh] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <Navigation />

        <main className="mx-auto flex max-w-6xl flex-col px-6 pb-16 pt-8 md:px-8 lg:px-12">
          <section id="home" className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.3em] text-gold">
                {heroContent.eyebrow}
              </p>
              <h1 className="mt-5 font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
                {heroContent.name}
              </h1>
              <p className="mt-6 text-lg leading-8 text-cream/75">
                {heroContent.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="rounded-full bg-gold px-6 py-3 font-semibold text-[#0D1B2A] transition hover:bg-cream"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-gold/50 px-6 py-3 font-semibold text-gold transition hover:bg-gold/10"
                >
                  Get in Touch
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl shadow-2xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#0D1B2A]/60 p-4">
                    <div className="text-2xl font-semibold text-gold">{stat.value}</div>
                    <div className="mt-1 text-sm text-cream/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-gold/25 bg-gold/10 p-6">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">
                  Current focus
                </p>
                <p className="mt-3 text-lg leading-8 text-cream/90">
                  Building thoughtful UI systems, fast prototypes, and polished web products with an eye for detail.
                </p>
              </div>
            </div>
          </section>

          <section id="projects" className="py-20">
            <SectionHeading
              eyebrow="Selected work"
              title="Projects that balance clarity, craft, and impact."
              subtitle="A mix of solo and team builds where the interface, flow, and experience all matter."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </section>

          <section id="about" className="py-20">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <SectionHeading
                  eyebrow="About"
                  title="A calm, modern approach to frontend development."
                  subtitle="I care about structure, storytelling, and the feeling a product creates the moment it loads."
                />
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#0D1B2A]/50 p-8 backdrop-blur-xl">
                <div className="flex flex-wrap gap-3">
                  {skillGroups.flatMap((group) => group.items.map((item) => <SkillPill key={item} label={item} />))}
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="py-20">
            <div className="rounded-[2rem] border border-gold/25 bg-gold/10 p-8 backdrop-blur-xl">
              <SectionHeading
                eyebrow="Contact"
                title="Let’s build something memorable."
                subtitle="If you want a thoughtful web experience or a polished product launch, I’d love to connect."
              />
              <div className="mt-8 flex flex-wrap gap-4">
                {contactLinks.map((link) => {
                  const path = contactIconMap[link.label];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0D1B2A]/70 text-cream transition hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
                    >
                      <Icon path={path} size={1} color="currentColor" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-cream/60">
          © 2026 Portfolio • Built with React and Tailwind.
        </footer>
      </div>
    </div>
  );
}

export default Home;
