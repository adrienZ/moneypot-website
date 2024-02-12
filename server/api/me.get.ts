import { user } from "../database/schema";
import { eq } from "drizzle-orm";
import { createTOTPKeyURI } from "oslo/otp";
import QRCode from "qrcode";
import { decodeHex } from "oslo/encoding";
import parser from "ua-parser-js";
import type { DatabaseSessionAttributes } from "lucia";
import { IpLocation } from "../lib/IpLocation";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw new Response(null, {
      status: 401
    });
  }

  // TODO: understand lucia type system and avoid "as"
  const sessions = (await lucia.getUserSessions(
    event.context.user.id
  )) as unknown as DatabaseSessionAttributes[];

  const reader = await IpLocation.createReader();
  const sessionsWithParsedUserAgent = sessions.map(($session) => {
    const location = $session.ip ? new IpLocation($session.ip, reader) : null;

    return {
      city: location?.city,
      country: location?.country,
      id: $session.id,
      createdAt: $session.createdAt,
      ...parser($session.userAgent ?? undefined),
      isCurrentSession: $session.id === event.context.session?.id,
      ip: $session.ip
    };
  });
  // Calling close() here shuts everything down nicely and clears up Node's event loop.
  reader.close();

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
