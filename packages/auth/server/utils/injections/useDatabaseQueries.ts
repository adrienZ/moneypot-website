type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0]

export function useDatabaseQueries(h3Event: H3Event) {
	const auth = h3Event.context.auth;
	if (!auth) {
		// TODO: update error message
		throw new Error("No lucia auth detect");
	}

  return auth.databaseQueries;
}