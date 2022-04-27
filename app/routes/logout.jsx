import { redirect } from "remix";
import { destroySession, getSession } from "../sessions.server";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/Login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export function loader() {
  return redirect("/Login");
}
