import { Anchor, Wallet, ShieldCheck, Star } from 'lucide-react';
import {
  NavItem, Diferencial, JetskiFrame,
  LocalNavegacao, FaqItem, Testimonial, TeamMember, InstagramPost,
} from './types';

// Imagens reais da JMS (baixadas de jmsjetski.com.br e otimizadas para WebP).
import jet01 from './img/jet-01.webp';
import jet02 from './img/jet-02.webp';
import jet04 from './img/jet-04.webp';
import jet05 from './img/jet-05.webp';
import jet06 from './img/jet-06.webp';
import jet07 from './img/jet-07.webp';
import heroPoster from './img/hero-poster.webp';
// Fotos das cidades (locais para navegação)
import cidadeLaguna from './img/locais/laguna.webp';
import cidadeRincao from './img/locais/balneario-rincao.webp';
import cidadeArarangua from './img/locais/ararangua.webp';

// Hero: mesmo vídeo do site oficial, agora hospedado localmente (public/hero.mp4)
// + poster local de fallback.
export const HERO_VIDEO = '/hero.mp4';
export const HERO_POSTER = heroPoster;

// Galeria: todas as fotos reais de jmsjetski.com.br/galeria (import automático em ordem).
const galeriaModules = import.meta.glob('./img/galeria/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
export const GALLERY_IMAGES: string[] = Object.keys(galeriaModules).sort().map((k) => galeriaModules[k]);

export const CONTACT_INFO = {
  name: 'JMS Jetski',
  tagline: 'Quer se divertir? Reserve agora!',
  address: 'Rua Toledo Pizza, 897 - Navegantes, Laguna - SC, 88790-000',
  phone: '(48) 99634-4407',
  phoneSecondary: '(48) 98500-0926',
  whatsapp: 'https://wa.me/5548996344407',
  whatsappNumber: '5548996344407',
  instagram: 'https://www.instagram.com/jmsalugueldejetski/',
  instagramHandle: '@jmsalugueldejetski',
  facebook: 'https://www.facebook.com/profile.php?id=61555002672332',
  googleReviews: 'https://www.jmsjetski.com.br/',
  maps: 'https://maps.app.goo.gl/2xwj3ciJ4yiMcZ7NA',
};

// Link de reserva direto no WhatsApp (mesmo do botão flutuante)
export const WHATSAPP_RESERVE = `${CONTACT_INFO.whatsapp}?text=${encodeURIComponent('Olá! Quero reservar um jetski com a JMS.')}`;

export const NAV_ITEMS: NavItem[] = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Jetskis', href: '#jetskis' },
  { label: 'Locais', href: '#locais' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'FAQ', href: '#faq' },
];

export const DIFERENCIAIS: Diferencial[] = [
  { title: 'Comodidade', description: 'Reserva rápida pelo WhatsApp e operação pensada para o seu conforto.', icon: Anchor },
  { title: 'Preço acessível', description: 'Diversão na água com valores justos para toda a família e grupos.', icon: Wallet },
  { title: 'Segurança', description: 'Coletes, âncora, cabos e equipamentos de segurança inclusos.', icon: ShieldCheck },
  { title: 'Qualidade', description: 'Frota revisada e em ótimo estado para o máximo desempenho.', icon: Star },
];

// Frames do track horizontal (modelos + quotes intercaladas)
export const JETSKI_FRAMES: JetskiFrame[] = [
  { type: 'model', name: 'Yamaha 1100', spec: '110 cv · 4 tempos', image: jet04, alt: 'Jetski Yamaha da JMS pronto para locação' },
  { type: 'quote', quote: 'Adrenalina e liberdade em cada acelerada.', highlight: 'liberdade' },
  { type: 'model', name: 'Marcha à ré', spec: 'Manobras fáceis e seguras', image: jet05, alt: 'Jetski da JMS com a identidade na plataforma' },
  { type: 'model', name: 'Solo, casal ou grupo', spec: 'Condutores habilitados', image: jet07, alt: 'Piloto em jetski da JMS nas águas de Laguna' },
  { type: 'quote', quote: 'Segurança e diversão para toda a família.', highlight: 'diversão' },
  { type: 'model', name: 'Equipamento de qualidade', spec: 'Frota revisada', image: jet06, alt: 'Piloto com colete de segurança no jetski da JMS' },
];

export const LOCAIS: LocalNavegacao[] = [
  { name: 'Laguna / SC', description: 'Saída próxima ao Iate Club, com a icônica orla lagunense e a ponte Anita Garibaldi.', image: cidadeLaguna, alt: 'Vista aérea da orla histórica de Laguna - SC', mapUrl: 'https://maps.app.goo.gl/hnDt5XgAJQSMw5LXA' },
  { name: 'Araranguá / SC', description: 'Rios e praias do litoral sul para um passeio diferente e tranquilo.', image: cidadeArarangua, alt: 'Vista aérea da cidade de Araranguá - SC e seu rio', mapUrl: 'https://maps.app.goo.gl/w4Hdcj75YPitTSDY8' },
  { name: 'Balneário Rincão / SC', description: 'Praia ampla e ótimas condições para acelerar com segurança.', image: cidadeRincao, alt: 'Vista aérea da lagoa e praia de Balneário Rincão - SC', mapUrl: 'https://maps.app.goo.gl/4ghZPiiMNrK4iHUN6' },
];

