import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Instagram as InstagramIcon, ChevronLeft, ChevronRight, Play, Images, ArrowUpRight } from 'lucide-react';
import { INSTAGRAM_POSTS, CONTACT_INFO } from '../constants';
import type { InstagramPost } from '../types';

/*
 * Integração do Instagram (@jmsalugueldejetski).
 * Os posts vêm em tempo real da função serverless `/api/instagram` (Instagram
 * API, feed inteiro até 60 posts, cache de 1h na CDN). Enquanto carrega — ou se
 * a API falhar / não estiver configurada, como no `npm run dev` — mostra a grade
 * estática de `INSTAGRAM_POSTS` como reserva, então a seção nunca fica vazia.
 *
 * Carrossel: trilho com scroll-snap (arrastar no celular, setas no desktop) que
 * avança sozinho a cada AUTOPLAY_MS e volta ao início no fim. O autoplay pausa
 * com o mouse em cima, toque, foco do teclado, aba em segundo plano, seção fora
 * da tela ou `prefers-reduced-motion`.
 */
const AUTOPLAY_MS = 3500;

const Instagram: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/instagram', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { posts?: InstagramPost[] } | null) => {
        if (data?.posts?.length) setPosts(data.posts);
      })
      .catch(() => { /* mantém a grade estática */ });
    return () => ctrl.abort();
  }, []);

  // Posição do trilho → barra de progresso e estado das setas
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [posts, sync]);

  /** Avança/volta um item (dir = ±1); no fim, volta ao início. */
  const step = useCallback((dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const w = item ? item.offsetWidth + gap : el.clientWidth;
    const max = el.scrollWidth - el.clientWidth;
    if (dir > 0 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: dir * w, behavior: 'smooth' });
  }, []);

  // Só roda o autoplay com a seção visível
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => { if (!document.hidden) step(1); }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, inView, step]);

  const arrow = 'absolute top-1/2 -translate-y-1/2 z-10 hidden md:grid place-items-center w-11 h-11 rounded-full bg-navy/80 border border-white/20 text-primary hover:bg-primary hover:text-navy transition-colors disabled:opacity-0 disabled:pointer-events-none';

  return (
    <section id="instagram" ref={sectionRef} className="py-16 md:py-24 bg-secondary scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Siga a JMS</h2>
            <h3 className="text-4xl lg:text-5xl font-display font-black text-primary leading-tight">
              No nosso <span className="italic font-semibold text-muted">Instagram</span>
            </h3>
            <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors font-semibold">
              <InstagramIcon size={20} strokeWidth={1.5} /> {CONTACT_INFO.instagramHandle}
            </a>
          </div>
          <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer"
            className="self-center md:self-auto inline-flex items-center gap-2 px-6 py-3 bg-primary text-navy font-bold text-sm tracking-widest uppercase hover:bg-muted transition-colors">
            <InstagramIcon size={18} strokeWidth={1.8} /> Seguir
          </a>
        </div>

        <div className="relative"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}
          onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <button type="button" onClick={() => step(-1)} disabled={atStart}
            aria-label="Posts anteriores" className={`${arrow} -left-5`}>
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          <div ref={trackRef} onScroll={sync}
            role="list" aria-label={`Posts do Instagram ${CONTACT_INFO.instagramHandle}`}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none">
            {posts.map((post, i) => (
              <a key={post.permalink + i} href={post.permalink} target="_blank" rel="noopener noreferrer"
                role="listitem" title={post.caption}
                aria-label={`Ver post no Instagram: ${post.caption}`}
                className="relative shrink-0 snap-start aspect-square overflow-hidden bg-surface group w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1.5rem)/3)] lg:w-[calc((100%-3.75rem)/6)]">
                <img src={post.image} alt={post.caption} width={400} height={400}
                  loading={i < 6 ? 'eager' : 'lazy'} decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                {post.type && post.type !== 'IMAGE' && (
                  <span className="absolute top-2 right-2 text-primary drop-shadow" aria-hidden="true">
                    {post.type === 'VIDEO' ? <Play size={18} fill="currentColor" /> : <Images size={18} />}
                  </span>
                )}
                <span className="absolute inset-0 bg-navy/55 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <InstagramIcon className="text-primary self-end" size={22} strokeWidth={1.5} />
                  <span className="text-primary text-[0.7rem] leading-snug line-clamp-3">{post.caption}</span>
                </span>
              </a>
            ))}

            {/* Último card: leva ao perfil completo */}
            <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" role="listitem"
              className="shrink-0 snap-start aspect-square grid place-content-center gap-3 text-center border border-white/20 hover:border-white text-primary transition-colors w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1.5rem)/3)] lg:w-[calc((100%-3.75rem)/6)]">
              <InstagramIcon className="mx-auto" size={30} strokeWidth={1.3} />
              <span className="text-xs font-bold tracking-widest uppercase inline-flex items-center gap-1">
                Ver tudo <ArrowUpRight size={14} />
              </span>
            </a>
          </div>

          <button type="button" onClick={() => step(1)} disabled={atEnd}
            aria-label="Próximos posts" className={`${arrow} -right-5`}>
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Progresso do carrossel */}
        <div className="mt-6 h-0.5 bg-white/15 overflow-hidden" aria-hidden="true">
          <div className="h-full bg-primary origin-left transition-transform duration-300"
            style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }} />
        </div>
      </div>
    </section>
  );
};

export default Instagram;
