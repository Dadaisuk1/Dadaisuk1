# Portfolio Review & Improvement Plan

Reviewed: 2026-08-03 · Branch `contents` · Entry point `src/App.jsx → src/Home.jsx`

---

## Part 0 — Broken things (fix before any redesign)

These are not opinions. I verified each one in the code and in a production build.

### 0.1 🔴 Your design system is not compiling — this is the root cause of "every section looks the same"

`tailwind.config.js` defines `gold`, `cream`, `primary`, etc. But the project is on **Tailwind v4**
(`@tailwindcss/vite` + `@import "tailwindcss"` in `src/index.css`). **Tailwind v4 does not read
`tailwind.config.js`** unless you add an explicit `@config` directive — and you haven't.

Proof — from a fresh `vite build`:

```
grep -c "text-gold|bg-gold|border-gold|text-cream" dist/assets/index-*.css  →  0
```

Zero. Every one of these classes generates **no CSS at all**:

| File | Dead classes |
| --- | --- |
| `src/components/SectionHeading.jsx:5` | `text-gold` (the eyebrow) |
| `src/components/SectionHeading.jsx:9` | `text-cream` |
| `src/components/SectionHeading.jsx:12` | `text-cream/70` |
| `src/components/SkillPill.jsx:3` | `text-cream/80` |
| `src/components/ProjectCard.jsx` | `border-gold/50`, `bg-gold/10`, `text-gold`, `text-cream` (all of them) |

**What this means visually:** `SectionHeading` is used by About, Education, Certifications,
Projects, and Contact. Its eyebrow label ("About", "Education", "Certifications"…) is supposed to be
gold — the one element that gives each section a distinct identity. Instead it inherits plain cream
from the parent and renders as small grey-white text, identical in every section.

**You said "I couldn't differentiate the cards on each section since they are all the same."
That's why.** It isn't a design problem, it's a build-config bug. Fixing it alone will visibly
change five sections.

Fix: move the palette into `src/index.css` as a v4 `@theme` block and delete `tailwind.config.js`.

```css
@import "tailwindcss";

@theme {
  --color-gold: #D4AF37;
  --color-cream: #F7F3E9;
  --color-navy: #0D1B2A;
  --color-navy-surface: #1B263B;
  --font-serif: "Fraunces", Georgia, serif;
  --font-mono: "IBM Plex Mono", monospace;
}
```

### 0.2 🔴 Both Résumé buttons are 404

`public/` is **empty**. The resume PDF lives at `src/assets/DDJL_Resume.pdf`, which Vite does not
serve at a stable URL.

| Location | Links to | Reality |
| --- | --- | --- |
| `Home.jsx:220` (hero "Résumé") | `/resume.pdf` | 404 |
| `Navigation.jsx:67` (nav download) | `/assets/DDJL_Resume.pdf` | 404 |

Fix: `public/DDJL_Resume.pdf`, point both at `/DDJL_Resume.pdf`. Use a plain `<a download>` in the
nav instead of the synthetic-click hack.

### 0.3 🔴 Your email address has a typo — and there are three different versions of it

| Source | Address |
| --- | --- |
| `Home.jsx:120` and `Home.jsx:208` (live site) | `darwindarry` **jean** `.largoza@gmail.com` |
| `Portfolio.jsx:621` (dead file) | `darwindarry` **ljean** `.largoza@gmail.com` |
| Your git / account email | `darwindarryl.largozaiii@gmail.com` |

The one shipping on your live site is missing the `l` in "darryl". **Every email a recruiter sends
you bounces.** This is the single most expensive bug on the site. Needs your confirmation of the
correct address.

### 0.4 🟠 `favicon.svg` is a 404

`index.html:5` references `/favicon.svg`; `public/` is empty. Browser tab shows the default globe.

### 0.5 🟠 `Portfolio.jsx` is dead code that imports an uninstalled package

`src/Portfolio.jsx` (756 lines) is never rendered — `App.jsx` renders `Home` only. It imports
`lucide-react`, which is **not in `package.json`** and not in `node_modules`. It builds today only
because nothing imports it. It also contains a completely different design (gold/Fraunces editorial
layout) that no longer matches the site. Delete it, or if you want to keep the design ideas, move
them into `Plan.md`.

