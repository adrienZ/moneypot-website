import type { DatabaseUserAttributes } from "lucia";

export const useUser = () => {
  return useState<DatabaseUserAttributes | null>("user", () => null);
};

export const useAuthenticatedUser = () => {
  const user = useUser();
  return computed(() => {
    const userValue = unref(user);
    if (!userValue) {
      throw createError(
        "useAuthenticatedUser() can only be used in protected pages"
      );
    }

    // remove real id from db
    return {
      externalId: userValue.externalId,
      emailVerified: userValue.emailVerified
    };
  });
};
