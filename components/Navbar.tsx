import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS, WHATSAPP_RESERVE } from '../constants';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';

const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, onDone?: () => void) => {
  e.preventDefault();
  onDone?.();
  const el = document.getElementById(href.replace('#', ''));
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-navy/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} className="text-primary">
            <Logo className="text-xl sm:text-2xl" />
          </a>

          {/* Desktop */}
          <div className="hidden lg:flex space-x-9 items-center">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} onClick={(e) => scrollTo(e, item.href)}
                className="text-muted hover:text-primary transition-colors text-xs uppercase tracking-[0.15em] font-semibold cursor-pointer">
                {item.label}
              </a>
            ))}
            <a href={WHATSAPP_RESERVE} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-navy text-xs uppercase tracking-[0.15em] font-bold hover:bg-muted transition-colors cursor-pointer">
              Reservar
            </a>
          </div>

          {/* Mobile button */}
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menu" aria-expanded={isOpen}
            className="lg:hidden text-primary p-2">
            {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-navy border-b border-white/10 overflow-hidden">
            <div className="px-6 py-8 space-y-6 flex flex-col items-center">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} onClick={(e) => scrollTo(e, item.href, () => setIsOpen(false))}
                  className="text-lg font-display text-primary hover:text-muted transition-colors">
                  {item.label}
                </a>
              ))}
              <a href={WHATSAPP_RESERVE} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}
                className="w-full text-center px-6 py-4 bg-primary text-navy text-sm uppercase tracking-widest font-bold">
                Reservar agora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
