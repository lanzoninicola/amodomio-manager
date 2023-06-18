
import Fieldset from "~/components/ui/fieldset";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";




export default function UnitSelector() {

    return (
        <Fieldset>
            <div className="md:max-w-[150px]">
                <Label htmlFor="unit">Unidade</Label>
                <Select name="unit" required defaultValue="gr">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent id="unit"  >
                        <SelectGroup >
                            <SelectItem value="gr">GR</SelectItem>
                            <SelectItem value="un">UN</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </Fieldset>
    )
}