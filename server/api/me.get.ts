import { user } from "../database/schema";
import { eq } from "drizzle-orm";
import { createTOTPKeyURI } from "oslo/otp";
import QRCode from "qrcode";
import { decodeHex } from "oslo/encoding";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return new Response(null, {
      status: 401
    });
  }

  const sessions = await lucia.getUserSessions(event.context.user.id);

  const [me] = await db
    .select()
    .from(user)
    .where(eq(user.id, event.context.user.id))
    .limit(1);

  let qrcode: string | null = null;
  if (me.twoFactorSecret) {
    const secret = decodeHex(me.twoFactorSecret);
    const uri = createTOTPKeyURI("moneypot-website", me.email, secret);
    qrcode = await QRCode.toDataURL(uri);
  }

  return {
    ...me,
    sessions,
    qrcode
  };
});
