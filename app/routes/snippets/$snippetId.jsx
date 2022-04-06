import { Link } from "@remix-run/react";
import { useLoaderData, useCatch, json, redirect } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  if (!snippet) {
    throw new Response(
      `I don't seem to be able to find a snippet with that id: ${params.snippetId} 🤔🔎 `,
      {
        status: 404,
      }
    );
  }
  return json(snippet);
}

//DELETE SELECTED CODE SNIPPET
export const action = async ({ request, params }) => {
  const db = await connectDb();
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const snippet = await db.models.Snippet.findById(params.snippetId);
    if (!snippet)
      throw new Error("The snippet you are trying to delete doesn't exist");
    await snippet.delete({ where: { id: params.snippetId } });
    return redirect("../");

    //ADD SELECTED CODE SNIPPET TO FAVORITE / REMOVE FROM FAVORITE
  } else if (form.get("_method") === "favorite") {
    const snippet = await db.models.Snippet.findById(params.snippetId);
    snippet.favorite = !snippet.favorite;
    snippet.save();
  }
  return null;
};

export default function SnippetPage() {
  const snippet = useLoaderData();
  const dateTime = new Date(snippet.timeCreated);
  const date = dateTime.getDate();
  const month = dateTime.getMonth() + 1;
  return (
    <div>
      <div>
        <div>
          <h1 className="text-2xl font-bold">
            {snippet.title}

            <div className="float-right">
              <form method="POST">
                <input type="hidden" name="_method" value="favorite" />
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={snippet.favorite ? "red" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </form>
            </div>
            <span className="text-xl font-normal"> - {snippet.language}</span>
          </h1>
        </div>
        <p>Added {`${date}/${month}`}</p>
        <p className="italic">- {snippet.description}</p>
        <pre className="text-green-600 bg-gray-800 p-6 mt-4 whitespace-normal">
          {snippet.snippet}
        </pre>
      </div>

      {/* <code>
        <pre>{JSON.stringify(snippet, null, 2)}</pre>
      </code> */}

      <div className="flex justify-between items-center mt-6">
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
            Delete snippet
          </button>
        </form>

        <div className="float-right">
          <form method="POST">
            <input type="hidden" name="_method" value="update" />
            <Link
              className="hover:underline"
              to={`/snippets/update/${snippet._id}`}
            >
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
