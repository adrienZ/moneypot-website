import { isWithinExpirationDate } from "oslo";
import { onUserLogin } from "../../../lib/onUserCreation";

export default defineEventHandler(async (event) => {
  const lucia = useLuciaAuth(event);
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
	// const formData = await readFormData(event);
	const formData = await getRouterParams(event);


  if (!sessionId) {
    return createError({
      status: 401
    })
  }

  const { user } = await lucia.validateSession(sessionId);

	if (!user) {
    return createError({
      status: 401
    })
	}
	// const code = formData.get("code");
	const code = formData["code"];


	// check for length
	if (typeof code !== "string" || code.length !== 8) {
		return new Response("invalid code", {
			status: 400,
		});
	}

  const db = useDatabaseQueries(event);
  const databaseCode = await db.getEmailVerficationCodeByUserId(user.id);

	if (databaseCode) {
    await db.deleteEmailVerficationCode(databaseCode.id)
	}



	if (!databaseCode || databaseCode.code !== code) {
		return new Response(null, {
			status: 400
		});
	}

	if (!isWithinExpirationDate(databaseCode.expiresAt)) {
		return new Response(null, {
			status: 400
		});
	}


	// if (!user || user.email !== databaseCode.email) {
	// 	return new Response(null, {
	// 		status: 400
	// 	});
	// }

	await lucia.invalidateUserSessions(user.id);

	const updatedUser = await db.updateUserEmailVerificationById(user.id)

  onUserLogin(event, {
    email: updatedUser.email,
    id: updatedUser.id
  })
})