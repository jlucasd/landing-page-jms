/**
 * Feed do Instagram (@jmsalugueldejetski) em tempo real.
 *
 * Função serverless da Vercel: lê os últimos posts pela Instagram API
 * (Instagram Login) usando o token guardado na variável de ambiente
 * INSTAGRAM_ACCESS_TOKEN — o token nunca chega ao navegador.
 * A resposta fica em cache na CDN por 1h (e é servida "stale" por até 1 dia
 * enquanto revalida), então o Instagram é consultado no máximo 1x por hora.
 */

const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const LIMIT = 6;

interface IgMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

const json = (body: unknown, status: number, cache: string) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  });

/** Primeira linha da legenda, sem hashtags, com no máximo ~120 caracteres. */
const shortCaption = (caption = '') => {
  const line = caption.split('\n').find((l) => l.trim()) ?? '';
  const clean = line.replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s+/g, ' ').trim();
  return clean.length > 120 ? `${clean.slice(0, 117).trimEnd()}…` : clean || 'Post da JMS Jetski';
};

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return json({ error: 'INSTAGRAM_ACCESS_TOKEN não configurado' }, 503, 'no-store');

  try {
    const url = `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=${LIMIT * 2}&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const detail = await res.text();
      console.error('Instagram API', res.status, detail);
      return json({ error: 'Falha ao consultar o Instagram' }, 502, 'public, s-maxage=300');
    }
    const { data = [] } = (await res.json()) as { data?: IgMedia[] };

    const posts = data
      .map((m) => ({
        image: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
        permalink: m.permalink,
        caption: shortCaption(m.caption),
        timestamp: m.timestamp,
      }))
      .filter((p) => p.image)
      .slice(0, LIMIT);

    return json({ posts }, 200, 'public, s-maxage=3600, stale-while-revalidate=86400');
  } catch (err) {
    console.error('Instagram API', err);
    return json({ error: 'Falha ao consultar o Instagram' }, 502, 'public, s-maxage=300');
  }
}
