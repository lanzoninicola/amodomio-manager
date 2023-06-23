import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { ToastProvider } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
  // { rel: "preconnect", href: "https://fonts.googleapis.com" },
  // {
  //   rel: "preconnect",
  //   href: "https://fonts.gstatic.com",
  // },
  // {
  //   href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Homemade+Apple&family=BioRhyme+Expanded:wght@700&display=swap",
  //   rel: "stylesheet",
  // },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// export function ErrorBoundary({ error }) {
//   console.error(error);
//   return (
//     <html>
//       <head>
//         <title>Oh no!</title>
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <div className="m-4 p-4 bg-red-300">
//           <h1>Oh no!</h1>
//           <p className="text-red-700">{error?.message || "Erro generico"}</p>
//         </div>
//         <Scripts />
//       </body>
//     </html>
//   );
// }
