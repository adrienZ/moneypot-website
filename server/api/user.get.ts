import type { DatabaseUserAttributes } from "lucia";

export default defineEventHandler((event) => {
  // TODO: Find to a way to override default `User` type in `lucia`
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return event.context.user as DatabaseUserAttributes;
});
