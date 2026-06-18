import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONTACT_INFO, WHATSAPP_RESERVE } from '../constants';

const Location: React.FC = () => {
  return (
    <section id="localizacao" className="py-16 md:py-24 bg-navy scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col gap-6">
            <div>
              <h2 className="text-xs font-bold tracking-[0.2em] text-muted uppercase mb-4">Localização</h2>
              <h3 className="text-4xl lg:text-5xl font-display font-black text-primary leading-tight mb-5">
                Onde nos <span className="italic font-semibold text-muted">encontrar</span>
              </h3>
              <p className="text-muted font-light text-lg leading-relaxed max-w-lg">
                Retirada próxima ao Iate Club em Laguna/SC ou em local combinado no momento da locação.
              </p>
            </div>

            <div className="flex gap-4 p-6 border border-white/10 bg-surface">
              <MapPin className="text-primary shrink-0 mt-1" size={26} strokeWidth={1.5} />
              <div>
                <h4 className="font-display font-bold text-lg text-primary mb-1">Endereço</h4>
                <p className="text-muted font-light leading-relaxed">{CONTACT_INFO.address}</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 border border-white/10 bg-surface">
              <Phone className="text-primary shrink-0 mt-1" size={26} strokeWidth={1.5} />
              <div>
                <h4 className="font-display font-bold text-lg text-primary mb-1">Telefones</h4>
                <p className="text-muted font-light leading-relaxed">{CONTACT_INFO.phone}<br />{CONTACT_INFO.phoneSecondary}</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 border border-white/10 bg-surface">
              <MessageCircle className="text-primary shrink-0 mt-1" size={26} strokeWidth={1.5} />
              <div>
                <h4 className="font-display font-bold text-lg text-primary mb-1">WhatsApp</h4>
                <a href={WHATSAPP_RESERVE} target="_blank" rel="noopener noreferrer"
                  className="text-primary font-semibold tracking-widest uppercase text-sm hover:text-muted transition-colors">
                  Reserve direto pelo WhatsApp →
                </a>
              </div>
            </div>

            <a href={CONTACT_INFO.maps} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-primary text-navy text-xs uppercase tracking-[0.15em] font-bold px-8 py-4 hover:bg-muted transition-colors self-center md:self-start">
              <Navigation size={18} strokeWidth={1.5} /> Como chegar
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full min-h-[480px] w-full overflow-hidden border border-white/10">
            <iframe
              title="Mapa da JMS Jetski em Laguna - SC"
              src="https://maps.google.com/maps?q=Rua%20Toledo%20Pizza,%20897%20-%20Navegantes,%20Laguna%20-%20SC&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{ border: 0, minHeight: '480px' }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-700" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
