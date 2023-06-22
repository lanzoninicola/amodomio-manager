import { BaseEntity } from "../base.entity";
import { MenuItemModel, type MenuItem } from "./menu-item";

class MenuItemEntity extends BaseEntity<MenuItem> {}

const menuEntity = new MenuItemEntity(MenuItemModel);

export { menuEntity };
