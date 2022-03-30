import { useLoaderData, Link } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const books = await db.models.Snippet.find();
  return books;
}

export default function Index() {
  const books = useLoaderData();

  return (
    <div>
      <h1 className="text-2xl mb-4">Code snippets</h1>
      <h2 className="text-lg mb-3">Select the code snippet you want to use:</h2>
      <ul className="">
        {books.map((book) => {
          return (
            <li key={book._id}>
              <Link
                to={`/books/${book._id}`}
                className="text-blue-600 hover:underline"
              >
                {book.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
