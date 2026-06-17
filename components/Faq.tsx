import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS, CONTACT_INFO } from '../constants';

const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-24 bg-secondary scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12 text-center">
          <h2 className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Dúvidas frequentes</h2>
          <h3 className="text-4xl lg:text-5xl font-display font-black text-primary leading-tight">
            Visite nosso <span className="italic font-semibold text-muted">FAQ</span>
          </h3>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <h4>
                  <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={`faq-${i}`}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left text-primary font-display font-bold text-lg md:text-xl hover:text-muted transition-colors">
                    {item.question}
                    <ChevronDown size={22} strokeWidth={1.5} className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </h4>
                <div id={`faq-${i}`} hidden={!isOpen} className="pb-5 -mt-1">
                  <p className="text-muted font-light leading-relaxed">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-muted font-light mt-10">
          Ainda com dúvidas? Fale com a gente no{' '}
          <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:text-muted transition-colors">WhatsApp</a>.
        </p>
      </div>
    </section>
  );
};

export default Faq;
