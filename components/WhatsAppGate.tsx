import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ChevronLeft, GraduationCap, ShieldAlert } from 'lucide-react';
import { CONTACT_INFO, LOCAIS, ALBOR_INFO } from '../constants';

/**
 * Filtro antes do WhatsApp de reservas: intercepta (em captura, no document) qualquer
 * link para o número de reservas e pergunta local + habilitação. Só quem tem Motonauta
 * segue para o WhatsApp; os demais são direcionados à Escola Albor.
 */
const isReserveLink = (href: string) =>
  href.includes(`phone=${CONTACT_INFO.whatsappNumber}`) || href.includes(`wa.me/${CONTACT_INFO.whatsappNumber}`);

const OUTRO_LOCAL = 'Outro local / ainda não sei';

const reserveUrl = (local: string) => {
  const text = `Olá, vim através do site e gostaria de alugar o Jet Ski para me divertir. Local: ${local}. Possuo habilitação Motonauta (CHA-MTA).`;
  return `https://api.whatsapp.com/send?phone=${CONTACT_INFO.whatsappNumber}&text=${encodeURIComponent(text)}`;
};

type Step = 'local' | 'hab' | 'blocked';

const WhatsAppGate: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('local');
  const [local, setLocal] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || !isReserveLink(a.href) || a.closest('[data-wa-gate]')) return;
      e.preventDefault();
      lastFocus.current = a;
      setStep('local');
      setLocal('');
      setOpen(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 50);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(t); };
  }, [open, step, close]);

  const chooseLocal = (name: string) => { setLocal(name); setStep('hab'); };

  const confirmHab = () => {
    window.open(reserveUrl(local), '_blank', 'noopener,noreferrer');
    close();
  };

  const denyHab = () => setStep('blocked');

  const optionCls = 'w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-primary font-medium hover:bg-white/10 hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors';

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 backdrop-blur-sm p-4"
          onClick={close} data-wa-gate>
          <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="wa-gate-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
            <button onClick={close} aria-label="Fechar"
              className="absolute top-4 right-4 text-muted hover:text-primary transition-colors p-1">
              <X size={24} strokeWidth={1.5} />
            </button>

            {step === 'hab' && (
              <button onClick={() => setStep('local')}
                className="inline-flex items-center gap-1 text-muted hover:text-primary text-sm mb-3 transition-colors">
                <ChevronLeft size={16} /> Voltar
              </button>
            )}

            {step === 'local' && (
              <>
                <p className="text-muted text-xs font-semibold uppercase tracking-widest mb-2">Antes de reservar · 1 de 2</p>
                <h2 id="wa-gate-title" className="font-display text-2xl font-bold text-primary mb-5">Onde você deseja navegar?</h2>
                <div className="flex flex-col gap-2.5">
                  {[...LOCAIS.map((l) => l.name), OUTRO_LOCAL].map((name, i) => (
                    <button key={name} onClick={() => chooseLocal(name)} className={optionCls} data-autofocus={i === 0 || undefined}>
                      <MapPin size={18} className="text-muted shrink-0" /> {name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 'hab' && (
              <>
                <p className="text-muted text-xs font-semibold uppercase tracking-widest mb-2">Antes de reservar · 2 de 2</p>
                <h2 id="wa-gate-title" className="font-display text-2xl font-bold text-primary mb-2">Você possui habilitação náutica?</h2>
                <p className="text-muted text-sm mb-5">Para conduzir jet ski é obrigatória a habilitação <strong className="text-primary">Motonauta (CHA-MTA)</strong>.</p>
                <div className="flex flex-col gap-2.5">
                  <button onClick={confirmHab} className={optionCls} data-autofocus>Sim, tenho</button>
                  <button onClick={denyHab} className={optionCls}>Não tenho habilitação</button>
                </div>
              </>
            )}

            {step === 'blocked' && (
              <>
                <ShieldAlert size={36} strokeWidth={1.5} className="text-primary mb-3" />
                <h2 id="wa-gate-title" className="font-display text-2xl font-bold text-primary mb-3">Locação apenas para habilitados</h2>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  Nossas locações são exclusivas para pessoas habilitadas como Motonauta (CHA-MTA) — é uma norma obrigatória da Marinha do Brasil, sem exceções.
                </p>
                <p className="text-muted text-sm leading-relaxed mb-5">
                  Tem interesse em se habilitar? Fale com a <strong className="text-primary">Escola Náutica Albor</strong>, nossa parceira em Laguna/SC: {ALBOR_INFO.phone}.
                </p>
                <div className="flex flex-col gap-2.5">
                  <a href={ALBOR_INFO.whatsapp} target="_blank" rel="noopener noreferrer" data-autofocus
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-navy font-bold hover:bg-muted transition-colors">
                    <GraduationCap size={20} /> Falar com a Albor no WhatsApp
                  </a>
                  <a href={ALBOR_INFO.site} target="_blank" rel="noopener noreferrer"
                    className="text-center text-muted text-sm underline underline-offset-2 hover:text-primary transition-colors py-1">
                    albornautica.com.br
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppGate;
