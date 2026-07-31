# Portfolio — Plan & Design Document

---

## What Kind of Design Is This?

### Design Style: Kinetic Dark UI

This portfolio uses a design language best described as **Kinetic Dark UI** — a style common in high-end developer tools, creative agency sites, and modern SaaS products (Vercel, Linear, Figma, Stripe). It combines a near-black canvas with motion-driven depth, precise typography, and restrained color use.

**The three pillars of this design:**

1. **Dark canvas with atmospheric depth** — The background is never flat. Three large blurred gradient orbs drift slowly on infinite keyframe loops, giving the illusion of depth and ambient light without distracting from content. The base color is `#0D1B2A` (deep navy), not pure black, which keeps it from feeling harsh.

2. **Interactive environment** — The page reacts to the user. A dot grid sits invisibly across the entire viewport and only reveals itself under the cursor — a radial mask follows the pointer and illuminates the grid within a soft circle, mimicking a spotlight effect. This is directly inspired by the Figma Make canvas interaction.

3. **Motion as hierarchy** — Sections animate in with staggered `fade-up` keyframes as the user lands. The skills section uses three infinite marquee rows scrolling at different speeds and directions. Motion is never decorative — it directs attention and communicates structure.

---

### Typography

| Role               | Font              | Weight  |
| ------------------ | ----------------- | ------- |
| Headings & Body    | Plus Jakarta Sans | 300–800 |
| Labels, Tags, Mono | JetBrains Mono    | 400–500 |

**Why these two:** Plus Jakarta Sans is modern and geometric but warmer than Inter — it reads confidently at large display sizes and stays clean at small body sizes. JetBrains Mono grounds the technical labels (section counters, dates, tags) with a developer aesthetic that matches the portfolio's engineering credibility.

### Color System

| Token          | Value                     | Use                           |
| -------------- | ------------------------- | ----------------------------- |
| Navy base      | `#0D1B2A`                 | Page background               |
| Navy mid       | `#1B263B`                 | Gradient blob center          |
| Navy light     | `#243447`                 | Elevated surfaces             |
| Text primary   | `rgba(226,232,240, 0.9)`  | Headlines                     |
| Text secondary | `rgba(226,232,240, 0.45)` | Body copy                     |
| Text muted     | `rgba(226,232,240, 0.25)` | Labels, dates                 |
| Accent: Blue   | `#3B82F6`                 | Featured project              |
| Accent: Purple | `#8B5CF6`                 | Orbit project                 |
| Accent: Cyan   | `#06B6D4`                 | Noctua project                |
| Accent: Green  | `#10B981`                 | Flux project, available badge |

Each project card and certification badge gets its own accent color. This creates visual differentiation without introducing a chaotic palette — the dark background absorbs the color so nothing clashes.

### Spacing & Layout

- Max content width: `max-w-5xl` (64rem)
- Horizontal padding: `px-8 md:px-16`
- Section vertical rhythm: `py-24` (6rem top and bottom)
- Sections separated by `border-t border-white/[0.05]` — a single-pixel rule at 5% white opacity

---

## Page Structure & UX Reading Flow

The page is designed as a single vertical scroll. Sections are ordered to match how a potential client or employer reads a portfolio:

```
[Hero]           → Who are you? (3-second answer)
[Featured Work]  → Can you prove it? (show before tell)
[Skills]         → What do you know? (no ratings, just presence)
[Certifications] → Who else vouches for you?
[About Me]       → Why do you do this work?
[Contact]        → How do I reach you?
```

This ordering follows the **AIDA principle** (Attention → Interest → Desire → Action) applied to portfolio UX. You lead with identity, follow with proof, then credibility, then story, then conversion.

---

## Section-by-Section Plan

### 1. Navigation

- Fixed to top, transparent until user scrolls 40px
- On scroll: frosted glass (`backdrop-blur`) + subtle bottom border activates
- Left: monogram `AS`
- Center: anchor links — Work, Skills, Certifications, About, Contact
- Right: `Hire me` pill CTA
- **UX rationale:** The nav fading in on scroll avoids competing with the hero's large typography on load, then becomes a persistent wayfinding tool as the user explores deeper sections.

### 2. Hero

- Full viewport height (`min-h-screen`)
- Extra-large display heading with gradient text fill (`clamp(3.5rem → 8.5rem)`)
- One-line role label in mono above the name
- One-sentence tagline below
- Two CTAs: primary "View My Work" (border pill), secondary "Get in touch" (text underline)
- Availability badge bottom-right: pulsing green dot + label
- **UX rationale:** Hierarchy — name is the loudest thing on the page. Everything else defers to it.

