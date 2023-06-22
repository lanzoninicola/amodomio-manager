import { badRequest } from "~/utils/http-response.server";
import { BaseEntity } from "../base.entity";
import { MenuItemModel, type MenuItem } from "./menu-item.model.server";
import { CategoryModel } from "../category/category.model.server";

class MenuItemEntity extends BaseEntity<MenuItem> {
  //   override async create(menuItem: MenuItem): Promise<MenuItem> {
  //     this.validate(menuItem);

  //     const latest = await this.getLatest();

  //     if (latest) {
  //       menuItem.sortOrder = (latest?.sortOrder || 0) + 1;
  //     } else {
  //       menuItem.sortOrder = 1;
  //     }

  //     return await super.save(menuItem);
  //   }

  async resetSortOrder(): Promise<void> {
    const all = await MenuItemModel.whereCompound([
      {
        field: "visible",
        op: "==",
        value: true,
      },
    ]);

    const ff = all.map(async (item, index) => {
      const itemCategoryId = item?.category?.id;
      let itemCategorySortOrder = 1000;

      if (itemCategoryId) {
        const itemCategory = await CategoryModel.findById(itemCategoryId);

        if (itemCategory) {
          itemCategorySortOrder = itemCategory.sortOrder || 1000;
        }
      }

      return MenuItemModel.update(item.id as string, {
        sortOrder: itemCategorySortOrder + index + 1,
      });
    });

    await Promise.all(ff);
  }

  async sortDown(id: string, categoryId: string): Promise<MenuItem> {
    const current = await this.findById(id);
    const currentCategory = await CategoryModel.findById(categoryId);

    const currentCategorySortOrder = currentCategory?.sortOrder || 1000;

    console.log({ current, currentCategory });

    if (!current) {
      badRequest("Item não encontrado");
    }

    if (!current?.sortOrder) {
      current!["sortOrder"] = currentCategorySortOrder + 1;
    }

    if (!current) {
      badRequest("Não foi possível encontrar a categoria");
    }

    const nextValues = await MenuItemModel.whereCompound([
      // {
      //   field: "visible",
      //   op: "==",
      //   value: true,
      // },
      {
        field: "sortOrder",
        op: ">",
        value: current!.sortOrder,
      },
    ]);

    if (nextValues.length === 0) {
      return current!;
    }

    const next = nextValues[0];
    let nextValueSortOrder = next.sortOrder;

    if (!nextValueSortOrder) {
      nextValueSortOrder = currentCategorySortOrder + 1;
    }

    next.sortOrder = current!.sortOrder;
    current!.sortOrder = nextValueSortOrder;

    await MenuItemModel.update(current!.id as string, {
      sortOrder: current!.sortOrder,
    });

    await MenuItemModel.update(next!.id as string, {
      sortOrder: next.sortOrder,
    });

    return current!;
  }

  async sortUp(id: string, categoryId: string): Promise<MenuItem> {
    const current = await this.findById(id);
    const currentCategory = await CategoryModel.findById(categoryId);

    const currentCategorySortOrder = currentCategory?.sortOrder || 1000;

    if (!current) {
      badRequest("Item não encontrado");
    }

    if (!current?.sortOrder) {
      current!["sortOrder"] = currentCategorySortOrder + 1;
    }

    if (current?.sortOrder === currentCategorySortOrder + 1) {
      return current;
    }

    const previous = await MenuItemModel.whereCompound([
      {
        field: "sortOrder",
        op: "<",
        value: current!.sortOrder,
      },
      // {
      //   field: "visible",
      //   op: "==",
      //   value: true,
      // },

      {
        field: "sortOrder",
        op: ">=",
        value: currentCategorySortOrder + 1,
      },
    ]);

    if (previous.length === 0) {
      return current!;
    }

    const previousValue = previous[0];
    const previousSortOrder = previousValue.sortOrder;

    if (!previousSortOrder) {
      previousValue.sortOrder = currentCategorySortOrder + 1;
    }

    previousValue.sortOrder = current!.sortOrder;
    current!.sortOrder = previousSortOrder;

    await MenuItemModel.update(current!.id as string, {
      sortOrder: current!.sortOrder,
    });

    await MenuItemModel.update(previousValue!.id as string, {
      sortOrder: previousValue.sortOrder,
    });

    return current!;
  }
}

const menuEntity = new MenuItemEntity(MenuItemModel);

export { menuEntity };
