import { Form, useLoaderData, redirect } from "remix";

export function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": "userId=1;Max-Age=10;HttpOnly",
    },
  });
}

export async function loader({ request }) {
  const cookie = request.headers.get("Cookie");
  return cookie;
}

export default function Login() {
  const readcookies = useLoaderData();
  console.log(readcookies);
  return (
    <div>
      {readcookies}
      <Form method="post" reloadDocument>
        <input type="submit" />
      </Form>
    </div>
  );
}
