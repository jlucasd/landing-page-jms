/**
 * Renova o token de longa duração do Instagram (válido por 60 dias).
 *
 * Chamado semanalmente pelo Cron da Vercel (ver `crons` em vercel.json).
 * A Vercel envia `Authorization: Bearer <CRON_SECRET>`; qualquer outra
 * chamada é recusada. A renovação estende a validade do token configurado em
 * INSTAGRAM_ACCESS_TOKEN — o token em si nunca é devolvido na resposta.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return Response.json({ ok: false, error: 'INSTAGRAM_ACCESS_TOKEN não configurado' }, { status: 503 });

  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`,
  );
  const body = (await res.json()) as { access_token?: string; expires_in?: number; error?: { message?: string } };

  if (!res.ok || !body.expires_in) {
    console.error('Instagram token refresh', res.status, body.error?.message);
    return Response.json({ ok: false, error: body.error?.message ?? 'Falha ao renovar' }, { status: 502 });
  }

  // Se a Meta devolver um token diferente, o antigo continua válido até expirar;
  // avisa no log para atualizar a variável de ambiente.
  if (body.access_token && body.access_token !== token) {
    console.warn('Instagram devolveu um token novo: atualize INSTAGRAM_ACCESS_TOKEN na Vercel.');
  }
  const days = Math.round(body.expires_in / 86400);
  return Response.json({ ok: true, expiresInDays: days, sameToken: body.access_token === token });
}
