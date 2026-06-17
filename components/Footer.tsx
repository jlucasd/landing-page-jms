import React from 'react';
import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import { CONTACT_INFO, NAV_ITEMS, WHATSAPP_RESERVE } from '../constants';
import Logo from './Logo';

const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const el = document.getElementById(href.replace('#', ''));
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
};

const Footer: React.FC = () => {
  return (
    <footer id="contato" className="bg-secondary text-primary pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-5 text-center lg:text-left">
            <Logo className="text-2xl" />
            <p className="text-muted text-sm font-light leading-relaxed max-w-sm mx-auto lg:mx-0">
              Aluguel de jetski em Laguna - SC e região. {CONTACT_INFO.tagline}
            </p>
          </div>

          <div className="text-center lg:text-left">
            <h4 className="text-xs font-bold tracking-[0.2em] text-muted uppercase mb-6">Navegação</h4>
            <ul className="space-y-4 text-sm text-muted font-light">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={(e) => scrollTo(e, item.href)} className="hover:text-primary transition-colors cursor-pointer">{item.label}</a>
                </li>
              ))}
              <li><a href={WHATSAPP_RESERVE} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors cursor-pointer">Reservar</a></li>
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h4 className="text-xs font-bold tracking-[0.2em] text-muted uppercase mb-6">Contato</h4>
            <ul className="space-y-4 text-sm text-muted font-light">
              <li className="flex flex-col items-center lg:flex-row lg:items-start gap-2">
                <MapPin className="text-primary flex-shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
                <span className="max-w-[220px] leading-relaxed">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex flex-col items-center lg:flex-row lg:items-center gap-2">
                <Phone className="text-primary flex-shrink-0" size={18} strokeWidth={1.5} />
                <span>{CONTACT_INFO.phone}</span>
              </li>
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h4 className="text-xs font-bold tracking-[0.2em] text-muted uppercase mb-6">Redes sociais</h4>
            <div className="flex justify-center lg:justify-start space-x-4">
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href={CONTACT_INFO.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted font-light">
          <p>© {new Date().getFullYear()} JMS Jetski. Todos os direitos reservados.</p>
          <p>Desenvolvido por <a href="https://jlucasd.github.io/portfolio-joao/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-muted transition-colors">João Luccas Damiani</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
