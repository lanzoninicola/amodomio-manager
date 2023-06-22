import { badRequest } from "~/utils/http-response.server";
import { BaseEntity } from "../base.entity";
import { MenuItemModel, type MenuItem } from "./menu-item.model.server";

class MenuItemEntity extends BaseEntity<MenuItem> {
  async sortDown(id: string): Promise<MenuItem> {
    const current = await this.findById(id);

    if (!current) {
      badRequest("Não foi possível encontrar a categoria");
    }

    const nextValues = await MenuItemModel.whereCompound([
      {
        field: "visible",
        op: "==",
        value: true,
      },
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
    const nextValueSortOrder = next.sortOrder;

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

  async sortUp(id: string): Promise<MenuItem> {
    const current = await this.findById(id);

    if (!current) {
      badRequest("Categoria não encontrada");
    }

    if (current?.sortOrder === 1000) {
      return current;
    }

    const previous = await MenuItemModel.whereCompound([
      {
        field: "sortOrder",
        op: "<",
        value: current!.sortOrder,
      },
      {
        field: "visible",
        op: "==",
        value: true,
      },

      {
        field: "sortOrder",
        op: ">=",
        value: 1000,
      },
    ]);

    if (previous.length === 0) {
      return current!;
    }

    const previousValue = previous[0];

    const previousSortOrder = previousValue.sortOrder;

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
