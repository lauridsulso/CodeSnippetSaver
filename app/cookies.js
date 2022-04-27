import { createCookie } from "remix";

export const sessionCookie = createCookie("_session", {
  // secret: [process.env.COOKIE_SECRET],
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
});