Same for `src/components/ProjectCard.jsx` (unused — `ProjectCarousel` inlines its own card markup)
and `src/components/DotGridBackground.jsx` (unused).

### 0.6 🟠 Dark mode toggle is a decoration that does nothing

`DarkModeToggle` toggles a `.dark-mode` class on `<html>`. **No CSS anywhere reads that class.** The
light palette exists only in the non-loading `tailwind.config.js`. The toggle is commented out on
desktop (`Navigation.jsx:115-117`) but still rendered in the mobile menu (`Navigation.jsx:176`) — so
mobile users get a switch that visibly moves and changes nothing.

Decision needed: build real light mode, or delete the component. **Recommendation: delete it.** A
dark editorial portfolio doesn't need a light mode, and a broken toggle is worse than no toggle.

### 0.7 🟠 The dot-grid background is rendering the entire page, every frame

`SpotlightGrid` is `absolute inset-0` inside a root div that is the **full document height**, not
the viewport. So `buildDots()` generates a dot for the whole ~7000px page: at `spacing={34}` on a
1440px-wide viewport that's roughly **8,500 dots**, and the render loop iterates all of them and
calls `ctx.arc()` + `fill()` on each one — 60 times a second, forever, even for dots 5000px off
screen.

Fix: make the canvas `position: fixed` at viewport size, and offset dot positions by `scrollY`. Drops
it to ~1,700 dots. Also add a `prefers-reduced-motion` bail-out and stop the rAF loop when the tab is
hidden.

### 0.8 🟡 Smaller correctness items

- `App.jsx:1` — `useState` imported, never used.
- `Home.jsx:208` — `mailto:` link with `target="_blank"` and `rel="noreferrer"`. On a machine with no
  configured mail client (most Windows laptops) this opens a blank tab and nothing else happens.
  **This is exactly the "email button doesn't do anything" behaviour you described.**
- `Home.jsx:190-193` — `aria-live="polite"` on the rotating name. A screen reader announces
  "Darryl… Largoza… Darwin…" every 8 seconds, forever. Set `aria-live="off"`, mark the rotating span
  `aria-hidden`, and put your full name in a visually-hidden span so it's read once, correctly.
- `Navigation.jsx:45` — scroll listener without `{ passive: true }`, and it does a
  `getBoundingClientRect()` on six elements per scroll event. Throttle with rAF or switch to
  `IntersectionObserver`.
- `Home.jsx:160` — `overflow-hidden` on the root wrapper will break `position: sticky` for any
  future sticky element, and fights Lenis.
- `index.html:7` — `<title>Portfolio</title>`, no `<meta name="description">`, no Open Graph tags.
  When you paste your link in a LinkedIn DM or a job application, it previews as a blank card titled
  "Portfolio". For a portfolio, this matters a lot.
- `Plan.md` is stale — it describes TypeScript, `App.tsx`, a contact form, marquee skills rows, and
  a Vercel-style blue/purple palette. None of that is the current site. It will mislead you (and me)
  later.

---

## Part 1 — Your feedback, section by section

### ✅ Keep as-is: background, navbar, hero opening

Agreed on all three. The spotlight dot grid is genuinely the site's signature; the compact GSAP nav
is doing its job; "Available for internship opportunities" + the rotating Darwin/Darryl/Largoza is a
strong, human opener. **The name rotation is the best idea on the site.** Don't touch it (except the
a11y fix in 0.8).

One note: the 8-second interval is too slow. Most visitors will see one name and never know it
rotates. **3.5–4s** is the sweet spot.

### Hero — the summary

You're right, and here's the specific diagnosis. Current copy:

> "Information Technology student at Cebu Institute of Technology – University, building across the
> full stack — software, web, and frontend development with React, Node.js, and Django — backed by
> AWS-certified cloud foundations and hands-on cybersecurity exposure through Kali Linux,
> Metasploit, and related security tooling."

Three problems:

1. **It's one 51-word sentence with three em-dash clauses.** Nobody finishes it.
2. **It's a keyword list, not a claim.** Eight technologies in one breath reads as anxiety, not
   range. A reviewer skims it and retains nothing.
