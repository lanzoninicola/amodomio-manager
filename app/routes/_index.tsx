import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }) {

  return null
}

export async function action({ request }) {

  return null
}






export default function HomePage() {
  return <div className="grid place-items-center center w-screen h-screen text-4xl">This is the cardapio page</div>
}