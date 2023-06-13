import type { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import { CategoryEntity } from "~/domain/category/category.entity.server";
import { ProductEntity } from "~/domain/product/product.entity";
import type { Product } from "~/domain/product/product.model.server";
import { ok } from "~/utils/http-response.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }) {

  const productEntity = new ProductEntity()
  const product = await productEntity.findAll()

  const categoryEntity = new CategoryEntity()
  const categories = await categoryEntity.findAll()

  return ok({
    product,
    categories
  })
}

export async function action({ request }) {

  return null
}






export default function HomePage() {

  const loaderData = useLoaderData<typeof loader>()
  const products: Product[] = loaderData.payload.product
  const categories = loaderData.payload.categories

  return (
    <Container>
      <div className="grid place-items-center center w-full h-full text-4xl">This is the cardapio page</div>
    </Container>
  )
}