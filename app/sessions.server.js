import { createCookieSessionStorage, redirect } from "remix";
import { sessionCookie } from "./cookies.server";

export async function requireUserSession(request) {
  // get the session
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  // validate the session, `userId` is just an example, use whatever value you
  // put in the session when the user authenticated
  if (!session.has("userId")) {
    // if there is no user session, redirect to login
    throw redirect("/Login");
  }

  return session;
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };
