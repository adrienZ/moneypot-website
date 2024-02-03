import { user } from "../database/schema";
import { eq } from "drizzle-orm";
import { createTOTPKeyURI } from "oslo/otp";
import QRCode from "qrcode";
import { decodeHex } from "oslo/encoding";
import parser from "ua-parser-js";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return new Response(null, {
      status: 401
    });
  }

  const sessions = await lucia.getUserSessions(event.context.user.id);
  const sessionsWithParsedUserAgent = sessions.map(($session) => ({
    id: $session.id,
    // @ts-expect-error
    createdAt: $session.createdAt,
    ...parser($session.userAgent ?? undefined),
    isCurrentSession: $session.id === event.context.session?.id,
    ip: $session.ip
  }));

  const [me] = await db
    .select()
    .from(user)
    .where(eq(user.id, Number(event.context.user.id)))
    .limit(1);

  let qrcode: string | null = null;

  if (me.twoFactorSecret) {
    const secret = decodeHex(me.twoFactorSecret);
    const uri = createTOTPKeyURI("moneypot-website", me.email, secret);
    qrcode = await QRCode.toDataURL(uri);
  }

  return {
    ...me,
    sessions: sessionsWithParsedUserAgent,
    qrcode
  };
});
