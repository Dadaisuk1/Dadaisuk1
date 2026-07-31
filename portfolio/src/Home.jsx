import { useEffect } from 'react';
import { Icon } from '@mdi/react';
import { mdiEmail, mdiGithub, mdiLinkedin } from '@mdi/js';
// import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import SectionHeading from './components/SectionHeading';
import SkillPill from './components/SkillPill';
import SpotlightGrid from './components/SpotlightGrid';
import DarkModeToggle from './components/DarkModeToggle';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const contactIconMap = {
  Email: mdiEmail,
  GitHub: mdiGithub,
  LinkedIn: mdiLinkedin,
};

const heroContent = {
  eyebrow: 'Frontend developer',
  name: 'I build polished digital experiences with calm, modern design.',
  tagline:
    'I blend thoughtful UI, clean code, and product-minded thinking to create websites that feel as strong as they look.',
};

const stats = [
  { value: '4+', label: 'featured builds' },
  { value: '100%', label: 'attention to detail' },
  { value: '2+', label: 'years building' },
  { value: '24/7', label: 'curious mindset' },
];

const projects = [
  {
    tag: 'Capstone',
    title: 'Ally — AI-Powered Legal Platform',
    period: 'Jan 2025 – Dec 2025',
    blurb:
      'Designed a chat-first interface and built the frontend experience for a legal AI platform with multi-role flows and polished product thinking.',
    stack: ['React', 'Vite', 'Figma', 'Firebase'],
  },
  {
    tag: 'Team Project',
    title: 'Notes App — Web2 / Web3 Hybrid',
    period: 'Dec 2025',
    blurb:
      'Helped create a collaborative notes platform with a modern editor experience and strong frontend + backend integration.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    tag: 'Frontend Lead',
    title: 'CampusXperience — Event Platform',
    period: 'May 2025 – Dec 2025',
    blurb:
      'Led the interface build for a campus event discovery experience with reservation, ticketing, and reminder flows.',
    stack: ['React', 'Vite', 'Spring Boot', 'Java'],
  },
];

const skillGroups = [
  {
    label: 'Frameworks',
    items: ['React', 'Node.js', 'Express', 'Django', 'Tailwind CSS'],
  },
  { label: 'Languages', items: ['JavaScript', 'Python'] },
  { label: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB'] },
  { label: 'Workflow', items: ['Git', 'GitHub', 'Docker', 'Agile / Scrum'] },
  { label: 'Design', items: ['Figma', 'Canva', 'Gamma'] },
  {
    label: 'AI-Assisted Dev',
    items: ['Claude Code', 'Cursor', 'Windsurf', 'Lovable'],
  },
];

const contactLinks = [
  {
    label: 'Email',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=darwindarryjean.largoza@gmail.com',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/dadaisuk1',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ddjl/',
  },
];

function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      autoToggle: true,
      anchors: true,
      allowNestedScroll: true,
      naiveDimensions: true,
      stopInertiaOnNavigate: true,
    });

    lenis.on('scroll', (event) => {
      console.log('Lenis scroll:', event);
    });

    return () => {
      lenis.destroy?.();
    };
  }, []);

  return (
    <div className="relative min-h-screen text-text-light overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Dark Mode Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <DarkModeToggle />
      </div>

      {/* Spotlight Grid - Dots hidden until cursor hovers */}
      <SpotlightGrid
        dotColor="rgba(255, 255, 255, 0.38)"
        dotSize={2.1}
        spacing={34}
        impactRadius={240}
        scaleOnHover={2.4}
        spotlightIntensity={0.95}
      />

      <div className="relative z-10">
        {/* <Navigation /> */}

        <main className="mx-auto flex max-w-6xl flex-col px-6 pb-16 pt-8 md:px-8 lg:px-12">
          <section id="home" className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>
                {heroContent.eyebrow}
              </p>
              <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl" style={{ color: '#F7F3E9' }}>
                {heroContent.name}
              </h1>
              <p className="mt-6 text-lg leading-8" style={{ color: 'rgba(247, 243, 233, 0.75)' }}>
                {heroContent.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="rounded-full px-6 py-3 font-semibold transition"
                  style={{ backgroundColor: '#D4AF37', color: '#0D1B2A' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F7F3E9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="rounded-full px-6 py-3 font-semibold transition"
                  style={{ border: '1px solid rgba(212, 175, 55, 0.5)', color: '#D4AF37' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Get in Touch
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 p-7 backdrop-blur-xl shadow-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 p-4" style={{ backgroundColor: 'rgba(13, 27, 42, 0.6)' }}>
                    <div className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>{stat.value}</div>
                    <div className="mt-1 text-sm" style={{ color: 'rgba(247, 243, 233, 0.7)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] p-6" style={{ border: '1px solid rgba(212, 175, 55, 0.25)', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em]" style={{ color: '#D4AF37' }}>
                  Current focus
                </p>
                <p className="mt-3 text-lg leading-8" style={{ color: 'rgba(247, 243, 233, 0.9)' }}>
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
              <div className="rounded-[2rem] border border-white/10 p-8 backdrop-blur-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <SectionHeading
                  eyebrow="About"
                  title="A calm, modern approach to frontend development."
                  subtitle="I care about structure, storytelling, and the feeling a product creates the moment it loads."
                />
              </div>

              <div className="rounded-[2rem] border border-white/10 p-8 backdrop-blur-xl" style={{ backgroundColor: 'rgba(13, 27, 42, 0.5)' }}>
                <div className="flex flex-wrap gap-3">
                  {skillGroups.flatMap((group) => group.items.map((item) => <SkillPill key={item} label={item} />))}
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="py-20">
            <div className="rounded-[2rem] p-8 backdrop-blur-xl" style={{ border: '1px solid rgba(212, 175, 55, 0.25)', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
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
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full transition"
                      style={{ border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(13, 27, 42, 0.7)', color: '#F7F3E9' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                        e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                        e.currentTarget.style.color = '#D4AF37';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.backgroundColor = 'rgba(13, 27, 42, 0.7)';
                        e.currentTarget.style.color = '#F7F3E9';
                      }}
                    >
                      <Icon path={path} size={1} color="currentColor" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-6 py-8 text-center text-sm" style={{ color: 'rgba(247, 243, 233, 0.6)' }}>
          © 2026 Portfolio • Built with React and Tailwind.
        </footer>
      </div>
    </div>
  );
}

export default Home;
