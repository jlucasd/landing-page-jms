import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { WHATSAPP_RESERVE, HERO_VIDEO, HERO_POSTER } from '../constants';

const scrollToJetskis = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const el = document.getElementById('jetskis');
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
};

/*
 * HERO — vídeo igual ao do site oficial (CDN Wix) que some ao rolar a página.
 * Efeito inspirado em landonorris.com: o hero fica "pinned" (sticky) enquanto
 * rolamos uma faixa alta; o vídeo faz fade-out + leve zoom e a próxima seção
 * sobe por cima dele.
 */
const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <header id="hero" ref={ref} className="relative h-[185vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Vídeo de fundo */}
        <motion.div style={{ opacity: videoOpacity, scale: videoScale }} className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover object-center"
            autoPlay muted loop playsInline preload="metadata"
            poster={HERO_POSTER}
            aria-label="Vídeo: jetski da JMS navegando em Laguna SC"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
        </motion.div>

        {/* Conteúdo */}
        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-black text-primary leading-[0.95] tracking-tight mb-5 max-w-[14ch] text-center mx-auto sm:text-left sm:mx-0 [text-shadow:0_2px_24px_rgba(10,26,46,0.7)]">
              Aluguel de Jetski em Laguna - SC e região
            </h1>

            <p className="text-lg md:text-2xl text-primary/90 font-light max-w-xl leading-relaxed [text-shadow:0_1px_16px_rgba(10,26,46,0.85)]">
              Quer se divertir? A JMS Jetski leva você para acelerar nas águas de Laguna e região com segurança, qualidade e o melhor preço.
            </p>

            <div className="flex flex-wrap gap-4 mt-9 justify-center sm:justify-start">
              <a href={WHATSAPP_RESERVE}
                target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-navy font-bold text-sm tracking-widest uppercase hover:bg-muted transition-colors">
                Reserve agora
              </a>
              <a href="#jetskis" onClick={scrollToJetskis}
                className="px-8 py-4 border border-white/20 text-primary font-bold text-sm tracking-widest uppercase hover:border-primary hover:bg-white/5 transition-colors cursor-pointer">
                Ver a frota
              </a>
            </div>
          </div>
        </motion.div>

        {/* Indicador de rolagem */}
        <motion.div style={{ opacity: contentOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted">
          <span className="text-[0.65rem] tracking-[0.25em] uppercase">Role para baixo</span>
          <ChevronDown className="animate-bounce" size={22} strokeWidth={1.5} />
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;