export const FAQ_ITEMS: FaqItem[] = [
  { question: 'Onde retiro o Jet Ski?', answer: 'Próximo ao Iate Club em Laguna/SC ou em local combinado no momento da locação.' },
  { question: 'O que é necessário para alugar um jet?', answer: 'O processo é idêntico ao de um veículo: o locatário precisa ser habilitado como Motonauta (CHA-MTA), fazer o caução exigido via PIX ou transferência bancária e estar ciente das cláusulas do contrato de locação.' },
  { question: 'Não tenho habilitação, mas quero alugar, o que faço?', answer: 'Trabalhamos em parceria com a escola Albor, em Laguna/SC, que oferece o treinamento para obtenção da habilitação. Contato: (48) 98500-0926 ou albornautica.com.br.' },
  { question: 'Como funciona o pagamento do aluguel?', answer: '50% no momento da reserva (para garantir a data) e 50% no embarque. Aceitamos dinheiro, PIX e transferência bancária.' },
  { question: 'Posso deixar minha família andar?', answer: 'Somente condutores habilitados e inscritos no contrato de locação podem conduzir a embarcação.' },
  { question: 'Posso levar o Jet Ski para outra cidade?', answer: 'Sim, mediante alinhamento prévio no momento da locação e ciência das cláusulas do contrato.' },
  { question: 'Como funciona o abastecimento?', answer: 'A entrega é feita com o tanque cheio. No retorno, calculamos o combustível consumido, que é pago pelo locatário.' },
  { question: 'Tolerância ZERO!', answer: 'Proibido conduzir sem habilitação; tolerância zero a álcool (exigência da Marinha); crianças não podem ficar próximas ao piloto; mantenha o jet a 50m da costa. O descumprimento pode resultar na apreensão da embarcação.' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Anderson San',
    text: 'Muito top, fiz cotação p 2 dias (sábado e domingo), porém o jet estava liberado na sexta e entreguei na segunda, foi show, Jet confortável e a experiência melhor ainda. Vale muito a pena. Sem falar no atendimento. Super recomendo. Contando os dias p próxima locação.',
  },
  {
    name: 'Alan Alves Pereira',
    text: 'Foi muito serviço bem prestado com muita qualidade, parabéns a equipe.',
  },
  {
    name: 'Kleber Rochadel',
    text: 'Meu sincero agradecimento pelo excelente serviço prestado. Fiquei muito impressionado com o profissionalismo, pontualidade e atenção de toda a equipe. Esses aspectos fizeram toda a diferença na minha experiência e garantiram momentos de lazer realmente agradáveis. Continuem com esse trabalho excepcional. Com certeza, recomendarei os serviços de vocês a amigos e familiares.',
  },
];

export const TEAM: TeamMember[] = [
  { initial: 'J', name: 'João Damiani', role: 'CEO', photo: jet06, focus: '50% 22%', bio: 'Formado em TI, descobriu a paixão pelas atividades náuticas e adora compartilhar conhecimento sobre o mar.' },
  { initial: 'M', name: 'Mayck Manoel', role: 'CEO', photo: jet01, focus: '62% 42%', bio: 'Ex-Marinha e fundador da Escola Náutica Albor, com foco em segurança marítima e respeito ao oceano.' },
  { initial: 'S', name: 'Stivison Gomes', role: 'CEO', photo: jet07, focus: '50% 28%', bio: 'Entusiasta do mar, apaixonado por aventuras subaquáticas e mergulho.' },
];

// Posts REAIS do Instagram @jmsalugueldejetski (miniaturas baixadas + permalink do post).
const instaModules = import.meta.glob('./img/insta/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const instaImages = Object.keys(instaModules).sort().map((k) => instaModules[k]);
const instaMeta = [
  { permalink: 'https://www.instagram.com/p/DXdMfXhDVFh/', caption: 'O final de semana perfeito começa a bordo de um Jet Ski! 🌊☀️' },
  { permalink: 'https://www.instagram.com/p/DR42E9FDfh_/', caption: 'A temporada de verão da JMS está oficialmente aberta! 🚤' },
  { permalink: 'https://www.instagram.com/p/DHd2f7nRVnK/', caption: 'Venha viver essa experiência conosco! ⚓️🌊' },
  { permalink: 'https://www.instagram.com/p/DEBQlNMRSyK/', caption: 'Ação cheia de carinho e solidariedade com a Albor Náutica.' },
  { permalink: 'https://www.instagram.com/p/DD2U5PURMpZ/', caption: 'Jet pronto e personalizado para a temporada! 🛥️' },
  { permalink: 'https://www.instagram.com/p/C80IGVIJiZv/', caption: 'Curso de operador de embarcações de resgate! 🛟⚓️' },
];
export const INSTAGRAM_POSTS: InstagramPost[] = instaImages.map((image, i) => ({
  image,
  permalink: instaMeta[i]?.permalink ?? CONTACT_INFO.instagram,
  caption: instaMeta[i]?.caption ?? 'Post da JMS Jetski',
}));
