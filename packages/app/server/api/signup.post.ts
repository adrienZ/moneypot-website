import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { SqliteError } from "better-sqlite3";
import { isValidEmail } from "#myauth/helpers/email";

export default eventHandler(async (event) => {
  const formData = await readFormData(event);
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw createError({
      message: "Invalid password",
      statusCode: 400
    });
  }

  const email = formData.get("email");
  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return new Response("Invalid email", {
      status: 400
    });
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    const createdUser = await myAuth.userTable.insertUser({
      externalId: userId,
      password: hashedPassword,
      email
    });

    await myAuth.hooks.onUserCreation(event, {
      email: createdUser.email,
      id: createdUser.id
    });
  } catch (e) {
    if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw createError({
        message: "id or email already used",
        statusCode: 500
      });
    }
    throw createError({
      message: "An unknown error occurred",
      statusCode: 500
    });
  }
});
