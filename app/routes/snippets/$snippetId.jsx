import { Link } from "@remix-run/react";
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
  } else if (form.get("_method") === "favorite") {
    const snippet = await db.models.Snippet.findById(params.snippetId);
    snippet.favorite = !snippet.favorite;
    snippet.save();
  }
  return null;
};

export default function SnippetPage() {
  const snippet = useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Code snippet</h1>
      <div>
        <div>
          <h1 className="text-xl font-bold">
            {snippet.title}{" "}
            <div>
              <form method="POST">
                <input type="hidden" name="_method" value="favorite" />
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={snippet.favorite ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              </form>
            </div>
            <span className="text-xl font-normal"> - {snippet.language}</span>
          </h1>
        </div>
        <p className="italic">{snippet.description}</p>
        <pre className="text-green-600 bg-gray-200 p-6 mt-4">
          {snippet.snippet}
        </pre>
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
      <div className="flex">
        <form method="POST">
          <input type="hidden" name="_method" value="update" />
          <Link
            className="hover:underline"
            to={`/snippets/update/${snippet._id}`}
          >
            Update Snippet
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
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
