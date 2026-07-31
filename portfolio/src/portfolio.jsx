import { useEffect, useRef } from "react";
import { Mail, Phone, Github, Linkedin, ArrowUpRight, MapPin } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tokens — derived directly from the supplied brief. Do not "improve" */
/*  or drift from these without updating the brief itself.             */
/* ------------------------------------------------------------------ */
const C = {
  bgStart: "#000000",
  bgEnd: "#152331",
  navyDeep: "#0D1B2A",
  navySlate: "#1B263B",
  blueMuted: "#415A77",
  gold: "#D4AF37",
  cream: "#F7F3E9",
};

const PROJECTS = [
  {
    tag: "CAPSTONE",
    title: "Ally — AI-Powered Legal Platform",
    period: "Jan 2025 – Dec 2025",
    role: "Frontend / UI-UX Developer",
    blurb:
      "Designed the complete UI in Figma and built it in React (Vite): a chat-first interface for AI legal Q&A, a lawyer–client messaging flow, and role-based routing wired to a Firebase backend. End-to-end frontend ownership on a multi-user, production-style platform.",
    stack: ["React", "Vite", "Figma", "Firebase"],
  },
  {
    tag: "TEAM PROJECT",
    title: "Notes App — Hybrid Web2/Web3 Notes",
    period: "Dec 2025",
    role: "Full-Stack (5-person team)",
    blurb:
      "Full-stack features for a notes app with Cardano blockchain-based permanence. Improved backend rate-limiter reliability and built the frontend editor components using Git-based collaboration.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Cardano"],
  },
  {
    tag: "TEAM PROJECT",
    title: "CampusXperience — Campus Event Platform",
    period: "May 2025 – Dec 2025",
    role: "Frontend Lead (5-person team)",
    blurb:
      "Built the complete frontend for campus event discovery, reservation, ticketing, and reminders, integrated with a Spring Boot (Java) backend via Git/GitHub collaboration.",
    stack: ["React", "Vite", "Spring Boot", "Java"],
  },
  {
    tag: "SOLO PROJECT",
    title: "CrediGo — System Integration Project",
    period: "Apr 2025 – May 2025",
    role: "Sole Developer",
    blurb:
      "Independently designed and built the entire web app — frontend UI and backend API integration — for a 3-person System Integration and Architecture course, owning delivery end-to-end.",
    stack: ["React", "API Integration"],
  },
];

