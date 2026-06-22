import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import logoIcon from '../img/logo-icon.webp';

/*
 * Capitão JMS — chatbot autônomo (sem back-end), respostas baseadas no
 * conteúdo da landing page. Fica logo acima do botão de WhatsApp.
 * Máquina de estados simples por palavras-chave + persistência em sessionStorage.
 */

const WA_EQUIPE = 'https://wa.me/5548985000926';
const STORE_KEY = 'capitao-jms-chat';

interface CTA { label: string; href: string; }
interface Msg { role: 'bot' | 'user'; text: string; cta?: CTA; }

const GREETING =
`Olá! Prazer, me chamo Capitão JMS 🧑‍✈️ — sou o assistente virtual (chatbot) da JMS.
Obrigado por entrar em contato!

Para te atender da melhor forma, poderia me informar:
1️⃣ Você já possui habilitação náutica Motonauta?
2️⃣ Em qual região você deseja realizar a locação do Jet Ski?

Assim que me passar essas informações, já te envio todos os detalhes. Fico à disposição! 🚤✨`;

const HABILITADO =
`Ótimo! Aqui estão todas as informações da locação:

🚤 YAMAHA 110HP — 3 LUGARES

📋 Como funciona:
• ⛽ Combustível por conta do locatário — sai com tanque cheio e devolve abastecido!
• 📝 Obrigatório ser habilitado como MOTONAUTA
• Contrato de locação e vistoria realizado antes e depois

💰 Investimento:
• Diária — 8h de uso: R$ 800,00
• Descida por conta do locatário
• Descida/subida pela equipe JMS em Laguna: taxa de R$ 100,00

💳 Pagamento:
• 50% na reserva + 50% no embarque
• Dinheiro, transferência bancária ou PIX: jmsjetski@gmail.com

📅 Reservas: (48) 98500-0926

Os horários podem ser alterados conforme disponibilidade do equipamento.
Caso não conheça o local de navegação, solicite informações! 🌊

Posso te transferir agora para nossa equipe no WhatsApp para confirmar sua reserva! 👇`;

const SEM_HABILITACAO =
`Entendido! Infelizmente, por questões de segurança e exigência legal, só podemos entregar o Jet Ski para pessoas que possuam habilitação náutica — Motonauta ou Arrais Amador. 🚔

Não é possível realizar a locação sem uma dessas habilitações — é uma regra sem exceções.

Se um dia você tirar a sua habilitação náutica, ficaremos felizes em te atender! 🚤✨

Posso ajudar com mais alguma coisa?`;

const CONFIRM_HAB =
`Só para confirmar: você possui habilitação náutica Motonauta ou Arrais Amador? Ambas habilitam para a locação! 😊`;

const FORA_ESCOPO =
`Desculpe, sou especialista apenas em locação de Jet Ski da JMS! 🚤
Para outros assuntos, entre em contato diretamente com nossa equipe.
Posso te ajudar com informações sobre preços, reservas, habilitação ou detalhes da locação?`;

