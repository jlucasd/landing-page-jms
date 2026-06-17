import React, { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS, CONTACT_INFO } from '../constants';

const Testimonials: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;
  const go = useCallback((n: number) => setIdx((i) => (n + total) % total), [total]);

  // Autoplay (pausa no hover)
  useEffect(() => {
    if (paused || total < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [paused, total]);

  const t = TESTIMONIALS[idx];

  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-navy scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Avaliações</h2>
        <h3 className="text-4xl lg:text-5xl font-display font-black text-primary leading-tight mt-3 mb-12">
          O que dizem <span className="italic font-semibold text-muted">sobre nós?</span>
        </h3>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          role="group" aria-roledescription="carrossel" aria-label="Depoimentos de clientes"
        >
          <AnimatePresence mode="wait">
            <motion.figure key={idx}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-surface border border-white/10 p-8 md:p-12 text-left relative rounded-2xl"
              aria-roledescription="slide" aria-label={`${idx + 1} de ${total}`}
            >
              <Quote className="text-primary/30 absolute top-6 right-6" size={40} strokeWidth={1.5} />
              <div className="flex gap-1 mb-4" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="text-primary fill-primary" size={18} />
                ))}
              </div>
              <blockquote className="text-muted font-light text-lg leading-relaxed min-h-[7.5rem]">“{t.text}”</blockquote>
              <figcaption className="mt-5 font-display font-bold text-primary">{t.name}</figcaption>
            </motion.figure>
          </AnimatePresence>

          {total > 1 && (
            <>
              <button onClick={() => go(idx - 1)} aria-label="Depoimento anterior"
                className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-surface border border-white/10 hover:bg-primary hover:text-navy text-primary grid place-items-center transition-colors">
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>
              <button onClick={() => go(idx + 1)} aria-label="Próximo depoimento"
                className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-surface border border-white/10 hover:bg-primary hover:text-navy text-primary grid place-items-center transition-colors">
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        {total > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {TESTIMONIALS.map((tt, i) => (
              <button key={tt.name + i} onClick={() => setIdx(i)} aria-label={`Ver depoimento ${i + 1}`} aria-current={i === idx}
                className={`h-2 rounded-full transition-all ${i === idx ? 'w-7 bg-primary' : 'w-2 bg-white/25 hover:bg-white/50'}`} />
            ))}
          </div>
        )}

        <a href={CONTACT_INFO.googleReviews} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center mt-10 text-primary font-semibold tracking-widest uppercase text-sm hover:text-muted transition-colors">
          Veja mais comentários aqui →
        </a>
      </div>
    </section>
  );
};

export default Testimonials;
