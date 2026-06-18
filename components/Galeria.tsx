import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { GALLERY } from '../constants';

/*
 * SEÇÃO "GALERIA" — horizontal-track em movimento (estilo landonorris.com)
 * A faixa de fotos anda continuamente para a ESQUERDA (marquee infinito),
 * em desktop e mobile. Larguras variadas (altura fixa + largura automática
 * pela proporção) dão o visual editorial. Pausa ao passar o mouse / tocar,
 * e clique amplia no lightbox com navegação anterior/próxima.
 */
const SPEED = 55; // px por segundo

const Galeria: React.FC = () => {
  const total = GALLERY.length;
  const items = [...GALLERY, ...GALLERY]; // duplicado para loop contínuo

  // ---------- Lightbox ----------
  const [index, setIndex] = useState<number | null>(null);
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

  // ---------- Marquee ----------
  const trackRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLButtonElement>(null); // 1º item da 2ª cópia
  const offset = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (!track || reduced || paused || index !== null) return;
    const loopW = secondRef.current?.offsetLeft ?? 0; // largura de uma cópia (inclui o gap)
    if (loopW <= 0) return;
    offset.current += (delta / 1000) * SPEED;
    if (offset.current >= loopW) offset.current -= loopW;
    track.style.transform = `translateX(${-offset.current}px)`;
  });

  return (
    <section id="galeria" className="bg-secondary scroll-mt-20 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <span className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Galeria</span>
        <h2 className="text-stroke font-display font-black uppercase leading-[0.9] tracking-tight text-5xl md:text-7xl mt-2">
          Momentos na água
        </h2>
      </div>

      {/* Faixa em movimento */}
      <div
        className="relative w-full"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}
      >
        {/* esmaecimento nas bordas */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-secondary to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-secondary to-transparent z-10" />

        <div
          ref={trackRef}
          className={`flex gap-4 md:gap-6 px-4 sm:px-6 lg:px-8 will-change-transform ${reduced ? 'overflow-x-auto snap-x scrollbar-thin pb-4' : ''}`}
        >
          {items.map((g, i) => {
            const real = i % total;
            const isClone = i >= total;
            return (
              <button key={i}
                ref={i === total ? secondRef : undefined}
                onClick={() => setIndex(real)}
                aria-hidden={isClone} tabIndex={isClone ? -1 : 0}
                aria-label={`Ampliar foto ${real + 1} de ${total}`}
                className="relative shrink-0 snap-start overflow-hidden bg-surface group cursor-pointer">
                <img src={g.src} alt={`Galeria JMS Jetski — passeio em Laguna (foto ${real + 1})`}
                  width={g.w} height={g.h} loading="lazy"
                  className="h-64 sm:h-72 md:h-80 lg:h-[26rem] w-auto max-w-none object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-0 ring-0 group-hover:ring-2 ring-inset ring-white/60 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {index !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 backdrop-blur-sm p-4"
            onClick={close} role="dialog" aria-modal="true" aria-label={`Foto ${index + 1} de ${total}`}>
            <button onClick={close} aria-label="Fechar"
              className="absolute top-5 right-5 text-primary hover:text-muted transition-colors p-2 z-20">
              <X size={32} strokeWidth={1.5} />
            </button>
            <span className="absolute top-7 left-1/2 -translate-x-1/2 text-muted text-sm font-medium z-20">{index + 1} / {total}</span>
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
                src={GALLERY[index].src} alt={`Galeria JMS Jetski — foto ${index + 1} de ${total}`}
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
