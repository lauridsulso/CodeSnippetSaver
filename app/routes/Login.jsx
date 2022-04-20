import { Form, useLoaderData, redirect, json } from "remix";
import { getSession, commitSession } from "../sessions";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", 420);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    userId: session.get("userId"),
  });
}

export default function Login() {
  const userId = useLoaderData();
  console.log(userId);
  return (
    <div>
      <pre>{JSON.stringify(userId)}</pre>
      <Form method="post" reloadDocument>
        <input
          className="inline-block align-baseline font-bold bg-gray-200 rounded p-2 text-sm text-blue-500 hover:text-blue-800"
          type="submit"
        />
      </Form>
    </div>
  );
}
