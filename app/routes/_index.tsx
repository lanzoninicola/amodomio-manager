import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import IngredientModel from "~/database/models/ingredient-model.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }) {
  let formData = await request.formData();

  let name = formData.get("ingredient-name");

  await IngredientModel.add({ name })

  return json({ name })
}



export default function Index() {
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Form method="post">
        <Input placeholder="nome ingrediente" name="ingredient-name" />
        <Button type="submit">Button</Button>
      </Form>

    </div>
  )
}