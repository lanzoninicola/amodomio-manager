import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { type V2_MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { LogoTransparent } from "~/components/primitives/logo/logo";
import { Button } from "~/components/ui/button";
import { ok } from "~/utils/http-response.server";
import menu from "../content/cardapio.json"
import Container from "~/components/layout/container/container";
import { PizzaIcon } from "~/components/primitives/icons/icons";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cardápio A Modio Mio" },
    {
      name: "description",
      content: "Bem vindo ao cardápio da Pizza Delivery A Modo Mio",
    },
  ];
};

interface Pizza {
  id: string
  name: string
  ingredients: string[]
  ingredients_ita: string[]
  description: string
  price: string

}

type Menu = Pizza[]

export async function loader({ request }: LoaderArgs) {
  return ok({
    menu
  })
}

export async function action({ request }: ActionArgs) {
  return null
}

export default function HomePage() {
  const loaderData = useLoaderData<typeof loader>()

  return (

    <div className="md:h-screen bg-brand-green-accent flex flex-col">
      <div className="py-6 md:py-12 flex justify-center">
        <LogoTransparent />
      </div>
      <Container>
        <Content />
      </Container>
      <div className="relative overflow-y-hidden h-full">
        <div className="absolute -bottom-44 md:-bottom-96 left-1/2 -translate-x-1/2 -rotate-12" >
          <img src="/images/pizza-tomate-seco.png" alt="Pizza retangular tomate seco, tomatinho e basílico" />
        </div>

      </div>
    </div >
  );
}


function Content() {
  const loaderData = useLoaderData<typeof loader>()
  const menu = loaderData.payload.menu as Menu

  return <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-12 mb-4">
    {menu.map((item) => {

      const ingredientsString = item.ingredients.join(', ')
      const ingredintsItaString = item.ingredients_ita.join(', ')

      return (
        <li key={item.id} className="mb-2">


          <div className="flex- flex-col">
            <div className="flex gap-2">
              <PizzaIcon />
              <h3 className="text-xs font-bold font-accent uppercase">{item.name}</h3>
            </div>

            {item.description && <p>{item.description}</p>}
            <p className="text-sm font-semibold">{ingredientsString}</p>
            <p className="text-sm font-light">{ingredintsItaString}</p>
            <p>{item.description}</p>
            <Price>{item.price}</Price>
          </div>

        </li>
      )
    })}
  </ul>
}


interface PriceProps {
  children: React.ReactNode
}

function Price({ children }: PriceProps) {

  return (

    <div className="">
      <span className="text-xs font-semibold text-black">{children}</span>
    </div>
  )

}


