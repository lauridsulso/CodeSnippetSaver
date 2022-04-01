import { useLoaderData, Link, useSubmit, Form } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ request }) {
  const db = await connectDb();
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  const snippets = await db.models.Snippet.find(
    searchQuery
      ? {
          title: { $regex: new RegExp(searchQuery, "i") },
        }
      : {}
  );
  return snippets;
}

export default function Index() {
  const snippets = useLoaderData();
  const submit = useSubmit();

  return (
    <div>
      <h1 className="text-2xl mb-4">Code snippets</h1>
      <h2 className="text-lg mb-3">Select the code snippet you want to use:</h2>

      <Form
        className="searchForm"
        method="get"
        onChange={(e) => {
          submit(e.currentTarget);
        }}
        action=""
      >
        <input
          placeholder="Search..."
          autoComplete="off"
          type="search"
          name="q"
          type="text"
          className="mb-10"
        />
      </Form>

      <ul className="">
        {snippets.map((snippet) => {
          return (
            <li key={snippet._id}>
              <Link
                to={`/snippets/${snippet._id}`}
                className="text-blue-600 hover:underline"
              >
                {snippet.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
