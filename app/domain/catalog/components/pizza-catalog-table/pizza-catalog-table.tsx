import { useNavigation, Form } from "@remix-run/react";
import Container from "~/components/layout/container/container";
import { Table, TableTitles, TableRows, EditItemButton, TableRow } from "~/components/primitives/table-list";
import { Input } from "~/components/ui/input";
import type { PizzasCatalogItem } from "../../catalog.model.server";
import { jsonStringify } from "~/utils/json-helper";





export default function PizzaCatalogTable(items: PizzasCatalogItem[]) {


    return (
        <Container>
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Lista de produtos</h3>
            </div>
            <Table>
                <TableTitles
                    clazzName="grid-cols-5"
                    titles={[
                        "Tamanho",
                        "Sabor",
                        "Preço",
                        "Criado em",
                        "Atualizado em",
                    ]}
                />
                <TableRows>
                    {items.map((i) => {
                        return <PizzaCatalogTableRow key={i.id} item={i} clazzName="grid-cols-5" />;
                    })}
                </TableRows>
            </Table>
        </Container>
    )
}

interface PizzaCatalogTableRowProps {
    item: PizzasCatalogItem
    clazzName?: string;
}

function PizzaCatalogTableRow({ item, clazzName }: PizzaCatalogTableRowProps) {
    const navigation = useNavigation()

    return (

        <Form method="post" >
            <TableRow
                row={item}
                isProcessing={navigation.state !== "idle"}
                clazzName={`${clazzName}`}
            >
                <div>
                    <Input type="hidden" name="id" value={item.id} />
                    <Input type="hidden" name="size" value={jsonStringify(item.size)} />
                    <Input type="hidden" name="product" value={jsonStringify(item.product)} />
                    <Input name="size-name" defaultValue={item.size.name} className="border-none w-full" readOnly />
                </div>
                <Input name="topping-name" defaultValue={item.topping.name} className="border-none w-full" readOnly />
                <Input name="unitPrice" defaultValue={item.unitPrice} className="border-none w-full" />
                <Input name="unitPromotionPrice" defaultValue={item.unitPromotionPrice} className="border-none w-full" />
            </TableRow>
        </Form>
    )
}