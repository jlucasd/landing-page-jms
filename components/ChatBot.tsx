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

const HAB_CTA: CTA = { label: '💬 Falar com a equipe JMS', href: WA_EQUIPE };
const ALBOR_CTA: CTA = { label: '🎓 Conhecer a Escola Albor', href: 'https://albornautica.com.br/' };

const GREETING =
`Olá! Prazer, me chamo Capitão JMS 🧑‍✈️ — sou o assistente virtual (chatbot) da JMS.
⚓ Falo apenas sobre o aluguel de Jet Ski da JMS (preços, reservas, habilitação, locais e detalhes da locação).
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
• Meia diária: R$ 750,00 (na alta temporada trabalhamos somente com a diária)
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
`Entendido! Por questões de segurança e exigência legal, só entregamos o Jet Ski para quem possui a habilitação náutica MOTONAUTA (CHA-MTA) — é a única que permite conduzir motos aquáticas. 🚔

É uma regra sem exceções: não realizamos a locação sem essa habilitação.

Mas posso te ajudar a resolver isso! 🎓 Trabalhamos em parceria com a Escola Náutica Albor, em Laguna/SC, que oferece o treinamento para você tirar a sua habilitação.
📞 Contato: (48) 98500-0926 — albornautica.com.br

Assim que estiver habilitado, será um prazer te atender! 🚤✨`;

const ARRAIS_INFO =
`Atenção: a habilitação Arrais Amador vale para lanchas e outras embarcações, mas NÃO inclui motos aquáticas (jet ski). ⚠️

Para alugar o nosso Jet Ski é obrigatória a habilitação MOTONAUTA (CHA-MTA) — sem exceções.

