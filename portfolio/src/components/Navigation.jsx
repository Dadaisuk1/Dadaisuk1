const links = [
  { href: '#home', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

function Navigation() {
  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#0D1B2A]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8 lg:px-12">
        <a href="#home" className="font-serif text-lg font-semibold tracking-[0.18em] text-cream">
          PORTFOLIO
        </a>
        <div className="flex items-center gap-4 text-sm text-cream/80 sm:gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
