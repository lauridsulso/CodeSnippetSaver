import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  return json(snippet);
}

export const action = async ({ request, params }) => {
  const db = await connectDb();
  const form = await request.formData();

  const title = form.get("title");
  const language = form.get("language");
  const description = form.get("description");
  const snippet = form.get("snippet");
  const snippetId = params.snippetId;
  console.log("title", title);

  try {
    await db.models.Snippet.findOneAndUpdate(
      { _id: snippetId },
      {
        $set: {
          title: title,
          language: language,
          description: description,
          snippet: snippet,
        },
      }
    );

    return redirect(`/snippets/${snippetId}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
};

export default function SnippetUpdate() {
  const actionData = useActionData();
  const snippet = useLoaderData();

  return (
    <div>
      <h1>Update current snippet</h1>
      <Form method="post">
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title ?? snippet.title}
          id="title"
          className={
            actionData?.errors.title ? "border-2 border-red-500" : null
          }
        />
        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}

        <label htmlFor="language" className="block">
          Language
        </label>
        <input
          type="text"
          name="language"
          defaultValue={actionData?.values.language ?? snippet.language}
          id="language"
          className={
            actionData?.errors.language ? "border-2 border-red-500" : null
          }
        />
        <label htmlFor="description" className="block">
          Description
        </label>
        <input
          type="text"
          name="description"
          defaultValue={actionData?.values.description ?? snippet.description}
          id="description"
          className={
            actionData?.errors.description ? "border-2 border-red-500" : null
          }
        />
        <label htmlFor="snippet" className="block">
          Snippet
        </label>
        <input
          type="text"
          name="snippet"
          defaultValue={actionData?.values.snippet ?? snippet.snippet}
          id="snippet"
          className={
            actionData?.errors.snippet ? "border-2 border-red-500" : null
          }
        />
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