### 3. Featured Projects

- One **large featured card** (full width) at the top:
  - Two-column inside: description + tags left, three metric tiles right
  - Subtle accent-colored border glow and radial gradient overlay
  - "View Case Study" link
- Three smaller cards in a 3-column grid below
- Each card has its own accent color for the ID label, border glow on hover, and background tint
- **UX rationale:** Leading with one large card gives hierarchy — not all work is equal. The metrics (12 Surfaces, 200+ Components, 4× Delivery) add concrete proof without being a wall of text.

### 4. Skills — Marquee Rows

- Three infinite horizontal marquee rows
- Row 1 and 3 scroll left; row 2 scrolls right (alternating direction adds visual rhythm)
- Each row scrolls at a different speed (28s, 32s)
- Each pill: geometric colored glyph + skill name, with a matching color tint on the pill background
- Fade masks on both edges of the track (transparent → opaque → opaque → transparent) so pills feel like they emerge from infinity
- Hovering the track pauses all animation
- Below: "Currently Exploring" — 3-column grid of cards with name + one-line note
- **UX rationale:** Removing skill ratings (●●●●○) eliminates implied judgment and avoids the "everything is 5 stars" credibility problem. The marquee communicates breadth through volume and variety. The motion is engaging without being distracting — it operates at the periphery of attention.

### 5. Certifications

- 4-column responsive grid (stacks to 2-col on mobile)
- Each card: issuer monogram in accent-colored rounded box, cert name, org, date, "Verified" status badge
- Hover: border brightens slightly
- **UX rationale:** Certifications are third-party social proof. Keeping them compact and consistent (same card size, same visual weight) avoids over-emphasizing any single credential.

### 6. About Me

- Two-column layout:
  - **Left:** 3-paragraph bio + "What I believe" numbered principles list
  - **Right:** Vertical career timeline — dot + line connector, glowing green dot on current role
- **UX rationale:** Bio + principles answers the human question ("who is this person really?"). The timeline answers the professional question ("where have they been?"). Splitting them into two columns lets the reader choose their reading order.

### 7. Get In Touch — Contact Form

- Two-column layout:
  - **Left:** CTA heading (gradient text), brief invite copy, direct email, social links with arrow icon on hover
  - **Right:** Controlled React form
    - Fields: Name, Email, Subject (select dropdown), Message (textarea)
    - On submit: 900ms simulated loading state with spinner, then inline success state (green checkmark + message)
    - "Send another" resets the form
- **UX rationale:** A form dramatically lowers the friction vs. a bare email link. Users don't need to open their mail client. The subject dropdown helps the sender frame their message and helps the recipient triage. The success state closes the loop — the user knows their message was "sent."

---

## Animation Inventory

| Name            | Duration | Easing                      | Applied To                   |
| --------------- | -------- | --------------------------- | ---------------------------- |
| `drift-a`       | 22s      | ease-in-out                 | Gradient blob 1              |
| `drift-b`       | 28s      | ease-in-out                 | Gradient blob 2              |
| `drift-c`       | 18s      | ease-in-out                 | Gradient blob 3              |
| `fade-up`       | 0.8s     | cubic-bezier(0.22,1,0.36,1) | Hero elements, project cards |
| `fade-in`       | 0.6s     | ease                        | Nav bar                      |
| `marquee-left`  | 28s      | linear                      | Skills rows 1, 3             |
| `marquee-right` | 32s      | linear                      | Skills row 2                 |
| Hover glow      | 0.5s     | ease                        | Project cards                |
| Nav blur        | 0.3s     | ease                        | Nav on scroll                |

---

## Files Modified

| File            | Purpose                                                                           |
| --------------- | --------------------------------------------------------------------------------- |
| `src/App.tsx`   | All page content, components, data constants, section layout                      |
| `src/index.css` | Font imports, Tailwind v4 theme tokens, all keyframe definitions, utility classes |

All logic, data, and components live in `src/App.tsx` as a single self-contained file. No additional component files, no routing library, no external state management — intentionally kept simple.

---

## Tech Stack

| Layer      | Choice                                                 |
| ---------- | ------------------------------------------------------ |
| Framework  | React 19                                               |
| Build      | Vite 8                                                 |
| Styling    | Tailwind CSS v4                                        |
| Language   | TypeScript 5.7                                         |
| Fonts      | Google Fonts (Plus Jakarta Sans, JetBrains Mono)       |
| Animations | Pure CSS keyframes + inline `CSSProperties`            |
| Form state | React `useState` (no library)                          |
| Backend    | None — form logs to console, ready for endpoint wiring |