A boa notícia: nossa parceira Escola Náutica Albor, em Laguna/SC, oferece o treinamento para você tirar a Motonauta! 🎓
📞 Contato: (48) 98500-0926 — albornautica.com.br`;

const CONFIRM_HAB =
`Só para confirmar: você possui a habilitação náutica MOTONAUTA (CHA-MTA)? ⚓
Atenção: para motos aquáticas (jet ski) somente a Motonauta vale — o Arrais Amador não habilita. 😊`;

const FORA_ESCOPO =
`Desculpe, eu falo apenas sobre o aluguel de Jet Ski da JMS! 🚤
Não consigo ajudar com outros assuntos — só com o que combinamos por aqui: preços, reservas, habilitação, locais, combustível, pagamento e detalhes da locação.
Para outros temas, fale diretamente com nossa equipe. Como posso te ajudar com a locação? 🌊`;

// remove HTML e normaliza (sem acentos) para casar palavras-chave
const normalize = (raw: string) =>
  raw.replace(/<[^>]*>/g, '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/*
 * Base de conhecimento (FAQ + conteúdo do site). Cada intenção tem palavras-chave
 * e a resposta. A primeira intenção cujas keywords aparecerem na mensagem responde.
 */
const INTENTS: { keys: string[]; answer: string; cta?: CTA }[] = [
  { keys: ['preco', 'preço', 'valor', 'custo', 'quanto', 'diaria', 'tabela', 'orcamento'],
    answer: 'Nossa diária é de 8h de uso por R$ 800,00 e a meia diária sai por R$ 750,00 (na alta temporada trabalhamos somente com a diária). ⛽ O combustível fica por conta do locatário (sai com tanque cheio e devolve abastecido). Em Laguna, a descida/subida pela equipe JMS tem taxa de R$ 100,00.\n\nQuer garantir sua data? É só chamar a equipe. 👇', cta: HAB_CTA },
  { keys: ['pagamento', 'pagar', 'pix', 'transferencia', 'sinal', 'entrada', 'forma de pag', 'cartao', 'dinheiro', 'parcel'],
    answer: 'O pagamento é 50% na reserva + 50% no embarque. 💳 Aceitamos dinheiro, transferência bancária ou PIX: jmsjetski@gmail.com' },
  { keys: ['caucao', 'cauçao', 'garantia', 'deposito', 'calcao'],
    answer: 'No momento da locação é exigido um caução (via PIX ou transferência bancária), além do contrato e da habilitação náutica. 🔒' },
  // Problema/defeito no equipamento — contatar imediatamente o responsável
  { keys: ['estrag', 'quebr', 'defeito', 'problema', 'pane', 'parou de funcionar', 'nao liga', 'nao funciona', 'nao pega', 'deu ruim', 'emergencia', 'socorro', 'avaria', 'dano', 'bati'],
    answer: 'Se o equipamento apresentar qualquer tipo de problema durante a locação: pare em um local seguro, não tente reparos por conta própria e entre em contato IMEDIATAMENTE com o responsável pelo seu atendimento — o mesmo número da pessoa com quem você fechou a locação. 🛟 Nossa equipe vai te orientar na hora sobre o que fazer.' },
  // Atraso na devolução / devolução antecipada — antes da intent de reserva ("horario")
  { keys: ['atras', 'multa', 'passar do horario', 'passar o horario', 'devolv', 'ressarci', 'entregar antes', 'antes do horario', 'estourar o horario'],
    answer: 'Fique de olho no horário combinado: ⏰ se passar do horário da entrega, é cobrada uma multa; e se devolver antes do horário, não há ressarcimento proporcional do valor. Qualquer imprevisto, avise a equipe com antecedência!' },
  { keys: ['reserva', 'reservar', 'agendar', 'agenda', 'disponibilidade', 'horario', 'data', 'marcar'],
    answer: 'Para reservar é só falar com a nossa equipe no (48) 98500-0926. 📅 Os horários ficam sujeitos à disponibilidade do equipamento. Lembrando: a reserva é confirmada com 50% do valor (PIX/transferência) e exige habilitação náutica.', cta: HAB_CTA },
  { keys: ['combustivel', 'gasolina', 'tanque', 'abastec'],
    answer: '⛽ O Jet Ski sai com o tanque cheio e deve ser devolvido abastecido — o combustível fica por conta do locatário. Você tem duas opções:\n\n1️⃣ Fazer o abastecimento por conta própria; ou\n2️⃣ Nossa equipe abastece por você: enviamos o vídeo da bomba de abastecimento e a foto da nota fiscal, e aí é só fazer o PIX do valor total abastecido. 👌' },
  { keys: ['retir', 'retirada', 'pegar o jet', 'buscar o jet', 'pego o jet', 'onde pego', 'onde fica', 'iate', 'embarque'],
    answer: 'A retirada é feita próximo ao Iate Club em Laguna/SC, ou em local combinado no momento da locação. 📍' },
  { keys: ['familia', 'esposa', 'marido', 'filho', 'amigo', 'amiga', 'passageiro', 'outra pessoa', 'deixar alguem', 'quem pode pilotar', 'quem pode conduzir', 'conduzir', 'pilotar', 'emprestar'],
    answer: 'Somente condutores habilitados e inscritos no contrato de locação podem conduzir a embarcação. As demais pessoas podem ir como passageiras. 👨‍👩‍👧' },
  // Descida/subida na água — antes de "transporte" e "equipe" (ex.: "descida pela equipe")
  { keys: ['descida', 'subida', 'descer o jet', 'colocar na agua', 'colocar o jet', 'tirar da agua', 'lancamento', 'rampa', 'engate', 'reboque', 'nao tenho como levar'],
    answer: 'Sobre a descida/subida do Jet Ski na água: você mesmo pode fazer (por conta do locatário) ou a nossa equipe faz por você em Laguna, pela taxa de R$ 100,00 — ideal para quem não tem engate de reboque no carro. 🚤 A equipe coloca o jet na água na saída e retira na devolução, facilitando toda a experiência.' },
  { keys: ['outra cidade', 'outro local', 'levar', 'transporte', 'carreta', 'carretinha', 'rodoviario', 'viajar com'],
    answer: 'Sim! Disponibilizamos a carreta para transporte rodoviário, permitindo levar o Jet Ski para outros locais — mediante alinhamento prévio e ciência das cláusulas do contrato. 🚙' },
  // Crianças — garupa somente com mais de 7 anos
  { keys: ['crianca', 'crianças', 'filho pequeno', 'filha pequena', 'idade minima', 'quantos anos', 'menor de idade', 'bebe'],
    answer: 'Crianças podem ir apenas como garupa (passageiras) e somente com mais de 7 anos, sempre de colete salva-vidas. 👶🦺 Elas nunca podem conduzir nem ficar à frente do piloto/próximas aos comandos.' },
  // Abordagem da Marinha — o que fazer e documentos a bordo
  { keys: ['abordagem', 'abordado', 'abordar', 'marinha', 'fiscalizacao', 'fiscalizado', 'documentos a bordo', 'quais documentos', 'documento do jet'],
    answer: 'Se houver abordagem da Marinha durante a navegação: mantenha a calma, reduza e pare quando solicitado, e siga as orientações dos militares — todos a bordo devem estar de colete salva-vidas. 👮‍♂️⚓\n\nDocumentos que devem estar a bordo (entregamos junto na locação):\n• Sua habilitação náutica Motonauta (CHA)\n• Documento de identificação com foto\n• Documento de inscrição da embarcação (TIE)\n• Seguro obrigatório da embarcação (DPEM)\n• Contrato de locação\n\nCom tudo em dia, a abordagem é rápida e tranquila!' },
  { keys: ['tolerancia', 'alcool', 'bebida', 'bebid', 'distancia', 'da costa', 'regra', 'proibid', 'apreens', 'permitido'],
    answer: 'Tolerância ZERO: proibido conduzir sem habilitação; nada de álcool (exigência da Marinha); crianças somente como garupa e com mais de 7 anos; mantenha o jet a pelo menos 50m da costa e respeite as áreas de navegação. O descumprimento pode levar à apreensão da embarcação. ⚠️' },
  { keys: ['albor', 'escola', 'curso', 'tirar habilit', 'como tirar', 'onde tiro', 'como conseguir habilit', 'fazer habilit', 'tirar a carteira', 'tirar carteira'],
    answer: 'Trabalhamos em parceria com a Escola Náutica Albor, em Laguna/SC, que oferece o treinamento para você tirar a sua habilitação náutica. 🎓 Contato: (48) 98500-0926 ou albornautica.com.br', cta: ALBOR_CTA },
  { keys: ['habilita', 'habilitac', 'motonauta', 'arrais', 'cnh nautica', 'carteira', 'licenca', 'documenta'],
    answer: 'É obrigatório possuir a habilitação náutica MOTONAUTA (CHA-MTA) — a única que permite conduzir motos aquáticas. ⚠️ Atenção: o Arrais Amador vale para lanchas e outras embarcações, mas NÃO inclui jet ski. 📝 Se você ainda não tem a Motonauta, indicamos a Escola Náutica Albor (nossa parceira) para tirar a sua.', cta: ALBOR_CTA },
  { keys: ['local', 'laguna', 'ararangua', 'rincao', 'regiao', 'navega', 'lugar', 'passeio', 'roteiro'],
    answer: 'Operamos em Laguna/SC e região, incluindo Araranguá e Balneário Rincão. 🌊 Em Laguna há taxa de R$ 100,00 para descida/subida pela equipe JMS. Não conhece o local? É só pedir orientação!' },
  { keys: ['modelo', 'jet ski', 'jetski', 'yamaha', 'lugares', 'capacidade', 'pessoas', 'potencia', '110', 'hp', 'cv', 'cabe'],
    answer: '🚤 Trabalhamos com o YAMAHA 110HP, com capacidade para até 3 lugares.' },
  { keys: ['contrato', 'vistoria', 'seguro', 'clausula', 'o que assino', 'termo'],
    answer: 'Fazemos contrato de locação e vistoria do equipamento antes e depois da locação, para a segurança de todos. 📝 Para ter acesso ao contrato e conhecer os detalhes, fale com um dos responsáveis pelo atendimento — ele vai te explicar ponto a ponto como tudo funciona. 👇', cta: HAB_CTA },
  { keys: ['instagram', 'rede social', 'redes', 'foto', 'galeria', 'video', 'imagens'],
    answer: 'Confira nossas fotos na galeria aqui do site e no Instagram @jmsalugueldejetski! 📸' },
  { keys: ['depoiment', 'avaliac', 'opiniao', 'recomend', 'reputac', 'comentario'],
    answer: 'Temos ótimas avaliações de clientes na seção “O que dizem sobre nós?” aqui do site. ⭐ Dá uma conferida!' },
  { keys: ['equipe', 'quem sao', 'quem e a', 'socio', 'dono', 'fundador', 'time', 'historia', 'sobre a jms', 'sobre voces'],
    answer: 'A JMS foi fundada em 2022 por três amigos — João, Mayck e Stivison — apaixonados pelo mar. Conheça a equipe na seção “Sobre nós”! ⚓' },
  { keys: ['contato', 'telefone', 'whatsapp', 'numero', 'email', 'e-mail', 'falar com', 'atendente', 'atendimento'],
    answer: 'Fale com a nossa equipe no WhatsApp (48) 98500-0926 ou pelo e-mail jmsjetski@gmail.com. 📞', cta: HAB_CTA },
  { keys: ['obrigad', 'valeu', 'agradec', 'show', 'perfeito', 'otimo', 'beleza'],
    answer: 'Por nada! Qualquer dúvida sobre a locação, é só chamar. Bons ventos e boas ondas! 🌊🚤' },
  { keys: ['oi', 'ola', 'hello', 'bom dia', 'boa tarde', 'boa noite', 'eai', 'e ai'],
    answer: 'Olá! 🧑‍✈️ Sou o Capitão JMS. Posso te ajudar com preços, reservas, habilitação, locais e detalhes da locação. Você já possui a habilitação náutica Motonauta?' },
];

/** Classifica a mensagem do usuário e devolve a resposta do bot. */
function getResponse(raw: string, phase: string): { text: string; cta?: CTA; phase: string } {
  const t = normalize(raw).trim();
  const words = t.split(/\s+/).filter(Boolean);
  const short = words.length <= 4; // resposta curta (típica de "sim"/"não")
  const has = (...ws: string[]) => ws.some((w) => t.includes(w));
  const re = (rx: RegExp) => rx.test(t);

  // É uma PERGUNTA (e não uma afirmação)?
  const asking = re(/\b(precis|preciso|necessit|obrigat|exige|qual|quais|quanto|como|onde|posso|pode|quero saber|tem que|e necessario)\b/);

  // Dúvida/incerteza sobre a habilitação → reconfirma
  if (re(/\b(talvez|nao sei|nao tenho certeza|acho que|nao entendi|como assim|qual habilit|que habilit)\b/) && !has('preco', 'valor', 'reserv'))
    return { text: CONFIRM_HAB, phase: 'await_hab' };

  // NÃO possui habilitação — frase explícita OU resposta curta negativa (qualquer fase)
  const saysNo =
    re(/(sem habilit|nao tenho habilit|nao possuo habilit|nao sou habilit|nao sou motonauta|nao tenho carteira|nao tenho a habilit|nao tirei|nao tenho)/) ||
    (short && re(/^(nao|n|nops?|nope|nunca|negativo|ainda nao|infelizmente nao|nao senhor)\b/));
  if (saysNo) return { text: SEM_HABILITACAO, cta: ALBOR_CTA, phase: 'done' };

  // Diz que tem ARRAIS (sem citar Motonauta) → Arrais NÃO habilita para moto aquática
  if (!asking && re(/\barrais\b/) && !re(/motonauta/))
    return { text: ARRAIS_INFO, cta: ALBOR_CTA, phase: 'await_hab' };

  // POSSUI habilitação (Motonauta) — frase explícita OU resposta curta afirmativa (quando não é pergunta)
  const saysYes =
    (!asking && re(/(tenho|possuo|sou|ja sou|ja tenho).{0,20}(habilit|motonauta)/)) ||
    re(/\b(sou|tenho|possuo)\b.*\bmotonauta\b/) ||
    (short && !asking && re(/^(sim|s|claro|isso|exato|positivo|com certeza|tenho|possuo|afirmativo|ja sou|ja tenho|sou habilit)\b/));
  if (saysYes) return { text: HABILITADO, cta: HAB_CTA, phase: 'done' };

  // Base de conhecimento (FAQ + site)
  for (const it of INTENTS) {
    if (has(...it.keys)) return { text: it.answer, cta: it.cta, phase };
  }

  // Ainda aguardando a resposta de habilitação → reconfirma educadamente
  if (phase === 'await_hab') return { text: CONFIRM_HAB, phase: 'await_hab' };

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
                          className={`inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:brightness-110 transition ${m.cta.href.includes('wa.me') ? 'bg-[#25D366]' : 'bg-[#0a1a2e]'}`}>
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
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4" aria-label="online">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-70 animate-ping" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500 border-2 border-[#0a1a2e]" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
