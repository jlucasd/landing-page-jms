import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { LOCAIS } from '../constants';

const Locais: React.FC = () => {
  return (
    <section id="locais" className="py-16 md:py-24 bg-secondary scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-2xl mb-12">
          <h2 className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Locais para navegação</h2>
          <h3 className="text-4xl lg:text-5xl font-display font-black text-primary leading-tight">
            Onde você pode <span className="italic font-semibold text-muted">acelerar</span>
          </h3>
          <p className="text-muted font-light text-lg">Veja os locais onde você pode realizar a sua navegação com a JMS.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOCAIS.map((l, i) => (
            <motion.a key={l.name}
              href={l.mapUrl} target="_blank" rel="noopener noreferrer"
              aria-label={`Abrir ${l.name} no Google Maps`}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative overflow-hidden bg-surface border border-white/10 hover:border-primary/40 transition-colors group block">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={l.image} alt={l.alt} width={800} height={600} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-primary font-display font-bold text-xl">
                  <MapPin size={20} strokeWidth={1.5} /> {l.name}
                </div>
                <p className="text-muted font-light mt-2 leading-relaxed">{l.description}</p>
                <span className="inline-flex items-center gap-1.5 mt-4 text-primary font-semibold text-sm tracking-wide group-hover:text-white transition-colors">
                  Ver no mapa
                  <ArrowUpRight size={16} strokeWidth={2} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locais;
