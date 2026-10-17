import React, { useEffect, useState } from 'react';
import { Instagram as InstagramIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { INSTAGRAM_POSTS, CONTACT_INFO } from '../constants';

import type { InstagramPost } from '../types';

/*
 * Integração do Instagram (@jmsalugueldejetski).
 * Os posts vêm em tempo real da função serverless `/api/instagram` (Instagram
 * API, cache de 1h na CDN). Enquanto carrega — ou se a API falhar / não
 * estiver configurada, como no `npm run dev` — mostra a grade estática de
 * `INSTAGRAM_POSTS` como reserva, então a seção nunca fica vazia.
 */
const Instagram: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS);

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

  return (
    <section id="instagram" className="py-16 md:py-24 bg-secondary scroll-mt-20">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {posts.map((post, i) => (
            <motion.a key={post.permalink + i} href={post.permalink} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              title={post.caption}
              aria-label={`Ver post no Instagram: ${post.caption}`}
              className="relative aspect-square overflow-hidden bg-surface group">
              <img src={post.image} alt={post.caption} width={400} height={400} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute inset-0 bg-navy/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <InstagramIcon className="text-primary self-end" size={22} strokeWidth={1.5} />
                <span className="text-primary text-[0.7rem] leading-snug line-clamp-3">{post.caption}</span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instagram;
