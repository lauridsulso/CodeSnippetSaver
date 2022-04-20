import { createCookie } from "remix";

export const sessionCookie = createCookie("_session", {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
});
