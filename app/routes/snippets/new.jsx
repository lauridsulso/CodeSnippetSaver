import { Form, redirect, json, useActionData } from "remix";
import { getSession } from "~/sessions.server";
import connectDb from "~/db/connectDb.server";

// check if session is valid - if not, redirect to login
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.get("userId")) {
    return redirect("/Login");
  }
  return json({
    userId: session.get("userId"),
  });
}

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    const newSnippet = await db.models.Snippet.create({
      title: form.get("title"),
      language: form.get("language"),
      snippet: form.get("snippet"),
      description: form.get("description"),
    });
    return redirect(`/snippets/${newSnippet._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateSnippet() {
  const actionData = useActionData();
  return (
    <div>
      <h1 className="text-xl">Create code snippet</h1>
      <Form method="post">
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title}
          id="title"
          className={
            actionData?.errors.title ? "border-2 border-red-500" : null
          }
        />
        <label htmlFor="language" className="block">
          Programming language
        </label>

        <select
          defaultValue={actionData?.values.language}
          name="language"
          id="language"
          className="form-select form-select-sm
          appearance-none
          block
          px-2
          py-1
          text-sm
          font-normal
          text-gray-700
          bg-white bg-clip-padding bg-no-repeat
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        >
          <option value="">Select language</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="Javascript">Javascript</option>
          <option value="C#">C#</option>
          <option value="Python">Python</option>
          <option value="Php">Php</option>
          <option value="Other language">Other language</option>
        </select>
        <label htmlFor="snippet" className="block">
          Code snippet
        </label>
        <textarea
          type="text"
          name="snippet"
          defaultValue={actionData?.values.snippet}
          id="snippet"
          className={
            actionData?.errors.snippet ? "border-2 border-red-500" : null
          }
        />
        <label htmlFor="description" className="block">
          Code description
        </label>
        <textarea
          type="text"
          name="description"
          defaultValue={actionData?.values.description}
          id="description"
          className={`resize-y
            ${actionData?.errors.description ? "border-2 border-red-500" : null}
          `}
        />

        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10"
          type="submit"
        >
          Create new snippet
        </button>
      </Form>
    </div>
  );
}
