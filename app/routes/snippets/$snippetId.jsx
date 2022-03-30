import { useLoaderData, useCatch, json, redirect } from "remix";
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

//DELETE SELECTED CODE SNIPPET
export const action = async ({ request, params }) => {
  const db = await connectDb();
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const snippet = await db.models.Snippet.findById(params.snippetId);

    if (!snippet) throw new Error("Snippet not found");

    await snippet.delete({ where: { id: params.snippetId } });
    return redirect("../");
  }
};

export default function SnippetPage() {
  const snippet = useLoaderData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Code snippet</h1>
      <div>
        <h1 className="text-xl font-bold">
          {snippet.title}
          <span className="text-xl font-normal"> - {snippet.language}</span>
        </h1>
        <p className="italic">{snippet.description}</p>
        <pre className="bg-gray-200 p-6 mt-4">{snippet.snippet}</pre>
      </div>

      {/* <code>
        <pre>{JSON.stringify(snippet, null, 2)}</pre>
      </code> */}
      <div>
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded mt-6">
            Delete snippet
          </button>
        </form>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
