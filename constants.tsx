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
// Fotos da página /jetski (frota)
import frotaSolo from './img/frota-solo.webp';
import frotaEquip from './img/frota-equip.webp';
// Fotos das cidades (locais para navegação)
import cidadeLaguna from './img/locais/laguna.webp';
import cidadeRincao from './img/locais/balneario-rincao.webp';
import cidadeArarangua from './img/locais/ararangua.webp';

// Hero: mesmo vídeo do site oficial, agora hospedado localmente (public/hero.mp4)
// + poster local de fallback.
export const HERO_VIDEO = '/hero.mp4';
export const HERO_POSTER = heroPoster;

// Galeria: todas as fotos reais de jmsjetski.com.br/galeria (import automático em ordem).
// Dimensões intrínsecas para reservar o espaço correto no track horizontal (lazy load + sem CLS).
const galeriaModules = import.meta.glob('./img/galeria/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const GALERIA_DIMS: Record<string, { w: number; h: number }> = {
  'g-01.webp': { w: 510, h: 510 }, 'g-02.webp': { w: 960, h: 1280 }, 'g-03.webp': { w: 960, h: 1280 },
  'g-04.webp': { w: 960, h: 1280 }, 'g-05.webp': { w: 960, h: 1280 }, 'g-06.webp': { w: 287, h: 510 },
  'g-07.webp': { w: 510, h: 510 }, 'g-08.webp': { w: 382, h: 510 }, 'g-09.webp': { w: 478, h: 510 },
  'g-10.webp': { w: 408, h: 510 }, 'g-11.webp': { w: 514, h: 510 }, 'g-12.webp': { w: 1024, h: 1280 },
  'g-13.webp': { w: 960, h: 1280 }, 'g-14.webp': { w: 960, h: 1280 }, 'g-15.webp': { w: 960, h: 1280 },
  'g-16.webp': { w: 680, h: 510 }, 'g-17.webp': { w: 960, h: 1280 }, 'g-18.webp': { w: 1024, h: 1280 },
  'g-19.webp': { w: 960, h: 1280 }, 'g-20.webp': { w: 960, h: 1280 },
};
export interface GalleryImage { src: string; w: number; h: number; }
export const GALLERY: GalleryImage[] = Object.keys(galeriaModules).sort().map((k) => {
  const name = k.split('/').pop() as string;
  const d = GALERIA_DIMS[name] ?? { w: 4, h: 3 };
  return { src: galeriaModules[k], w: d.w, h: d.h };
});
export const GALLERY_IMAGES: string[] = GALLERY.map((g) => g.src);

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

// Link único de reserva no WhatsApp (usado em todos os CTAs e no botão flutuante)
export const WHATSAPP_RESERVE = 'https://api.whatsapp.com/send?phone=5548996344407&text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20site%20e%20gostaria%20de%20alugar%20o%20Jet%20Ski%20para%20me%20divertir.';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Jetskis', href: '#jetskis' },
  { label: 'Locais', href: '#locais' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Localização', href: '#localizacao' },
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
  { type: 'model', name: 'Solo, casal ou grupo', spec: 'Condutores habilitados', image: frotaSolo, alt: 'Jetski Yamaha da JMS sobre a carretinha' },
  { type: 'quote', quote: 'Segurança e diversão para toda a família.', highlight: 'diversão' },
  { type: 'model', name: 'Equipamento de qualidade', spec: 'Frota revisada', image: frotaEquip, alt: 'Jetski Yamaha da JMS em detalhe, revisado e pronto' },
];

export const LOCAIS: LocalNavegacao[] = [
  { name: 'Laguna / SC', description: 'Saída próxima ao Iate Club, com a icônica orla lagunense e a ponte Anita Garibaldi.', image: cidadeLaguna, alt: 'Vista aérea da orla histórica de Laguna - SC', mapUrl: 'https://maps.app.goo.gl/hnDt5XgAJQSMw5LXA' },
  { name: 'Araranguá / SC', description: 'Rios e praias do litoral sul para um passeio diferente e tranquilo.', image: cidadeArarangua, alt: 'Vista aérea da cidade de Araranguá - SC e seu rio', mapUrl: 'https://maps.app.goo.gl/w4Hdcj75YPitTSDY8' },
  { name: 'Balneário Rincão / SC', description: 'Praia ampla e ótimas condições para acelerar com segurança.', image: cidadeRincao, alt: 'Vista aérea da lagoa e praia de Balneário Rincão - SC', mapUrl: 'https://maps.app.goo.gl/4ghZPiiMNrK4iHUN6' },
];

export const FAQ_ITEMS: FaqItem[] = [
  { question: 'Onde retiro o Jet Ski?', answer: 'Próximo ao Iate Club em Laguna/SC ou em local combinado no momento da locação.' },
  { question: 'O que é necessário para alugar um jet?', answer: 'O processo é idêntico ao de um veículo: o locatário precisa ser habilitado como Motonauta (CHA-MTA), fazer o caução exigido via PIX ou transferência bancária e estar ciente das cláusulas do contrato de locação.' },
  { question: 'Não tenho habilitação, mas quero alugar, o que faço?', answer: (<>Trabalhamos em parceria com a escola Albor, em Laguna/SC, que oferece o treinamento para obtenção da habilitação. Contato: (48) 98500-0926 ou <a href="https://albornautica.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-muted transition-colors">albornautica.com.br</a>.</>) },
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
  { initial: 'J', name: 'J - João Damiani', role: 'CEO', photo: jet06, focus: '50% 50%', bio: 'Formado em Tecnologia da Informação, João descobriu sua verdadeira paixão na área náutica. Com um olhar atento para detalhes e uma mente analítica, ele se dedica a compartilhar seu conhecimento e experiências no mar, inspirando outros a explorar esse universo fascinante.' },
  { initial: 'M', name: 'M - Mayck Manoel', role: 'CEO', photo: jet01, focus: '62% 42%', bio: 'Ex-membro da Marinha, Mayck é o fundador da Escola Náutica Albor. Com uma vasta experiência em navegação e segurança no mar, ele se empenha em formar novos marinheiros, transmitindo seu amor pela vida náutica e a importância de respeitar os oceanos.' },
  { initial: 'S', name: 'S - Stivison Gomes', role: 'CEO', photo: jet07, focus: '50% 55%', bio: 'Stivison é um verdadeiro amante da náutica, sempre em busca de novas aventuras nas águas. Seja navegando ou mergulhando nas belezas subaquáticas, ele compartilha sua paixão pelo mar com todos que encontram seu caminho, inspirando outros a se juntarem a essa jornada.' },
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
