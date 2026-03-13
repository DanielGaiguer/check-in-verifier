import { Card, CardHeader } from "./ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export default async function CardResponsible() {
	return (
		<Card className="mt-5">
			<CardHeader>
				<h6 className="font-semibold text-sm">Responsável *</h6>
    <Select>
      <SelectTrigger className="w-full max-w-80">
        <SelectValue placeholder="Selecione a pessoa" className="text-sm"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          <SelectItem value="joao">João</SelectItem>
          <SelectItem value="daniel">Daniel</SelectItem>
          <SelectItem value="isis">Isis</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
			</CardHeader>
		</Card>
	)
}