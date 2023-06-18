import type { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ItalianFlagSmall, LogoOutlineWords } from "~/components/primitives/logo/logo";
import SplashScreen from "~/components/primitives/splash-screen/splash-screen";
import { categoryEntity } from "~/domain/category/category.entity.server";
import type { PizzaCatalog } from "~/domain/pizza-catalog/pizza-catalog.entity.server";
import { pizzaCatalogEntity } from "~/domain/pizza-catalog/pizza-catalog.entity.server";
import { ProductEntity } from "~/domain/product/product.entity";
import { sizeEntity } from "~/domain/size/size.entity.server";
import { ok } from "~/utils/http-response.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cardápio A Modio Mio" },
    {
      name: "description",
      content: "Bem vindo ao cardápio da Pizza Delivery A Modo Mio",
    },
  ];
};

export async function loader() {
  const productEntity = new ProductEntity();
  const product = await productEntity.findAll();
  const categories = await categoryEntity.findAll();
  const sizes = await sizeEntity.findAll();

  const pizzaRawCatalog = (await pizzaCatalogEntity.findOne([
    {
      field: "type",
      op: "==",
      value: "pizza",
    },
  ])) as PizzaCatalog;

  let pizzaCatalog: any = [];

  if (pizzaRawCatalog && pizzaRawCatalog.items) {
    pizzaCatalog = pizzaRawCatalog.items.map((item) => {
      return {
        ...item.product,
        product: {
          ...product.find((p) => p.id === item.product.id),
          sizes: item.product.sizes.map((s) => {
            return {
              ...s,
              ...sizes.find((size) => size.id === s.id),
              pizzas: s.toppings.map((topping) => {
                return {
                  ...topping,
                  topping: {
                    ...product.find((p) => p.id === topping.id),
                  },
                  category: {
                    ...categories.find((c) => c.id === topping.categoryId),
                  },
                };
              }),
            };
          }),
        },
      };
    });
  }

  return ok({
    product,
    categories,
    sizes,
    pizzaCatalog,
  });
}

export default function HomePage() {
  const loaderData = useLoaderData<typeof loader>();
  const pizzaCatalog = loaderData.payload.pizzaCatalog;

  // console.log(pizzaCatalog);

  return (
    <SplashScreen />
  );
}
