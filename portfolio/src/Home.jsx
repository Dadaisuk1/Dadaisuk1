import { useEffect } from 'react';
import { Icon } from '@mdi/react';
import { mdiEmail, mdiGithub, mdiLinkedin } from '@mdi/js';
import Navigation from './components/Navigation';
import ProjectCarousel from './components/ProjectCarousel';
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
  eyebrow: 'Available for internship opportunities',
  greeting: 'Hi, I’m Darwin.',
  tagline: 'Full-stack developer · Cloud-aware, AI-assisted workflows',
  summary:
    'Information Technology student at Cebu Institute of Technology – University, building across the full stack — React, Node.js, Django — with AWS-certified cloud foundations and an eye for interface design.',
  location: 'Cebu, Philippines · IT Student',
};

const heroStats = [
  { value: '4+', label: 'Featured projects' },
  { value: '4', label: 'Certifications' },
  { value: '2', label: 'Team collaborations' },
  { value: '2', label: 'AWS credentials' },
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
    tag: 'Team project',
    title: 'Notes App — Web2 / Web3 Hybrid',
    period: 'Dec 2025',
    blurb:
      'Implemented collaborative note-taking features and frontend/backend sync for a modern productivity tool.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    tag: 'Frontend lead',
    title: 'CampusXperience — Event Platform',
    period: 'May 2025 – Dec 2025',
    blurb:
      'Led the interface build for a campus event discovery experience with reservation, ticketing, and reminder flows.',
    stack: ['React', 'Vite', 'Spring Boot', 'Java'],
  },
  {
    tag: 'Solo build',
    title: 'CrediGo — Credit Education App',
    period: 'Feb 2025',
    blurb:
      'Built an educational fintech interface to help users understand credit scores, budgeting, and financial habits.',
    stack: ['React', 'Tailwind CSS', 'JavaScript', 'API integration'],
  },
];

const education = {
  school: 'Cebu Institute of Technology – University',
  degree: 'B.S. Information Technology',
  years: '2022 – Present',
  focus:
    'Emphasis on software development, web systems, and cloud-ready applications with a product-focused mindset.',
};

const certifications = [
  {
    title: 'AWS Academy Graduate — Cloud Architecting',
    issuer: 'Amazon Web Services',
    issued: 'Dec 2025',
  },
  {
    title: 'AWS Academy Graduate — Cloud Foundations',
    issuer: 'Amazon Web Services',
    issued: 'Sep 2025',
  },
  {
    title: 'OJT Readiness Program',
    issuer: 'Cebu Institute of Technology – University',
    issued: 'Aug 2025',
  },
  {
    title: 'Lifelong Professional Skills',
    issuer: 'IBM',
    issued: 'Jul 2025',
  },
];

const skills = [
  'React',
  'Node.js',
  'Django',
  'AWS',
  'JavaScript',
  'Python',
  'Figma',
  'Tailwind CSS',
  'Git',
  'API design',
  'UX/UI',
  'Cloud foundations',
];

const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:darwindarryjean.largoza@gmail.com',
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

    return () => {
      lenis.destroy?.();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-[#F7F3E9] bg-[#0D1B2A]">
      <Navigation />
      <SpotlightGrid
        dotColor="rgba(247, 243, 233, 0.35)"
        dotSize={2.4}
        spacing={34}
        impactRadius={220}
        scaleOnHover={1.35}
        spotlightIntensity={0.9}
      />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 pb-16 pt-24 md:px-8 lg:px-12">
        <section
          id="home"
          className="grid min-h-[calc(100vh-6rem)] items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="max-w-2xl">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.34em] text-[#D4AF37]">
              {heroContent.eyebrow}
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {heroContent.greeting}
            </h1>
            <p className="mt-4 text-xl font-semibold text-[#D4AF37]">{heroContent.tagline}</p>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#F7F3E9]/85">
              {heroContent.summary}
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.28em] text-[#D4AF37]/90">
              {heroContent.location}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="mailto:darwindarryjean.largoza@gmail.com"
                className="inline-flex items-center rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#F7F3E9]"
              >
                Let’s connect
              </a>
              <a
                href="#projects"
                className="inline-flex items-center rounded-full border border-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-white/10"
              >
                View projects
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-white/10"
              >
                Résumé
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0D1B2A]/70 px-4 py-2 text-sm text-[#F7F3E9] transition hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-white/5"
                >
                  <Icon path={contactIconMap[link.label]} size={1} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#12263d]/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.5rem] border border-white/10 bg-[#0f2034]/80 p-6"
                >
                  <div className="text-3xl font-semibold text-[#D4AF37]">{stat.value}</div>
                  <div className="mt-2 text-sm uppercase tracking-[0.2em] text-[#F7F3E9]/75">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#D4AF37]/25 bg-[#D4AF37]/10 p-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                Current focus
              </p>
              <p className="mt-3 text-base leading-7 text-[#F7F3E9]/90">
                Building thoughtful UI systems, fast prototypes, and polished web products with an eye for detail.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="rounded-[2rem] border border-white/10 bg-[#11233a]/90 p-8 shadow-2xl backdrop-blur-xl">
            <SectionHeading
              eyebrow="About"
              title="A calm, modern approach to frontend development."
              subtitle="I care about structure, storytelling, and the feeling a product creates the moment it loads."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <SkillPill key={skill} label={skill} />
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="py-20">
          <SectionHeading
            eyebrow="Education"
            title="Cebu Institute of Technology – University"
            subtitle="B.S. Information Technology, 2022 – Present"
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-[#12263d]/90 p-8 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-[#F7F3E9]">Program focus</h3>
              <p className="mt-4 text-base leading-7 text-[#F7F3E9]/80">{education.focus}</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-[#12263d]/90 p-8 shadow-2xl backdrop-blur-xl">
              <div className="space-y-3">
                <div className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">Degree</div>
                <p className="text-lg font-semibold text-[#F7F3E9]">{education.degree}</p>
                <p className="text-sm text-[#F7F3E9]/70">{education.years}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="certifications" className="py-20">
          <SectionHeading
            eyebrow="Certifications"
            title="Credentials that back the work and process."
            subtitle="AWS, IBM, and CIT-U credentials focused on cloud readiness, professional skills, and practical development training."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {certifications.map((cert) => (
              <article
                key={cert.title}
                className="rounded-[2rem] border border-white/10 bg-[#11233a]/90 p-6 shadow-2xl backdrop-blur-xl"
              >
                <h3 className="text-lg font-semibold text-[#F7F3E9]">{cert.title}</h3>
                <p className="mt-2 text-sm text-[#D4AF37]/80">{cert.issuer}</p>
                <p className="mt-4 text-sm leading-7 text-[#F7F3E9]/80">Issued {cert.issued}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="py-20">
          <SectionHeading
            eyebrow="Selected work"
            title="A carousel of featured projects."
            subtitle="Native scroll snapping, clean product details, and clear storytelling for each build."
          />
          <div className="mt-10">
            <ProjectCarousel projects={projects} />
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="rounded-[2rem] border border-white/10 bg-[#11233a]/90 p-8 shadow-2xl backdrop-blur-xl">
            <SectionHeading
              eyebrow="Contact"
              title="Let’s build something memorable."
              subtitle="If you want a thoughtful web experience or a polished product launch, I’d love to connect."
            />
            <div className="mt-8 flex flex-wrap gap-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0D1B2A]/70 text-[#F7F3E9] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                >
                  <Icon path={contactIconMap[link.label]} size={1} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-[#F7F3E9]/70">
        © 2026 Portfolio • Built with React and Tailwind.
      </footer>
    </div>
  );
}

export default Home;
