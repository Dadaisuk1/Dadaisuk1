import { useEffect, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiEmail, mdiGithub, mdiLinkedin } from '@mdi/js';
import Navigation from './components/Navigation';
import { CERT_PDFS, EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from './siteConfig';
import ProjectCarousel from './components/ProjectCarousel';
import SectionHeading from './components/SectionHeading';
import SkillPill from './components/SkillPill';
import { DottedGlowBackground } from './components/ui/dotted-glow-background';
import TerminalPanel from './components/TerminalPanel';
import TypewriterName from './components/TypewriterName';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import heroPhoto from './assets/2x2pic.jpg';
import allyScreenshot from './assets/ally-screenshot.png';
import credigoLogo from './assets/credigo-logo.svg';

// Cycles in the "Hi, I'm ___." greeting. Kept as a plain array (not derived
// from anything) since it's a stylistic name-variant list, not structured
// data reused elsewhere.
const NAME_VARIANTS = ['Darwin', 'Darryl', 'Largoza'];
const FULL_NAME = 'Darwin Darryl Jean Largoza';

const contactIconMap = {
  Email: mdiEmail,
  GitHub: mdiGithub,
  LinkedIn: mdiLinkedin,
};

const heroContent = {
  eyebrow: 'Available for internship opportunities',
  // Was "Full-stack developer" — the user said they aren't a full-stack dev
  // yet and are working toward it. Claiming it in the hero is a mismatch
  // they'd have to walk back in an interview, so this reframes the same
  // real skills (React, Node.js, Django, AWS, security tooling — all still
  // true and all still below) as growth rather than a finished claim.
  tagline: 'Frontend developer with a designer’s eye — growing into full-stack.',
  summary:
    '4th-year IT student at Cebu Institute of Technology – University. I design in Figma and build with React, growing into Node.js and Django — backed by AWS-certified cloud foundations and hands-on cybersecurity fundamentals through Kali Linux and Metasploit.',
  location: 'Cebu, Philippines · IT Student',
};

const projects = [
  {
    tag: 'Capstone',
    title: 'Ally — AI-Powered Legal Platform',
    period: 'Jan 2025 – Dec 2025',
    blurb:
      'Designed the interface in Figma, then built it in React: a chat-first AI legal Q&A flow with multi-role access for lawyers and clients.',
    stack: ['React', 'Vite', 'Figma', 'Firebase'],
    image: allyScreenshot,
    imageAlt: 'Ally chat interface asking "How can ALLY help you today?"',
    liveUrl: 'https://ally-cit.vercel.app/',
    githubUrl: 'https://github.com/piolonrqz/Capstone-ALLY',
  },
  {
    tag: 'Team project',
    title: 'Notes App — Web2 / Web3 Hybrid',
    period: 'Dec 2025',
    blurb:
      'Full-stack contributor on a 5-person team: built the frontend editor components and improved backend rate-limiter reliability for a notes app with Cardano blockchain-based permanence.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Cardano'],
    githubUrl: 'https://github.com/piolonrqz/notes-app',
  },
  {
    tag: 'Frontend lead',
    title: 'CampusXperience — Event Platform',
    period: 'May 2025 – Dec 2025',
    blurb:
      'Led the frontend build for a campus event platform — discovery, reservations, ticketing, and reminders — integrated with a Spring Boot backend.',
    stack: ['React', 'Vite', 'Spring Boot', 'Java'],
    githubUrl: 'https://github.com/sytrusz/campusxperience',
  },
  {
    tag: 'Solo build',
    title: 'CrediGo — System Integration Project',
    period: 'Apr 2025 – May 2025',
    blurb:
      'Independently designed and built the entire app — frontend UI and backend API integration — for a 3-person System Integration and Architecture course, owning delivery end-to-end.',
    stack: ['React', 'Tailwind CSS', 'JavaScript', 'API integration'],
    image: credigoLogo,
    imageAlt: 'CrediGo logo',
    imageFit: 'contain',
    githubUrl: 'https://github.com/Dadaisuk1/CrediGo_IT342',
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
    verifyUrl: 'https://www.credly.com/badges/0da04100-740d-41f0-95c1-9c688737edde/public_url',
    pdfUrl: CERT_PDFS.awsCloudArchitecting,
  },
  {
    title: 'AWS Academy Graduate — Cloud Foundations',
    issuer: 'Amazon Web Services',
    issued: 'Sep 2025',
    verifyUrl: 'https://www.credly.com/badges/42f391ac-3ece-45d5-ac7d-42169faecb69/public_url',
    pdfUrl: CERT_PDFS.awsCloudFoundations,
  },
  {
    title: 'OJT Readiness Program',
    issuer: 'Cebu Institute of Technology – University',
    issued: 'Aug 2025',
    // No public verify link — this is a university-internal program, not a
    // Credly-issued badge like the other three.
  },
  {
    title: 'Lifelong Professional Skills',
    issuer: 'IBM',
    issued: 'Jul 2025',
    verifyUrl: 'https://www.credly.com/badges/b5b5da2d-0ce8-4f17-a336-1182e00b3533/public_url',
    pdfUrl: CERT_PDFS.ibmLifelongProfessionalSkills,
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
  'Kali Linux',
  'Metasploit',
  'Security fundamentals',
];

// `external` drives target/rel — a mailto: must stay in the current tab. With
// target="_blank" it opened a blank tab and then did nothing on any machine
// without a configured mail client.
const contactLinks = [
  {
    label: 'Email',
    href: `mailto:${EMAIL}`,
    external: false,
  },
  {
    label: 'GitHub',
    href: GITHUB_URL,
    external: true,
  },
  {
    label: 'LinkedIn',
    href: LINKEDIN_URL,
    external: true,
  },
];

function Home() {
  const [namePaused, setNamePaused] = useState(false);

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
      <DottedGlowBackground
        fixed
        className="pointer-events-none z-0"
        gap={34}
        radius={1.6}
        color="rgba(247, 243, 233, 0.35)"
        glowColor="rgba(212, 175, 55, 0.9)"
        opacity={1}
        impactRadius={220}
        scaleOnHover={1.6}
        spotlightIntensity={0.9}
        moveAmount={14}
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
            <h1
              className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl"
              onMouseEnter={() => setNamePaused(true)}
              onMouseLeave={() => setNamePaused(false)}
              onFocus={() => setNamePaused(true)}
              onBlur={() => setNamePaused(false)}
            >
              Hi, I’m{' '}
              {/* The rotation is decorative. Announcing it live meant a screen
                  reader read a new name every few seconds, forever — so the
                  visible span is hidden from AT and the full name is exposed
                  once instead. No fixed min-width here either: a `ch`-based
                  reservation previously left a dead gap before the period —
                  the backspace/type motion below makes the width change
                  expected and readable anyway. */}
              <TypewriterName names={NAME_VARIANTS} paused={namePaused} className="text-gold" />
              <span className="sr-only-name">{FULL_NAME}</span>.
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
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-cream"
              >
                Let’s connect
              </a>
              <a
                href="#projects"
                className="inline-flex items-center rounded-full border border-gold px-6 py-3 text-sm font-semibold text-gold transition hover:bg-white/10"
              >
                View projects
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-gold px-6 py-3 text-sm font-semibold text-gold transition hover:bg-white/10"
              >
                Résumé
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-navy/70 px-4 py-2 text-sm text-cream transition hover:border-gold hover:text-gold hover:bg-white/5"
                >
                  <Icon path={contactIconMap[link.label]} size={1} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#12263d]/80 p-6 shadow-2xl backdrop-blur-xl">
            <TerminalPanel />
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="rounded-[2rem] border border-white/10 bg-[#11233a]/90 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <img
                src={heroPhoto}
                alt="Portrait of Darwin Darryl Jean E. Largoza"
                className="h-32 w-32 flex-shrink-0 rounded-2xl border border-gold/25 object-cover md:h-40 md:w-40"
                loading="lazy"
              />
              <div className="flex-1">
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
                {cert.verifyUrl ? (
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-gold transition hover:text-cream"
                    >
                      Verify on Credly ↗
                    </a>
                    {cert.pdfUrl ? (
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cream/50 transition hover:text-cream"
                      >
                        Badge PDF
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="py-20">
          <SectionHeading
            eyebrow="Selected work"
            title="Four projects, one as frontend lead."
            subtitle="Capstone, team builds, and one solo project — from AI legal chat to campus event ticketing."
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
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  aria-label={link.label}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-navy/70 text-cream transition hover:border-gold hover:bg-gold/10 hover:text-gold"
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
