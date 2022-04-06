import { useLoaderData, Link, useSubmit, Form, Outlet } from "remix";
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
    <div className="sm:flex:none md:flex w-full">
      <div className="sm:w-full md:w-1/4 border-r-4">
        <h1 className="text-2xl mb-4">Code snippets</h1>
        <h2 className="text-lg mb-3">Select code snippet:</h2>

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
              <li
                className="text-blue-600 hover:underline  py-2 text-xl"
                key={snippet._id}
              >
                <Link
                  to={`/snippets/${snippet._id}`}
                  className="focus:font-bold p-1"
                >
                  {snippet.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="px-4 sm:w-full md:w-3/4">
        <Outlet />
      </div>
    </div>
  );
}
