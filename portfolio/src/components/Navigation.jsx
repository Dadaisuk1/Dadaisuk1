import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Icon } from '@mdi/react';
import { mdiDownload } from '@mdi/js';
import DarkModeToggle from './DarkModeToggle';

gsap.registerPlugin(ScrollToPlugin);

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      // Determine active section
      const sections = ['home', 'about', 'education', 'certifications', 'projects', 'contact'];
      let current = 'home';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Close mobile menu if open
    setIsOpen(false);

    const duration = prefersReducedMotion ? 0.1 : 1.5;

    gsap.to(window, {
      duration,
      scrollTo: { y: href, offsetY: 80 },
      overwrite: 'auto',
    });
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/assets/DDJL_Resume.pdf';
    link.download = 'DDJL_Resume.pdf';
    link.click();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-[#0D1B2A]/40 backdrop-blur-xl shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex w-full items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        {/* Logo Column */}
        <div className="flex-shrink-0">
          <a
            href="#home"
            onClick={(e) => handleSmoothScroll(e, '#home')}
            className="inline-block font-serif text-lg font-semibold uppercase tracking-[0.26em] text-[#F7F3E9] transition hover:text-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B2A] rounded-sm"
          >
            DDJL
          </a>
        </div>

        {/* Navigation Links - Center Column (Desktop Only) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-1 text-sm text-[#F7F3E9]">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={`transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md px-3 py-2 ${
                  activeSection === link.href.slice(1)
                    ? 'text-[#D4AF37] bg-white/10'
                    : 'hover:text-[#D4AF37] hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Dark Mode Toggle & Resume */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          {/* <div className="hidden md:block">
            <DarkModeToggle />
          </div> */}

          <div className="hidden md:flex">
            <button
              onClick={handleDownloadResume}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#0D1B2A] transition duration-200 hover:bg-[#F7F3E9] shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B2A]"
              aria-label="Download resume"
            >
              <Icon path={mdiDownload} size={0.8} />
              Résumé
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-[#F7F3E9] transition duration-200 hover:border-[#D4AF37] hover:text-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B2A] md:hidden"
            onClick={() => setIsOpen((current) => !current)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span className="text-lg" aria-hidden="true">
              {isOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-[#0D1B2A]/95 backdrop-blur-xl px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3 text-sm text-[#F7F3E9]">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="block rounded-lg px-4 py-3 transition duration-200 hover:bg-white/5 hover:text-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B2A]"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handleDownloadResume}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0D1B2A] transition duration-200 hover:bg-[#F7F3E9] shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B2A]"
              aria-label="Download resume"
            >
              <Icon path={mdiDownload} size={0.8} />
              Resume
            </button>
            <div className="flex justify-center">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
