import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    const newBook = await db.models.Snippet.create({
      title: form.get("title"),
      language: form.get("language"),
      snippet: form.get("snippet"),
      description: form.get("description"),
    });
    return redirect(`/books/${newBook._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateBook() {
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
        <input
          type="text"
          name="language"
          defaultValue={actionData?.values.language}
          id="language"
          className={
            actionData?.errors.language ? "border-2 border-red-500" : null
          }
        />
        <label htmlFor="snippet" className="block">
          Code snippet
        </label>
        <input
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
        <input
          type="text"
          name="description"
          defaultValue={actionData?.values.description}
          id="description"
          className={
            actionData?.errors.description ? "border-2 border-red-500" : null
          }
        />

        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10"
          type="submit"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