const SKILL_GROUPS = [
  { label: "Frameworks", items: ["React", "Node.js", "Express", "Django", "TailwindCSS"] },
  { label: "Languages", items: ["JavaScript", "Python"] },
  { label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { label: "Workflow", items: ["Git", "GitHub", "Docker", "Agile / Scrum"] },
  { label: "Design", items: ["Figma", "Canva", "Gamma"] },
  { label: "AI-Assisted Dev", items: ["Claude Code", "Cursor", "Windsurf", "Lovable"] },
  { label: "Security", items: ["InfoSec Fundamentals", "Kali Linux Basics", "TryHackMe"] },
];

/* ------------------------------------------------------------------ */
/*  Cursor "water reveal" — the signature element.                     */
/*  Two stacked layers: an opaque dark-gradient top layer with a       */
/*  CSS mask-image hole that eases toward the pointer, and a warm      */
/*  gold-lit layer underneath that only shows through the hole.        */
/*  A few lightweight canvas wisps add drifting smoke texture inside   */
/*  the revealed zone. Everything here runs off refs + rAF — no React  */
/*  state updates per frame, so it stays smooth under React's render   */
/*  cycle instead of fighting it.                                      */
/* ------------------------------------------------------------------ */
function CursorReveal() {
  const topLayerRef = useRef(null);
  const canvasRef = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const topLayer = topLayerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Pointer target vs. eased (displayed) position — the lag between
    // them is what gives the "parting water" feel instead of a hard snap.
    const target = { x: -9999, y: -9999 };
    const eased = { x: -9999, y: -9999 };
    let active = false;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const wisps = Array.from({ length: 6 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 6,
      speed: 0.4 + Math.random() * 0.3,
      radius: 18 + Math.random() * 22,
      offset: Math.random() * Math.PI * 2,
    }));

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e) {
      const p = e.touches ? e.touches[0] : e;
      target.x = p.clientX;
      target.y = p.clientY;
      active = true;
    }
    function onLeave() {
      active = false;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    if (reduceMotion) {
      // Respect reduced-motion: no ambient animation, top layer stays put.
      topLayer.style.setProperty("--mx", "-9999px");
      topLayer.style.setProperty("--my", "-9999px");
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      };
    }

    let t = 0;
    function tick() {
      t += 0.016;

      // Ease toward pointer — a gentle lag, like the surface settling.
      eased.x += (target.x - eased.x) * 0.12;
      eased.y += (target.y - eased.y) * 0.12;

      topLayer.style.setProperty("--mx", `${eased.x}px`);
      topLayer.style.setProperty("--my", `${eased.y}px`);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active || Math.hypot(target.x - eased.x, target.y - eased.y) > 1) {
        wisps.forEach((w) => {
          const wx = eased.x + Math.cos(t * w.speed + w.offset) * w.radius;
          const wy = eased.y + Math.sin(t * w.speed + w.offset) * w.radius * 0.6;
          const r = 26 + Math.sin(t * w.speed * 1.5 + w.offset) * 8;

          const grad = ctx.createRadialGradient(wx, wy, 0, wx, wy, r);
          grad.addColorStop(0, "rgba(247, 243, 233, 0.10)");
          grad.addColorStop(0.5, "rgba(212, 175, 55, 0.07)");
          grad.addColorStop(1, "rgba(212, 175, 55, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(wx, wy, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="reveal-fixed" aria-hidden="true">
      {/* Layer underneath — only visible through the mask hole */}
      <div className="reveal-under" />
      {/* Top opaque gradient, punctured by a mask that follows the cursor */}
      <div ref={topLayerRef} className="reveal-top" />
      {/* Drifting smoke texture inside the revealed zone */}
      <canvas ref={canvasRef} className="reveal-canvas" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll reveal — small, restrained, once-per-element fade-up.       */
/* ------------------------------------------------------------------ */
function useScrollReveal(rootRef) {
  useEffect(() => {
    const els = rootRef.current.querySelectorAll(".reveal-on-scroll");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

export default function Portfolio() {
  const rootRef = useRef(null);
  useScrollReveal(rootRef);

  useEffect(() => {
    const links = [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ];
    const created = links.map((l) => {
      const el = document.createElement("link");
      Object.entries(l).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      return el;
    });
    return () => created.forEach((el) => el.remove());
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={rootRef} className="page">
      <style>{`
        :root {
          --gold: ${C.gold};
          --cream: ${C.cream};
          --navy-deep: ${C.navyDeep};
          --navy-slate: ${C.navySlate};
          --blue-muted: ${C.blueMuted};
        }
        * { box-sizing: border-box; }
        .page {
          position: relative;
          min-height: 100vh;
          color: var(--cream);
          font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
          background: ${C.bgStart};
          background: linear-gradient(115deg, ${C.bgStart} 0%, ${C.bgEnd} 100%);
          overflow-x: hidden;
        }
        .mono { font-family: 'IBM Plex Mono', 'SF Mono', Consolas, monospace; }
        .serif { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }

        /* ---------- signature cursor-reveal layers ---------- */
        .reveal-fixed {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .reveal-under {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 30% 20%, rgba(212,175,55,0.16), transparent 55%),
            radial-gradient(circle at 70% 75%, rgba(65,90,119,0.35), transparent 60%),
            linear-gradient(115deg, var(--navy-slate) 0%, var(--navy-deep) 100%);
        }
        .reveal-top {
          --mx: -9999px;
          --my: -9999px;
          position: absolute;
          inset: 0;
          background: ${C.bgStart};
          background: linear-gradient(115deg, ${C.bgStart} 0%, ${C.bgEnd} 100%);
          -webkit-mask-image: radial-gradient(circle 230px at var(--mx) var(--my),
            transparent 0%, transparent 30%,
            rgba(0,0,0,0.5) 58%, black 100%);
          mask-image: radial-gradient(circle 230px at var(--mx) var(--my),
            transparent 0%, transparent 30%,
            rgba(0,0,0,0.5) 58%, black 100%);
        }
        .reveal-canvas {
          position: absolute;
          inset: 0;
          mix-blend-mode: screen;
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal-top { display: none; }
          .reveal-canvas { display: none; }
        }

        /* ---------- layout shell ---------- */
        .content { position: relative; z-index: 1; }
        .container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 48px);
        }
        section { padding: clamp(64px, 10vw, 120px) 0; }

        nav.topnav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px clamp(20px, 5vw, 48px);
          backdrop-filter: blur(10px);
          background: rgba(13, 27, 42, 0.35);
          border-bottom: 1px solid rgba(212,175,55,0.12);
        }
        .brand {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: 0.02em;
        }
        .brand span { color: var(--gold); }
        .navlinks { display: flex; gap: clamp(14px, 3vw, 32px); }
        .navlinks a {
          color: var(--cream);
          opacity: 0.75;
          text-decoration: none;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: 'IBM Plex Mono', monospace;
          transition: opacity 0.2s ease, color 0.2s ease;
        }
        .navlinks a:hover, .navlinks a:focus-visible { opacity: 1; color: var(--gold); }

        /* ---------- hero ---------- */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 90px;
        }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          color: var(--gold);
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin: 0 0 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .eyebrow::before {
          content: '';
          width: 26px; height: 1px;
          background: var(--gold);
          display: inline-block;
        }
        h1.name {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: clamp(2.6rem, 7vw, 5rem);
          line-height: 1.02;
          margin: 0 0 20px;
          max-width: 14ch;
        }
        h1.name em {
          font-style: italic;
          color: var(--gold);
          font-weight: 400;
        }
        .tagline {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: rgba(247,243,233,0.75);
          max-width: 52ch;
          line-height: 1.65;
          margin: 0 0 36px;
        }
        .cta-row { display: flex; flex-wrap: wrap; gap: 14px; }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 2px;
          font-size: 0.85rem;
          letter-spacing: 0.03em;
          text-decoration: none;
          font-family: 'IBM Plex Mono', monospace;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .btn-primary {
          background: var(--gold);
          color: var(--navy-deep);
          border: 1px solid var(--gold);
        }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-ghost {
          color: var(--cream);
          border: 1px solid rgba(247,243,233,0.25);
        }
        .btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

        /* ---------- section heads ---------- */
        .section-head { margin-bottom: 44px; }
        .section-num {
          font-family: 'IBM Plex Mono', monospace;
          color: var(--gold);
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        h2.section-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          margin: 8px 0 0;
        }
        .hairline {
          height: 1px;
          background: linear-gradient(90deg, rgba(212,175,55,0.5), rgba(212,175,55,0));
          margin: 44px 0 0;
        }

        /* ---------- about ---------- */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .about-text {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(247,243,233,0.85);
          max-width: 68ch;
        }
        .location {
          display: flex; align-items: center; gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
          color: rgba(247,243,233,0.55);
          margin-top: 18px;
        }

        /* ---------- skills ---------- */
        .skill-groups { display: flex; flex-direction: column; gap: 22px; }
        .skill-group-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--blue-muted);
          margin-bottom: 10px;
        }
        .pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .pill {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
          padding: 6px 14px;
          border: 1px solid rgba(212,175,55,0.28);
          border-radius: 999px;
          color: var(--cream);
          background: rgba(212,175,55,0.04);
        }

        /* ---------- projects ---------- */
        .project-list { display: flex; flex-direction: column; }
        .project {
          padding: 34px 0;
          border-top: 1px solid rgba(247,243,233,0.1);
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 28px;
        }
        .project:last-child { border-bottom: 1px solid rgba(247,243,233,0.1); }
        .project-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--gold);
          align-self: start;
          padding-top: 4px;
        }
        h3.project-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 1.35rem;
          margin: 0 0 6px;
        }
        .project-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: rgba(247,243,233,0.5);
          margin-bottom: 14px;
        }
        .project-blurb {
          font-size: 0.98rem;
          line-height: 1.7;
          color: rgba(247,243,233,0.8);
          max-width: 62ch;
          margin: 0 0 16px;
        }
        .stack-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .stack-chip {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          color: var(--blue-muted);
          border: 1px solid rgba(65,90,119,0.5);
          padding: 4px 10px;
          border-radius: 3px;
        }

        /* ---------- education / certs ---------- */
        .ed-cert-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .ed-block h4, .cert-block h4 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          margin: 0 0 16px;
        }
        .ed-item { margin-bottom: 6px; font-size: 1.02rem; font-family: 'Fraunces', serif; }
        .ed-sub { font-size: 0.85rem; color: rgba(247,243,233,0.6); }
        .cert-item {
          font-size: 0.92rem;
          line-height: 1.7;
          color: rgba(247,243,233,0.8);
        }

        /* ---------- footer / contact ---------- */
        footer {
          padding: 80px 0 50px;
          border-top: 1px solid rgba(212,175,55,0.15);
        }
        .footer-inner {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
        }
        h2.footer-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          margin: 0 0 10px;
          max-width: 16ch;
        }
        .footer-links { display: flex; gap: 16px; }
        .icon-link {
          display: flex; align-items: center; justify-content: center;
          width: 42px; height: 42px;
          border: 1px solid rgba(247,243,233,0.25);
          border-radius: 50%;
          color: var(--cream);
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .icon-link:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }
        .copyright {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: rgba(247,243,233,0.4);
          margin-top: 50px;
        }

        /* ---------- scroll reveal ---------- */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          .reveal-on-scroll { opacity: 1; transform: none; transition: none; }
        }

        a:focus-visible, button:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }

        @media (max-width: 720px) {
          .project { grid-template-columns: 1fr; gap: 8px; }
          .ed-cert-grid { grid-template-columns: 1fr; }
          .navlinks { display: none; }
        }
      `}</style>

      <CursorReveal />

      <div className="content">
        <nav className="topnav">
          <span className="brand">DD<span>J</span>L</span>
          <div className="navlinks">
            <a href="#about" onClick={scrollTo("about")}>About</a>
            <a href="#work" onClick={scrollTo("work")}>Work</a>
            <a href="#skills" onClick={scrollTo("skills")}>Skills</a>
            <a href="#contact" onClick={scrollTo("contact")}>Contact</a>
          </div>
        </nav>

        <div className="container">
          {/* ---------------- HERO ---------------- */}
          <header className="hero">
            <p className="eyebrow">Information Technology · Cebu, PH</p>
            <h1 className="name">
              Darwin Darryl Jean E. <em>Largoza</em>
            </h1>
            <p className="tagline">
              4th-year IT student building across the full stack — React,
              Node.js, Django — with AWS-certified cloud foundations and an
              eye for interface design. Currently seeking a technical
              internship.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="mailto:darwindarryljean.largoza@gmail.com">
                <Mail size={16} /> Get in touch
              </a>
              <a className="btn btn-ghost" href="#work" onClick={scrollTo("work")}>
                View work <ArrowUpRight size={16} />
              </a>
            </div>
          </header>

          {/* ---------------- ABOUT ---------------- */}
          <section id="about">
            <div className="section-head reveal-on-scroll">
              <span className="section-num">01 — About</span>
              <h2 className="section-title">Professional Summary</h2>
            </div>
            <div className="about-grid reveal-on-scroll">
              <p className="about-text">
                4th-year Information Technology student with hands-on
                experience across full-stack development (React, Node.js,
                Django), UI/UX design, and cloud architecture
                (AWS-certified). Proficient in JavaScript and Git-based
                collaboration, with working knowledge of relational and
                NoSQL databases (MySQL, MongoDB) and applied information
                security fundamentals. Adaptable across tech stacks and
                comfortable working in Agile team environments.
              </p>
              <div className="location">
                <MapPin size={14} /> Cebu, Philippines
              </div>
            </div>
          </section>

          <div className="hairline" />

          {/* ---------------- SKILLS ---------------- */}
          <section id="skills">
            <div className="section-head reveal-on-scroll">
              <span className="section-num">02 — Toolkit</span>
              <h2 className="section-title">Skills</h2>
            </div>
            <div className="skill-groups reveal-on-scroll">
              {SKILL_GROUPS.map((g) => (
                <div key={g.label}>
                  <div className="skill-group-label">{g.label}</div>
                  <div className="pill-row">
                    {g.items.map((item) => (
                      <span className="pill" key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="hairline" />

          {/* ---------------- PROJECTS ---------------- */}
          <section id="work">
            <div className="section-head reveal-on-scroll">
              <span className="section-num">03 — Selected Work</span>
              <h2 className="section-title">Featured Projects</h2>
            </div>
            <div className="project-list">
              {PROJECTS.map((p) => (
                <div className="project reveal-on-scroll" key={p.title}>
                  <div className="project-tag">{p.tag}</div>
                  <div>
                    <h3 className="project-title">{p.title}</h3>
                    <div className="project-meta">{p.role} · {p.period}</div>
                    <p className="project-blurb">{p.blurb}</p>
                    <div className="stack-row">
                      {p.stack.map((s) => (
                        <span className="stack-chip" key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="hairline" />

          {/* ---------------- EDUCATION / CERTS ---------------- */}
          <section id="education">
            <div className="section-head reveal-on-scroll">
              <span className="section-num">04 — Background</span>
              <h2 className="section-title">Education & Certifications</h2>
            </div>
            <div className="ed-cert-grid reveal-on-scroll">
              <div className="ed-block">
                <h4>Education</h4>
                <div className="ed-item">B.S. Information Technology</div>
                <div className="ed-sub">Cebu Institute of Technology – University · 2022–Present</div>
              </div>
              <div className="cert-block">
                <h4>Certifications & Awards</h4>
                <p className="cert-item">AWS Academy Graduate — Cloud Architecting (Training Badge), Dec 2025</p>
                <p className="cert-item">AWS Academy Graduate — Cloud Foundations (Training Badge), Oct 2025</p>
              </div>
            </div>
          </section>
        </div>

        {/* ---------------- FOOTER / CONTACT ---------------- */}
        <footer id="contact">
          <div className="container">
            <div className="footer-inner reveal-on-scroll">
              <div>
                <span className="eyebrow">05 — Contact</span>
                <h2 className="footer-title">Let's build something.</h2>
                <div className="location" style={{ marginTop: 20 }}>
                  <Phone size={14} /> +63 995 662 7081
                </div>
              </div>
              <div className="footer-links">
                <a className="icon-link" href="mailto:darwindarryljean.largoza@gmail.com" aria-label="Email">
                  <Mail size={18} />
                </a>
                <a className="icon-link" href="#" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a className="icon-link" href="#" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
            <div className="copyright">
              English (Professional) · Filipino (Native) · Cebuano (Native)
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
