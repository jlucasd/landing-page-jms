import React, { useState, useEffect, useCallback } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_IMAGES } from '../constants';

/*
 * SEÇÃO "GALERIA" — inspirada em landonorris.com.
 * Mostra TODAS as fotos reais de jmsjetski.com.br/galeria.
 * Clique amplia em modal (lightbox) com navegação anterior/próxima
 * (botões + setas do teclado). Sem dependências externas.
 */
const Galeria: React.FC = () => {
  const [index, setIndex] = useState<number | null>(null);
  const total = GALLERY_IMAGES.length;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % total)), [total]);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + total) % total)), [total]);

  useEffect(() => {
    if (index === null) { document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [index, close, next, prev]);

  return (
    <section id="galeria" className="py-16 md:py-24 bg-secondary scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Galeria</span>
        {/* Título no mesmo estilo de display que antes ficava abaixo das fotos */}
        <h2 className="text-stroke font-display font-black uppercase leading-[0.9] tracking-tight text-5xl md:text-7xl xl:text-[6rem] mt-2 mb-10">
          Momentos na água
        </h2>

        {/* Grade com todas as fotos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {GALLERY_IMAGES.map((src, i) => (
            <motion.button
              key={src}
              onClick={() => setIndex(i)}
              aria-label={`Ampliar foto ${i + 1} de ${total}`}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
              className="relative aspect-square overflow-hidden bg-surface group cursor-pointer"
            >
              <img src={src} alt={`Galeria JMS Jetski — passeio em Laguna (foto ${i + 1})`}
                width={640} height={640} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute inset-0 bg-navy/45 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity grid place-items-center">
                <span className="w-11 h-11 rounded-full bg-primary text-navy grid place-items-center">
                  <ZoomIn size={20} strokeWidth={1.5} />
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox com navegação */}
      <AnimatePresence>
        {index !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 backdrop-blur-sm p-4"
            onClick={close} role="dialog" aria-modal="true" aria-label={`Foto ${index + 1} de ${total}`}>

            <button onClick={close} aria-label="Fechar"
              className="absolute top-5 right-5 text-primary hover:text-muted transition-colors p-2 z-20">
              <X size={32} strokeWidth={1.5} />
            </button>

            <span className="absolute top-7 left-1/2 -translate-x-1/2 text-muted text-sm font-medium z-20">
              {index + 1} / {total}
            </span>

            <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Foto anterior"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-primary hover:text-navy text-primary grid place-items-center transition-colors">
              <ChevronLeft size={26} strokeWidth={1.5} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Próxima foto"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-primary hover:text-navy text-primary grid place-items-center transition-colors">
              <ChevronRight size={26} strokeWidth={1.5} />
            </button>

            <AnimatePresence mode="wait">
              <motion.img key={index}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                src={GALLERY_IMAGES[index]} alt={`Galeria JMS Jetski — foto ${index + 1} de ${total}`}
                onClick={(e) => e.stopPropagation()}
                className="max-w-[92vw] max-h-[82vh] object-contain rounded-lg shadow-2xl" />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Galeria;
