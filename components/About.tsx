import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TEAM } from '../constants';

const About: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const total = TEAM.length;
  const go = useCallback((n: number) => setIdx((i) => (n + total) % total), [total]);

  // Autoplay (pausa ao passar o mouse)
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [paused, total]);

  const m = TEAM[idx];

  return (
    <section id="sobre" className="py-16 md:py-24 bg-secondary scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Texto */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="space-y-4">
            <h2 className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Sobre nós</h2>
            <h3 className="text-4xl lg:text-5xl font-display font-black text-primary leading-[1.05] tracking-tight">
              Nós somos a <span className="italic font-semibold text-muted">JMS!</span>
            </h3>
            <div className="w-12 h-px bg-primary/50" />
            <div className="space-y-3 text-muted font-light text-sm leading-relaxed">
              <p>
                Você quer se divertir alugando um Jet Ski em Laguna/SC e região e ainda compartilhar a experiência com seus amigos? Nós somos a empresa certa!
              </p>
              <p>
                Fundada em <strong className="text-primary font-medium">8 de dezembro de 2022</strong> por três amigos com o mesmo sonho de empreender e criar momentos inesquecíveis de diversão e aventura. Na JMS, oferecemos todo o equipamento de segurança necessário, incluindo: coletes salva-vidas, âncoras, cabos de atracação e cases impermeáveis para documentos e acessórios.
              </p>
              <p>
                Além disso, fornecemos um contrato de locação claro e transparente para garantir a tranquilidade de nossos clientes. Oferecemos a opção de realizar a descida dos JetSkis na água pela nossa equipe, facilitando ainda mais sua experiência.
              </p>
              <p>
                Disponibilizamos também a carreta para transporte rodoviário, permitindo ao locatário a flexibilidade no transporte e escolha de locais para suas aventuras.
              </p>
              <p>
                Contate-nos, venha nos visitar e descubra o que é sentir a liberdade e viver momentos incríveis com a JMS.
              </p>
            </div>
          </motion.div>

          {/* Carrossel "Quem comanda a JMS" */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Quem comanda a JMS</h3>

            <div
              className="relative bg-surface border border-white/10 overflow-hidden rounded-2xl"
              onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
              role="group" aria-roledescription="carrossel" aria-label="Comandantes da JMS"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  aria-roledescription="slide" aria-label={`${idx + 1} de ${total}: ${m.name}`}
                >
                  {/* Imagem preenchendo o card (sem esticar, sem moldura) */}
                  <div className="relative h-72 sm:h-96">
                    <img src={m.photo} alt={`${m.name} — equipe da JMS Jetski`}
                      width={800} height={960} loading="lazy"
                      style={{ objectPosition: m.focus ?? 'center' }}
                      className="w-full h-full object-cover" />
                  </div>
                  {/* Texto */}
                  <div className="p-6 sm:p-8 relative">
                    <p className="font-display font-black text-primary text-2xl leading-none">
                      {m.name} <span className="text-muted text-xs uppercase tracking-widest font-sans align-middle ml-1">{m.role}</span>
                    </p>
                    <p className="text-muted font-light leading-relaxed mt-3">{m.bio}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Setas */}
              <button onClick={() => go(idx - 1)} aria-label="Comandante anterior"
                className="absolute top-36 sm:top-48 -translate-y-1/2 left-3 z-10 w-10 h-10 rounded-full bg-navy/60 hover:bg-primary hover:text-navy text-primary grid place-items-center transition-colors backdrop-blur-sm">
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>
              <button onClick={() => go(idx + 1)} aria-label="Próximo comandante"
                className="absolute top-36 sm:top-48 -translate-y-1/2 right-3 z-10 w-10 h-10 rounded-full bg-navy/60 hover:bg-primary hover:text-navy text-primary grid place-items-center transition-colors backdrop-blur-sm">
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Indicadores */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {TEAM.map((t, i) => (
                <button key={t.name} onClick={() => setIdx(i)} aria-label={`Ver ${t.name}`} aria-current={i === idx}
                  className={`h-2 rounded-full transition-all ${i === idx ? 'w-7 bg-primary' : 'w-2 bg-white/25 hover:bg-white/50'}`} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
