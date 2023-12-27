type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0]

export function useLuciaAuth(h3Event: H3Event) {
	const lucia = h3Event.context.lucia;
	if (!lucia) {
		throw new Error("No lucia auth detect");
	}

  return lucia
}