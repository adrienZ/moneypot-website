import { DatabaseUserAttributes } from "lucia";

export default defineEventHandler((event) => {
  // TODO: Find to a way to override default `User` type in `lucia`
  // @ts-expect-error
  return event.context.user as DatabaseUserAttributes;
});
