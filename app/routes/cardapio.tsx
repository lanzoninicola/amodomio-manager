import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { redirect, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";

import { ItalianFlagSmall, LogoTransparent } from "~/components/primitives/logo/logo";
import { ok } from "~/utils/http-response.server";
import { menuEntity } from "~/domain/menu-item/menu-item.entity.server";
import type { MenuItem } from "~/domain/menu-item/menu-item.model.server";
import { useEffect, useState } from "react";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { Category } from "~/domain/category/category.model.server";
import { CategoriesTabs } from "~/domain/category/components";
import { urlAt } from "~/utils/url";
import toLowerCase from "~/utils/to-lower-case";
import Container from "~/components/layout/container/container";
import EasterEgg from "~/components/primitives/easter-egg/ester-egg";

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
    href: "https://fonts.googleapis.com/css2?family=BioRhyme+Expanded:wght@700&family=Inconsolata:wght@400;700&display=swap",
    rel: "stylesheet",
  },
];

export async function loader({ request }: LoaderArgs) {
  const menuItems = await menuEntity.findAll() as MenuItem[]
  const categories = await categoryEntity.findAll()

  return ok({
    items: menuItems.filter(item => item.visible).map(item => item as MenuItem),
    categories: categories.filter(c => c.visible).map(c => c)
  })
}

export async function action({ request }: ActionArgs) {
  return null
}

export default function MenuPage() {
  const loaderData = useLoaderData<typeof loader>()
  const items = loaderData.payload.items as MenuItem[]
  const categories = loaderData.payload.categories as Category[]

  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategoryTab = searchParams.get("tab")

  const itemsFiltered = items.filter(item => {

    if (!currentCategoryTab) {
      const classicCategory = categories.find(c => toLowerCase(c.name) === 'classica')
      return item.category?.id === classicCategory?.id
    }

    if (currentCategoryTab) {
      return item.category?.id === currentCategoryTab
    }
    return true
  })

  return (
    <div className="md:h-screen bg-brand-yellow flex flex-col">
      <Container clazzName="z-20">
        <div className="py-6 md:py-12 flex justify-center mb-6 ">
          <EasterEgg redirectTo="/admin">
            <LogoTransparent />
          </EasterEgg>
        </div>
        <div>
          <div className="sticky w-full top-2 z-20">
            <CategoriesTabs
              categories={categories}
              includeAll={false}
              includeEmpty={false}
              bgStyle="bg-brand-orange"
              activeTabStyle="font-menu font-bold bg-brand-yellow text-black text-lg"
              inactiveTabStyle="font-menu font-bold text-white text-lg" />
          </div>
          <div className="p-4 md:p-0 overflow-hidden">
            <Content items={itemsFiltered} />
          </div>
        </div>
      </Container>
      <img src="/images/pizza-linguiça.png" alt="Pizza linguiça decorativa"
        className="fixed top-32 md:top-0 -right-96 -rotate-90 opacity-20 grayscale contrast-100 w-[190%] md:w-auto max-w-none"
      />
    </div >

  );
}


function Content({ items }: { items: MenuItem[] }) {
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