3. **You told me you're not actually a full-stack dev yet** — and the tagline says
   "Full-stack developer — software, web & frontend · Security-aware builder". That's a
   mismatch you'll have to defend in an interview, and it's an unnecessary risk. It also isn't
   the strongest version of you: your actual, evidenced strength across all four projects is
   **frontend + UI/UX**, with real backend exposure.

**Recommended structure — three short lines, decreasing in size:**

```
Line 1 (large):   Hi, I'm [Darwin / Darryl / Largoza].
Line 2 (medium):  Frontend developer with a designer's eye
                  and a security habit.
Line 3 (small):   4th-year IT student at CIT-U. I design in Figma
                  and ship in React — four team projects, two as
                  frontend lead. AWS-certified, and I break things
                  on TryHackMe for fun.
```

Line 2 is a **claim you can defend**. Line 3 is **proof with numbers**. It's honest about being a
student while sounding like someone worth interviewing. "Currently learning backend depth" is a
strength when you're a student — it reads as self-aware, not as a gap.

### Hero — the "Let's connect" button and the email composer idea

**I like the idea.** A recruiter shouldn't have to leave your site to reach you — every extra step
loses people, and your `mailto:` is currently a dead end (see 0.8).

But I'd push back on one detail: a **chatbot-style** conversational composer ("Hi! What's your
name?" → "Great! What's your message?") is slower than a form. Someone with 40 seconds wants to see
all the fields at once, not be interviewed one question at a time. The novelty is charming for
about ten seconds and then it's friction.

**What I'd build instead — same idea, better execution:** a modal that *looks* like a real mail
client. One panel, all fields visible, but styled like Superhuman/Gmail's compose window — a
`To: Darwin` chip you can't edit, a subject line, a body, a send button that animates. It gets you
the "wow, this is a real product" reaction without slowing anyone down.

```
┌─────────────────────────────────────────┐
│  New message                        ✕   │
├─────────────────────────────────────────┤
│  To     ◆ Darwin Largoza                │
│  From   [ your email              ]     │
│  Name   [ your name               ]     │
│  ─────────────────────────────────────  │
│  [ Internship ] [ Freelance ] [ Just    │
│    saying hi ]        ← quick-fill      │
│  ─────────────────────────────────────  │
│                                         │
│  [ message…                       ]     │
│                                         │
├─────────────────────────────────────────┤
│                     [ Send  ➤ ]         │
└─────────────────────────────────────────┘
```

The quick-fill chips are the part worth stealing from your chatbot idea — click "Internship" and it
pre-fills a sensible subject and opening line. One click, message half-written. That's the
conversion win.

**Sending it:** the site is a static Vite build, so it needs a third-party endpoint.

| Option | Free tier | Setup | Notes |
| --- | --- | --- | --- |
| **Web3Forms** ⭐ | 250/mo | Paste an access key, POST | No account needed for the key, no SDK, no build change |
| Formspree | 50/mo | Similar | 50/mo is thin |
| EmailJS | 200/mo | Adds a client SDK | Exposes template IDs |
| Resend + serverless fn | 3k/mo | Needs Vercel/Netlify functions | Best long-term, most work |

**Recommendation: Web3Forms.** Zero backend, and the access key is safe to ship client-side.
Add a honeypot field for spam. Keep a "or just email me directly →" text link under the send button
as a fallback — always give people the escape hatch.

### Hero — the photo and "Current focus" card

Agreed, and I think I know why it looks off: `src/assets/2x2pic.jpg` is a **2×2 ID photo** — the
formal white-background passport style. It's being stretched into a `aspect-[4/5]` frame inside a
rounded card. Formal ID photography inside a moody dark editorial layout will always look grafted
on.

Three directions, in the order I'd recommend them:

**A. Fix the photo, keep the card (cheapest, biggest gain).** A casual environmental shot — you at a
desk, outdoors, anywhere with real light and a non-white background — dropped into the same frame
with a duotone treatment (navy shadows, gold highlights) to bind it to the palette. Half a day, and
the hero stops looking like a school ID.

**B. Replace the card with a terminal panel (most "you").** Given the security angle, a fake
terminal that types out real information about you:

