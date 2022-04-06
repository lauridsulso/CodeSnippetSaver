import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import styles from "~/tailwind.css";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 text-slate-800 font-sans p-4">
        <header className="pb-3 mb-4">
          <Link
            to="/"
            className="hover:underline focus:font-bold text-blue-600"
          >
            Snippets |
          </Link>

          <Link
            to="/snippets/new"
            className="ml-3 hover:underline focus:font-bold text-blue-600"
          >
            Add new
          </Link>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