// remove HTML e normaliza (sem acentos) para casar palavras-chave
const normalize = (raw: string) =>
  raw.replace(/<[^>]*>/g, '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/*
 * Base de conhecimento (FAQ + conteúdo do site). Cada intenção tem palavras-chave
 * e a resposta. A primeira intenção cujas keywords aparecerem na mensagem responde.
 */
const INTENTS: { keys: string[]; answer: string }[] = [
  { keys: ['preco', 'preço', 'valor', 'custo', 'quanto', 'diaria', 'tabela', 'orcamento'],
    answer: 'Nossa diária é de 8h de uso por R$ 800,00. ⛽ O combustível fica por conta do locatário (sai com tanque cheio e devolve abastecido). Em Laguna, a descida/subida pela equipe JMS tem taxa de R$ 100,00.' },
  { keys: ['pagamento', 'pagar', 'pix', 'transferencia', 'sinal', 'entrada', 'forma de pag', 'cartao', 'dinheiro', 'parcel'],
    answer: 'O pagamento é 50% na reserva + 50% no embarque. 💳 Aceitamos dinheiro, transferência bancária ou PIX: jmsjetski@gmail.com' },
  { keys: ['caucao', 'cauçao', 'garantia', 'deposito', 'calcao'],
    answer: 'No momento da locação é exigido um caução (via PIX ou transferência bancária), além do contrato e da habilitação náutica. 🔒' },
  { keys: ['reserva', 'reservar', 'agendar', 'agenda', 'disponibilidade', 'horario', 'data', 'marcar'],
    answer: 'Para reservar é só chamar no (48) 98500-0926. 📅 Os horários ficam sujeitos à disponibilidade do equipamento.' },
  { keys: ['combustivel', 'gasolina', 'tanque', 'abastec'],
    answer: '⛽ O Jet Ski sai com o tanque cheio e deve ser devolvido abastecido. No retorno, calculamos o combustível consumido, que é pago pelo locatário.' },
  { keys: ['retir', 'retirada', 'pegar o jet', 'buscar o jet', 'pego o jet', 'onde pego', 'onde fica', 'iate', 'embarque'],
    answer: 'A retirada é feita próximo ao Iate Club em Laguna/SC, ou em local combinado no momento da locação. 📍' },
  { keys: ['familia', 'esposa', 'marido', 'filho', 'amigo', 'amiga', 'passageiro', 'outra pessoa', 'deixar alguem', 'quem pode pilotar', 'quem pode conduzir', 'conduzir', 'pilotar', 'emprestar'],
    answer: 'Somente condutores habilitados e inscritos no contrato de locação podem conduzir a embarcação. As demais pessoas podem ir como passageiras. 👨‍👩‍👧' },
  { keys: ['outra cidade', 'outro local', 'levar', 'transporte', 'carreta', 'carretinha', 'rodoviario', 'viajar com', 'reboque'],
    answer: 'Sim! Disponibilizamos a carreta para transporte rodoviário, permitindo levar o Jet Ski para outros locais — mediante alinhamento prévio e ciência das cláusulas do contrato. 🚙' },
  { keys: ['tolerancia', 'alcool', 'bebida', 'bebid', 'crianca', 'distancia', 'da costa', 'marinha', 'regra', 'proibid', 'multa', 'apreens', 'permitido'],
    answer: 'Tolerância ZERO: proibido conduzir sem habilitação; nada de álcool (exigência da Marinha); crianças não podem ficar próximas ao piloto; mantenha o jet a 50m da costa. O descumprimento pode levar à apreensão da embarcação. ⚠️' },
  { keys: ['albor', 'escola', 'curso', 'tirar habilit', 'como tirar', 'onde tiro', 'como conseguir habilit', 'fazer habilit'],
    answer: 'Trabalhamos em parceria com a Escola Náutica Albor, em Laguna/SC, que oferece o treinamento para a habilitação. Contato: (48) 98500-0926 ou albornautica.com.br 🎓' },
  { keys: ['habilita', 'habilitac', 'motonauta', 'arrais', 'cnh nautica', 'carteira', 'licenca', 'documenta'],
    answer: 'É obrigatório possuir habilitação náutica Motonauta OU Arrais Amador para alugar. Nenhuma embarcação é entregue sem uma dessas habilitações. 📝' },
  { keys: ['local', 'laguna', 'ararangua', 'rincao', 'regiao', 'navega', 'lugar', 'passeio', 'roteiro'],
    answer: 'Operamos em Laguna/SC e região, incluindo Araranguá e Balneário Rincão. 🌊 Em Laguna há taxa de R$ 100,00 para descida/subida pela equipe JMS. Não conhece o local? É só pedir orientação!' },
  { keys: ['modelo', 'jet ski', 'jetski', 'yamaha', 'lugares', 'capacidade', 'pessoas', 'potencia', '110', 'hp', 'cv', 'cabe'],
    answer: '🚤 Trabalhamos com o YAMAHA 110HP, com capacidade para até 3 lugares.' },
  { keys: ['contrato', 'vistoria', 'seguro', 'dano', 'avaria', 'bati', 'estragar'],
    answer: 'Fazemos contrato de locação e vistoria do equipamento antes e depois da locação, para a segurança de todos. 📝' },
  { keys: ['instagram', 'rede social', 'redes', 'foto', 'galeria', 'video', 'imagens'],
    answer: 'Confira nossas fotos na galeria aqui do site e no Instagram @jmsalugueldejetski! 📸' },
  { keys: ['depoiment', 'avaliac', 'opiniao', 'recomend', 'reputac', 'comentario'],
    answer: 'Temos ótimas avaliações de clientes na seção “O que dizem sobre nós?” aqui do site. ⭐ Dá uma conferida!' },
  { keys: ['equipe', 'quem sao', 'quem e a', 'socio', 'dono', 'fundador', 'time', 'historia', 'sobre a jms', 'sobre voces'],
    answer: 'A JMS foi fundada em 2022 por três amigos — João, Mayck e Stivison — apaixonados pelo mar. Conheça a equipe na seção “Sobre nós”! ⚓' },
  { keys: ['contato', 'telefone', 'whatsapp', 'numero', 'email', 'e-mail', 'falar com', 'atendente', 'atendimento'],
    answer: 'Fale com a nossa equipe no WhatsApp (48) 98500-0926 ou pelo e-mail jmsjetski@gmail.com. 📞' },
  { keys: ['obrigad', 'valeu', 'agradec', 'show', 'perfeito', 'otimo', 'beleza'],
    answer: 'Por nada! Qualquer dúvida sobre a locação, é só chamar. Bons ventos e boas ondas! 🌊🚤' },
  { keys: ['oi', 'ola', 'hello', 'bom dia', 'boa tarde', 'boa noite', 'eai', 'e ai'],
    answer: 'Olá! 🧑‍✈️ Sou o Capitão JMS. Posso te ajudar com preços, reservas, habilitação, locais e detalhes da locação. Você já possui habilitação náutica (Motonauta ou Arrais Amador)?' },
];

/** Classifica a mensagem do usuário e devolve a resposta do bot. */
function getResponse(raw: string, phase: string): { text: string; cta?: CTA; phase: string } {
  const t = normalize(raw);
  const has = (...ws: string[]) => ws.some((w) => t.includes(w));
  const re = (rx: RegExp) => rx.test(t);
  const habCta: CTA = { label: '💬 Falar com a equipe JMS', href: WA_EQUIPE };

  // É uma PERGUNTA sobre habilitação (e não uma afirmação de que possui)?
  const asking = re(/\b(precis|preciso|necessit|obrigat|exige|qual|quais|quanto|como|onde|posso|pode|tem que|e necessario)\b/);

  // Afirmação/negação explícita de habilitação (quando NÃO é pergunta)
  if (!asking) {
    if (re(/(sem habilit|nao tenho habilit|nao possuo|nao sou habilit|nao sou motonauta|nao tenho carteira|nao tenho a habilit|nao tirei)/))
      return { text: SEM_HABILITACAO, phase: 'done' };
    if (re(/(tenho|possuo|sou|ja sou|ja tenho).{0,20}(habilit|motonauta|arrais)/) || has('sou motonauta', 'sou arrais', 'ja sou habilitad'))
      return { text: HABILITADO, cta: habCta, phase: 'done' };
  }

  // Base de conhecimento (FAQ + site)
  for (const it of INTENTS) {
    if (has(...it.keys)) return { text: it.answer, phase };
  }

  // Ainda aguardando a resposta de habilitação → trata sim/não ou confirma
  if (phase === 'await_hab') {
    if (!asking && has('sim', 'tenho', 'possuo', 'claro', 'ja sou', 'ja tenho', 'afirmativo'))
      return { text: HABILITADO, cta: habCta, phase: 'done' };
    if (!asking && has('nao', 'nada', 'ainda nao', 'negativo'))
      return { text: SEM_HABILITACAO, phase: 'done' };
    return { text: CONFIRM_HAB, phase: 'await_hab' };
  }

  // Fora do escopo
  return { text: FORA_ESCOPO, phase };
}

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<string>('idle');
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  // Esconde a etiqueta "Fale com o Capitão" após alguns segundos
  useEffect(() => {
    const t = setTimeout(() => setShowLabel(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const greeted = useRef(false);

  // Carrega conversa da sessão
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setMessages(data.messages || []);
        setPhase(data.phase || 'idle');
        if ((data.messages || []).length) greeted.current = true;
      }
    } catch { /* ignore */ }
  }, []);

  // Persiste conversa
  useEffect(() => {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ messages, phase })); } catch { /* ignore */ }
  }, [messages, phase]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Foco no input ao abrir
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 350); }, [open]);

  const pushBot = useCallback((text: string, cta?: CTA) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: 'bot', text, cta }]);
    }, 800);
  }, []);

  // Saudação automática na primeira abertura da sessão
  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true;
      const t = setTimeout(() => { pushBot(GREETING); setPhase('await_hab'); }, 600);
      return () => clearTimeout(t);
    }
  }, [open, pushBot]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = input.replace(/<[^>]*>/g, '').trim();
    if (!clean) return;
    setMessages((m) => [...m, { role: 'user', text: clean }]);
    setInput('');
    const res = getResponse(clean, phase);
    setPhase(res.phase);
    pushBot(res.text, res.cta);
  };

  return (
    <div className="fixed right-5 sm:right-6 bottom-[5.25rem] z-[60] flex flex-col items-end gap-3">
      {/* Painel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-labelledby="capitao-jms-title" aria-modal="false"
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="w-[340px] max-w-[92vw] h-[480px] max-h-[70vh] sm:max-h-[480px] flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-[#F4F6F8]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#0a1a2e] to-[#1a3a5c] text-white">
              <span className="w-10 h-10 grid place-items-center rounded-full bg-white/10" aria-hidden="true">
                <img src={logoIcon} alt="" className="w-6 h-6 object-contain" />
              </span>
              <div className="flex-1 min-w-0">
                <p id="capitao-jms-title" className="font-bold leading-tight">Capitão JMS</p>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Assistente virtual • Chatbot
                </p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fechar chat"
                className="text-white/80 hover:text-white p-1 transition-colors">
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                m.role === 'bot' ? (
                  <div key={i} className="flex items-end gap-2">
                    <span className="w-7 h-7 grid place-items-center rounded-full bg-[#0a1a2e] text-sm shrink-0" aria-hidden="true">🧑‍✈️</span>
                    <div className="max-w-[80%]">
                      <div className="bg-[#E8F4FD] text-[#0A2342] text-sm leading-relaxed rounded-2xl rounded-bl-sm px-3.5 py-2.5 whitespace-pre-line">{m.text}</div>
                      {m.cta && (
                        <a href={m.cta.href} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:brightness-110 transition">
                          {m.cta.label}
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] bg-[#0a1a2e] text-white text-sm leading-relaxed rounded-2xl rounded-br-sm px-3.5 py-2.5 whitespace-pre-line">{m.text}</div>
                  </div>
                )
              ))}

              {/* digitando... */}
              {typing && (
                <div className="flex items-end gap-2">
                  <span className="w-7 h-7 grid place-items-center rounded-full bg-[#0a1a2e] text-sm shrink-0" aria-hidden="true">🧑‍✈️</span>
                  <div className="bg-[#E8F4FD] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1" aria-label="Capitão JMS está digitando">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A2342]/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A2342]/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A2342]/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-black/10 bg-white">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                aria-label="Escreva sua mensagem para o Capitão JMS"
                placeholder="Escreva sua mensagem..."
                className="flex-1 bg-[#F4F6F8] text-[#2C2C2C] text-sm rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1a3a5c]/40" />
              <button type="submit" aria-label="Enviar mensagem"
                className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-[#0a1a2e] text-white hover:bg-[#1a3a5c] transition-colors">
                <Send size={18} strokeWidth={1.8} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Etiqueta + botão de abrir/fechar */}
      <div className="flex items-center gap-2">
        {!open && showLabel && (
          <span className="hidden sm:flex items-center gap-1.5 bg-white text-[#0a1a2e] text-xs font-semibold px-3 py-2 rounded-full shadow-lg whitespace-nowrap">
            <span aria-hidden="true">💬</span> Fale com o Capitão <span className="text-muted font-normal">(chatbot)</span>
          </span>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          title="Capitão JMS — assistente virtual (chatbot)"
          aria-label={open ? 'Fechar chat do Capitão JMS (assistente virtual)' : 'Abrir chat do Capitão JMS (assistente virtual)'}
          aria-expanded={open}
          className="relative w-14 h-14 min-w-[52px] grid place-items-center rounded-full bg-[#0a1a2e] shadow-xl hover:bg-[#1a3a5c] transition-colors"
        >
          {open ? <X size={26} strokeWidth={1.8} className="text-white" /> : <img src={logoIcon} alt="" className="w-8 h-8 object-contain" />}
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70 animate-ping" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500 border-2 border-[#0a1a2e]" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
