import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { ItalianFlagSmall, LogoTransparent } from "~/components/primitives/logo/logo";
import { ok } from "~/utils/http-response.server";
import menu from "../content/cardapio.json";
import { PizzaIcon } from "~/components/primitives/icons/icons";
import { menuEntity } from "~/domain/menu-item/menu-item.entity";
import type { MenuItem } from "~/domain/menu-item/menu-item";

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

  const menuItems = await menuEntity.findAll() as Menu

  return ok({
    items: menuItems
  })
}

export async function action({ request }: ActionArgs) {
  return null
}

export default function HomePage() {

  return (

    <div className="md:h-screen bg-brand-yellow flex flex-col">
      <div className="py-6 md:py-12 flex justify-center">
        <LogoTransparent />
      </div>
      <div className="p-4 md:p-0">
        <Content />
      </div>
    </div >
  );
}


function Content() {
  const loaderData = useLoaderData<typeof loader>()
  const items = loaderData.payload.items as MenuItem[]

  return (
    <div className="md:grid md:grid-cols-[1fr_.5fr]">
      <div className="md:pl-40 md:pt-12">
        <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-12 mb-4">
          {items.map((item, idx) => {

            const ingredientsString = item.ingredients && item.ingredients.join(', ')

            return (
              <li key={idx} className="mb-2">

                <div className="flex- flex-col">
                  <PizzaTitle>{item.name}</PizzaTitle>
                  {item.description && <p>{item.description}</p>}
                  <p className="text-lg font-semibold">{ingredientsString}</p>
                  <ItalianIngredientList ingredients={item?.ingredientsIta || []} />
                  <p>{item.description}</p>
                  <Price>{item.price}</Price>
                </div>

              </li>
            )
          })}
        </ul>
      </div>
      <img src="/images/pizza-linguiça.png" alt="Pizza linguiça decorativa"
        className="fixed top-32 md:top-0 -right-96 -rotate-90 opacity-20 grayscale contrast-100 w-[190%] md:w-auto max-w-none"
      />
    </div>
  )
}

interface PizzaTitleProps {
  children: React.ReactNode
}

function PizzaTitle({ children }: PizzaTitleProps) {

  return (
    <div className="flex gap-1 mb-2 md:mb-0 items-center">
      <PizzaIcon />
      <h3 className="text-base font-bold font-accent uppercase">{children}</h3>
    </div>
  )
}

interface ItalianIngredientListProps {
  ingredients: string[]
}

function ItalianIngredientList({ ingredients }: ItalianIngredientListProps) {

  const ingredientsString = ingredients.join(', ')

  return (
    <div className="flex gap-1 items-center">
      <ItalianFlagSmall className="w-[17px] h-[12px]" />
      <p className="text-base font-light">{ingredientsString}</p>
    </div>
  )

}


interface PriceProps {
  children: React.ReactNode
}

function Price({ children }: PriceProps) {

  return (
    <span className="text-xs font-semibold text-black">{children}</span>
  )

}


