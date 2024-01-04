import { Argon2id } from "oslo/password";
// import { LegacyScrypt } from "lucia"

export default eventHandler(async (event) => {
	const formData = await readFormData(event);

	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		throw createError({
			message: "Invalid password",
			statusCode: 400
		});
	}

	const email = formData.get("email");
	if (!email || typeof email !== "string") {
		throw createError({
			message: "Invalid email",
			statusCode: 400
		});
	}

	const existingUser = await useDatabaseQueries(event).getUser(email)
	

	if (!existingUser) {
		throw createError({
			message: "email not found",
			statusCode: 400
		});
	}

	if (!existingUser.password) {
		throw createError({
			message: "missing data in user",
			statusCode: 500,
		})
	}

	const validPassword = await new Argon2id().verify(existingUser.password, password);

	if (!validPassword) {
		throw createError({
			message: "Incorrect email or password",
			statusCode: 400
		});
	}

	const lucia = useLuciaAuth(event);
	const session = await lucia.createSession(String(existingUser.id), {});
	appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
});