import React from 'react';
import { motion } from 'framer-motion';
import { DIFERENCIAIS } from '../constants';

const Diferenciais: React.FC = () => {
  return (
    <section id="diferenciais" className="py-16 md:py-24 bg-navy scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Por que a JMS?</h2>
          <h3 className="text-4xl lg:text-5xl font-display font-black text-primary leading-tight">
            Diferenciais que <span className="italic font-semibold text-muted">fazem o seu dia</span>
          </h3>
          <p className="text-muted font-light text-lg">
            Equipamentos de qualidade, segurança em primeiro lugar e atendimento personalizado para você curtir o mar sem preocupação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {DIFERENCIAIS.map((d, i) => (
            <motion.div key={d.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-surface border border-white/10 p-8 hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300">
              <d.icon className="text-primary mb-5" size={34} strokeWidth={1.3} />
              <h4 className="font-display font-bold text-xl text-primary mb-2">{d.title}</h4>
              <p className="text-muted font-light leading-relaxed">{d.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Diferenciais;
