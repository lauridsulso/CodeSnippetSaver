import { Form, useLoaderData, redirect, json } from "remix";
import { getSession, commitSession } from "../sessions.server";
import connectDb from "~/db/connectDb.server.js";
import bcrypt from "bcryptjs";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();

  const user = await db.models.User.findOne({
    email: form.get("email").trim(),
  });

  let isCorrectPassword = false;
  if (user) {
    isCorrectPassword = await bcrypt.compare(
      form.get("password").trim(),
      user.password
    );
  }

  if (user && isCorrectPassword) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user._id);
    return redirect("/Login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return json("error");
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    userId: session.get("userId"),
  });
}

export default function Login() {
  const { userId } = useLoaderData();
  console.log(userId);
  return (
    <div>
      <pre>{JSON.stringify(userId)}</pre>
      <br />
      {!userId ? (
        <Form name="" id="" className="flex flex-col w-1/3" method="post">
          <label>Email</label>
          <input name="email" id="email" type="text" />
          <label>Password</label>
          <input name="password" id="password" type="password" />
          <button
            type="submit"
            className="w-20 inline-block align-baseline font-bold bg-gray-200 rounded p-2 text-sm text-blue-500 hover:text-blue-800"
          >
            Login
          </button>
        </Form>
      ) : (
        <Form name="" id="" method="post" action="/logout">
          <button className="w-20 inline-block align-baseline font-bold bg-gray-200 rounded p-2 text-sm text-red-500 hover:text-red-800">
            Logout
          </button>
        </Form>
      )}
    </div>
  );
}