```
$ whoami
→ darwin darryl jean largoza

$ cat current-focus.txt
→ shipping Ally (capstone) · learning backend depth
→ TryHackMe streak: 14 days

$ ls ./now
→ react  ·  figma  ·  aws  ·  kali
```

Typewriter animation, blinking cursor, monospace. This is on-brand for a security-aware dev, it's
memorable, and it doubles as a small demonstration of skill. Slight risk: terminal-hero is a known
trope in dev portfolios, so the writing has to carry it.

**C. Small circular avatar + drop the card entirely.** Give the hero copy full width. Least
distinctive, but the fastest and never looks bad.

**My pick: B, with the photo relocated** to a small avatar next to your name in the About section —
where a face actually helps (it's the "who is this person" section) instead of competing with your
headline.

### About — logo cloud for the tech stack

You asked: "logo cloud with swap animation / single row / marquee — but it's common right?"

Yes, marquees are common. That is not automatically a reason to avoid one — common patterns are
common because they read instantly. But here it's the wrong tool for a different reason: **a marquee
implies volume** ("look how many technologies!"). You have 15 skills. A marquee of 15 items loops
every few seconds and starts to look thin, and moving logos are unreadable — the visitor can't scan
for the one framework they care about.

**What I'd do instead — a grouped, static grid with hover detail.** Group the 15 flat skills into
the categories that already exist in your dead `Portfolio.jsx` (they were good):

```
FRONTEND     React · Tailwind · Figma · UX/UI
BACKEND      Node.js · Django · API design
CLOUD        AWS · Cloud foundations
SECURITY     Kali Linux · Metasploit · Security fundamentals
WORKFLOW     Git · Agile
```

Grouping does three things a marquee can't: it's **scannable** (a recruiter searching for "Django"
finds it in one second), it **shows range in a structured way**, and — critically — the "Security"
row becomes a visible category rather than three pills lost among twelve others. That security angle
is your differentiator against every other CIT-U frontend student. Don't hide it in a scrolling
blur.

If you want motion, put it on **hover**: a skill lifts, its logo colourises from mono to brand, and a
one-line note appears ("Django — REST APIs, ORM, auth"). Motion that rewards intent beats motion
that runs unattended.

### Education & Certifications — "I can't tell the sections apart"

Two causes, one of which you couldn't have known:

1. **The build bug in 0.1** — the gold eyebrow that labels each section isn't rendering. Fix that
   first, then re-look. It may be most of the problem.
2. **Every container is literally the same component.** Count the repeats of
   `rounded-[2rem] border border-white/10 bg-[#11233a]/90 p-8 shadow-2xl backdrop-blur-xl` in
   `Home.jsx`: **seven**. Same radius, same border, same blur, same shadow. About, Education ×2,
   Certifications ×4, Projects, Contact. The page has one texture from top to bottom.

**Fix: give each section a different structural form, not just a different colour.**

| Section | Current | Proposed |
| --- | --- | --- |
| About | Rounded card | **Full-bleed, no card.** Large text on the raw background. Lets the dot grid breathe. |
| Education | 2 identical cards | **Vertical timeline.** One rail, dots per year, current year glowing. |
| Certifications | 4 identical cards | **Credential cards** with issuer logo, verify link, expiry. |
| Projects | Carousel | Keep the carousel, fix the framing (below) |
| Contact | Rounded card | **Footer, redesigned** (below) |

Alternating between "card" and "no card" creates rhythm. Right now the page is seven identical
beats.

### Certifications specifically — you're right, and this is easy points

Your instinct (logo, credential link, badge image) is exactly right, and there's a concrete reason:
**an unverifiable certification is worth almost nothing to a reviewer.** "AWS Academy Graduate —
Cloud Architecting" as plain text is a claim. The same text with the AWS logo and a working
Credly link is *evidence*. That's a real credibility gain for about two hours of work.

Per card:

```
┌────────────────────────────────────┐
│  [AWS]   AWS Academy Graduate      │
│          Cloud Architecting        │
│          Amazon Web Services       │
│                                    │
│  Issued Dec 2025    Verify ↗       │
└────────────────────────────────────┘
```

- **Issuer logo** — AWS, IBM, CIT-U. Instantly parseable, and logos carry borrowed authority.
- **Verify link** — your Credly badge URL. This is the highest-value addition on the whole page.
- **Colour-code by issuer** — AWS orange, IBM blue. Solves "they all look the same" without
  inventing anything.

I'll need your Credly/badge URLs for the four certs.

### Featured Projects

Agreed on all counts, and the copy problems are worse than you said:

**"A carousel of featured projects"** — you're right, never name the UI widget in a heading. The
heading should say something about *the work*.

**The subtitle is describing your CSS, not your projects:** *"Native scroll snapping, clean product
details, and clear storytelling for each build."* "Native scroll snapping" is an implementation
detail of the carousel component. No reviewer cares, and it reads as if you had nothing to say about
the projects themselves.

**Also — the CrediGo description contradicts itself between files.**
`Home.jsx:63` (live): *"an educational fintech interface to help users understand credit scores,
budgeting, and financial habits."*
`Portfolio.jsx:52` (dead): *"the entire web app — frontend UI and backend API integration — for a
3-person System Integration and Architecture course."*
Different project, effectively. Worth settling which is true — the second one sounds more
impressive and more specific.

Replace the heading block with:

> **Selected work**
> **Four projects, two as frontend lead.**
> Capstone, team builds, and one solo end-to-end app — from AI legal chat to campus ticketing.

That's a heading that makes a claim, with numbers.

**The bigger issue: there are no screenshots.** Four text cards describing visual work, in a
portfolio, by someone who says their strength is UI. A reviewer wants to *see* the Ally chat
interface. **One screenshot per project will do more for you than every other change in this
document combined.** Even rough ones. Even a Figma frame.

Beyond that:

- Add **live demo** and **GitHub** links per card. A project with no link is a claim.
- Say **what you did**, not what the project was. "Built a chat-first interface" → "Designed 12
  screens in Figma and built them in React; owned the entire frontend for a 5-person team."
- The carousel hides projects 3 and 4 below the fold and off to the right. Consider a **2×2 grid**
  on desktop, carousel on mobile only — or lead with Ally as a large featured card and put the other
  three in a row beneath it.

### Footer

Your suggestion is good and I'd build it close to as specified. Large typographic "Thank you", three
directed links, copyright bar. The one change I'd make: your three links mix directions
(`->`, `/>`, `|>`) — pick one and vary the *words*, not the symbols, or it looks like a typo.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│      T H A N K   Y O U                               │
│      ↑ Fraunces, clamp(4rem, 14vw, 11rem),           │
│        outlined or gradient, fades in on scroll      │
│                                                      │
│      Don't be shy, say hi              →             │
│      Check my LinkedIn profile         →             │
│      Download my CV                    →             │
│      ↑ stacked, large, gold underline sweep on hover │
│                                                      │
├──────────────────────────────────────────────────────┤
│  © 2026 Darwin Darryl Jean Largoza      Cebu, PH     │
└──────────────────────────────────────────────────────┘
```

Notes:
- **"Don't be shy, say hi" should open the email composer**, not a `mailto:`. That's the natural
  home for the modal from the hero.
- **Merge the Contact section into this.** Right now Contact (a card with three icons) and the
  footer are two separate blocks doing the same job, and both duplicate the hero's three buttons.
  Those three icon links appear **three times** on one page. Once is enough — here.
- Deleting the standalone Contact section also removes one of the seven identical cards.
- Keep the `#contact` anchor pointing at the footer so the nav link still works.

---

## Part 2 — What you didn't mention, but should fix

1. **No screenshots anywhere.** Restating it because it's the single biggest gap. You are a
   visual developer with a portfolio containing exactly one image, and it's an ID photo.
2. **No meta description / OG image.** Your link previews as a blank card titled "Portfolio". Fix
   `index.html` — 15 minutes, and every share you ever do benefits.
3. **The security angle is buried.** Kali, Metasploit, TryHackMe are three pills at the end of a
   flat 15-item list. Most IT students applying for the same internship have React and AWS. Almost
   none have offensive-security exposure. **This is your differentiator and it's currently
   invisible.** Give it a named group at minimum.
4. **No dates or "last updated" signal.** Recruiters check whether a portfolio is alive.
5. **Mobile hasn't been considered past stacking.** The hero grid collapses, but the 2×2 photo card
   above the fold on a phone pushes your name and pitch below it. On mobile, copy first.
6. **`prefers-reduced-motion` is only partly handled.** GSAP scroll and the name-swap respect it;
   `SpotlightGrid` and Lenis don't.
7. **`Plan.md` is stale** and describes a site that doesn't exist. Rewrite or delete it.

---

## Part 3 — Execution plan

### Phase 1 — Correctness (do this first, ~half a day)

Nothing here is a design decision. It's all broken things.

1. Migrate the palette to a v4 `@theme` block in `index.css`; delete `tailwind.config.js`. **(0.1)**
2. Move `DDJL_Resume.pdf` into `public/`; fix both links. **(0.2)**
3. Fix the email typo everywhere — *needs your confirmation of the correct address*. **(0.3)**
4. Add a real `favicon.svg` (a gold `DDJL` monogram on navy). **(0.4)**
5. Delete `Portfolio.jsx`, `ProjectCard.jsx`, `DotGridBackground.jsx`; remove the unused `useState`
   in `App.jsx`. **(0.5, 0.8)**
6. Delete `DarkModeToggle` and its dead light-mode tokens. **(0.6)**
7. Make `SpotlightGrid` viewport-fixed; add reduced-motion and tab-hidden bail-outs. **(0.7)**
8. Fix the `aria-live` name announcement; drop `target="_blank"` from `mailto:`; make the nav scroll
   listener passive. **(0.8)**
9. Add `<title>`, meta description, and OG tags. **(Part 2.2)**

**After step 1, stop and look at the site.** Five sections will change appearance. Some of what you
disliked may already be fixed, and that should inform how far Phase 2 needs to go.

### Phase 2 — Content (~1 day, and it's mostly your work, not code)

This phase is gated on things only you have. It's also, honestly, where most of the value is —
better copy and real screenshots beat any amount of CSS.

10. Rewrite the hero to the three-line structure; settle the full-stack vs. frontend positioning.
11. **Capture one screenshot per project.** Blocking for Phase 3's project cards.
12. Collect Credly/verification URLs for all four certifications.
13. Rewrite each project blurb as *what you did*, with numbers; gather live + GitHub links.
14. Resolve the CrediGo description contradiction.
15. Replace a better hero photo, or commit to the terminal panel.

### Phase 3 — Design (~2–3 days)

16. Hero right column: terminal panel (option B), photo moved to About.
17. About: full-bleed, no card. Skills → grouped grid with hover detail, security as its own group.
18. Education: vertical timeline.
19. Certifications: issuer logos + verify links + colour-coding.
20. Projects: screenshots, real links, rewritten headings, 2×2 grid on desktop.
21. Footer: "Thank you" + three directed links + copyright; delete the standalone Contact section.

### Phase 4 — The email composer (~1 day)

22. Build the modal composer (single panel, mail-client styling, quick-fill chips).
23. Wire to Web3Forms; add honeypot spam protection.
24. Loading → success → error states; keep a direct-email fallback link.
25. Trigger it from the hero "Let's connect" **and** the footer "Don't be shy, say hi".

### Phase 5 — Polish

26. Mobile pass — copy before photo in the hero.
27. Full reduced-motion audit.
28. Lighthouse; the 320KB JS bundle is worth a look (`@mdi/js` may be importing more than needed).
29. Rewrite `Plan.md` to describe the site that actually exists.

---

## Summary

| | |
| --- | --- |
| **Biggest bug** | Tailwind v4 isn't loading your palette — five sections are rendering without their accent colour. This is why they look identical. |
| **Most expensive bug** | Your email address has a typo. Recruiter replies are bouncing. |
| **Biggest content gap** | No project screenshots. You're a visual developer with one image on the site, and it's an ID photo. |
| **Most under-sold asset** | The security angle. It's your differentiator and it's three pills in a flat list. |
| **Best existing idea** | The rotating name. Speed it up to ~4s and otherwise leave it alone. |
| **Your best new idea** | In-page email. Build it as a mail-client modal rather than a chatbot — same wow, less friction. |

**Order of impact per hour spent:** Phase 1 step 1 → the email typo → project screenshots →
credential verify links → everything else.
