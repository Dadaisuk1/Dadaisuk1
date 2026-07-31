import { useState } from 'react';

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#0D1B2A]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8 lg:px-12">
        <a href="#home" className="font-serif text-base font-semibold uppercase tracking-[0.26em] text-[#F7F3E9]">
          DDL
        </a>

        <div className="hidden items-center gap-6 text-sm text-[#F7F3E9] md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-[#D4AF37]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-white/10"
          >
            Résumé
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-[#F7F3E9] transition hover:border-[#D4AF37] hover:text-[#D4AF37] md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle navigation menu"
        >
          <span className="text-lg">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#0D1B2A]/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm text-[#F7F3E9]">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block rounded-2xl px-4 py-3 transition hover:bg-white/5 hover:text-[#D4AF37]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[#D4AF37] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-white/10"
            >
              Résumé
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export default Navigation;
