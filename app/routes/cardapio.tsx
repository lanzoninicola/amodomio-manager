import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { ItalianFlagSmall, LogoTransparent } from "~/components/primitives/logo/logo";
import { ok } from "~/utils/http-response.server";
import { menuEntity } from "~/domain/menu-item/menu-item.entity.server";
import type { MenuItem } from "~/domain/menu-item/menu-item";
import { useEffect, useState } from "react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cardápio A Modio Mio" },
    {
      name: "description",
      content: "Bem vindo ao cardápio da Pizza Delivery A Modo Mio",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=BioRhyme+Expanded:wght@700&family=Inconsolata:wght@400&display=swap",
    rel: "stylesheet",
  },
];

export async function loader({ request }: LoaderArgs) {

  const menuItems = await menuEntity.findAll() as MenuItem[]

  return ok({
    items: menuItems.filter(item => item.visible).map(item => item as MenuItem),
  })
}

export async function action({ request }: ActionArgs) {
  return null
}

export default function MenuPage() {

  return (

    <div className="md:h-screen bg-brand-yellow flex flex-col">
      <div className="py-6 md:py-12 flex justify-center z-20">
        <LogoWithEasternEgg />
      </div>
      <div className="p-4 md:p-0">
        <Content />
      </div>
    </div >
  );
}

function LogoWithEasternEgg() {
  const navigate = useNavigate()
  const [clickedAmount, setClickedAmount] = useState(0)

  console.log('clickedAmount', clickedAmount)

  const handleClick = () => {
    setClickedAmount(clickedAmount + 1)
  }

  const isClickedEnough = clickedAmount > 3


  useEffect(() => {
    if (isClickedEnough) {
      navigate('/admin')

    }
  }, [isClickedEnough, navigate])


  return (
    <div onClick={handleClick} >
      <LogoTransparent />
    </div>
  )
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
                  <p className="text-lg font-semibold font-menu leading-tight">{ingredientsString}</p>
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
    <div className="flex gap-1 mb-1 md:mb-0 items-center tracking-tight">
      {/* <PizzaIcon /> */}
      <span className="text-base font-bold font-accent uppercase">{children}</span>
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
      <div className="relative">
        <ItalianFlagSmall className="absolute top-2 left-0 w-[17px] h-[12px]" />
        <span className="ml-6 text-base font-light font-menu">{ingredientsString}</span>
      </div>
    </div>
  )

}


interface PriceProps {
  children: React.ReactNode
}

function Price({ children }: PriceProps) {

  return (
    <div className="flex gap-1 mt-2">
      <span className="text-xs font-semibold text-black">R$</span>
      <span className="text-xs font-semibold text-black">{children}</span>
    </div>
  )

}


