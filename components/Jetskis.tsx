import React from 'react';
import { motion } from 'framer-motion';
import { JETSKI_FRAMES, CONTACT_INFO } from '../constants';

/*
 * SEÇÃO "JETSKI" — modelo callout-socials-layout
 * (inspirado em landonorris.com — seções "On Track / Off Track")
 * Track horizontal com scroll-snap, labels flutuantes, quotes
 * intercaladas em tipografia grande e CTA final para o WhatsApp.
 * A animação de entrada usa IntersectionObserver (via framer-motion whileInView).
 */
const Jetskis: React.FC = () => {
  return (
    <section id="jetskis" className="py-16 md:py-24 bg-navy scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Nossa frota</span>
        <h2 className="font-display font-black leading-[0.9] tracking-tight text-primary text-6xl md:text-8xl lg:text-[8rem] mt-2">
          NOSSOS<br /><span className="text-stroke">JETSKIS</span>
        </h2>
      </div>

      {/* horizontal-track */}
      <div role="list" aria-label="Frota de jetskis JMS"
        className="flex gap-6 overflow-x-scroll snap-x snap-mandatory scrollbar-thin px-4 sm:px-6 lg:px-8 pt-12 pb-6 mt-2">
        {JETSKI_FRAMES.map((f, i) => (
          f.type === 'model' ? (
            <motion.article key={i} role="listitem"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
              className="relative flex-none w-[78%] max-w-[340px] md:w-[32%] aspect-[4/5] overflow-hidden bg-surface snap-start group">
              <img src={f.image} alt={f.alt} width={640} height={800} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
              <div className="absolute left-5 bottom-5 z-10">
                <div className="font-display font-extrabold text-xl uppercase text-primary">{f.name}</div>
                <div className="text-sm font-semibold tracking-wide text-muted">{f.spec}</div>
              </div>
            </motion.article>
          ) : (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
              className="flex-none w-[78%] max-w-[340px] md:w-[32%] flex items-center snap-start">
              <p className="font-display font-extrabold leading-tight text-3xl md:text-4xl text-primary">
                “{f.highlight
                  ? f.quote!.split(f.highlight).flatMap((part, idx) => idx === 0 ? [part] : [<span key={idx} className="text-muted">{f.highlight}</span>, part])
                  : f.quote}”
              </p>
            </motion.div>
          )
        ))}
      </div>
      <p className="text-center text-muted text-[0.7rem] tracking-[0.2em] uppercase mt-1">← arraste para explorar →</p>

      <div className="text-center mt-10">
        <a href={`${CONTACT_INFO.whatsapp}?text=${encodeURIComponent('Olá! Quero reservar o jetski Yamaha da JMS.')}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-primary text-navy font-bold text-sm tracking-widest uppercase hover:bg-muted transition-colors">
          Reserve o seu
        </a>
      </div>
    </section>
  );
};

export default Jetskis;
