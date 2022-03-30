import { useLoaderData, Link } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const snippets = await db.models.Snippet.find();
  return snippets;
}

export default function Index() {
  const snippets = useLoaderData();

  return (
    <div>
      <h1 className="text-2xl mb-4">Code snippets</h1>
      <h2 className="text-lg mb-3">Select the code snippet you want to use:</h2>
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
