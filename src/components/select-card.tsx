'use client'
import { Card, CardHeader } from "./ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

interface selectCardProps{
  textHeader: string
  placeHolder: string
  options?: string[]
}

//TODO: Deixar interativo e retirar o hardCode, adicionar estado

export default function SelectCard({textHeader, placeHolder, options}: selectCardProps) {
	return (
		<Card className="mt-5">
			<CardHeader>
				<h6 className="font-semibold text-sm">{textHeader}</h6>
    <Select>
      <SelectTrigger className="w-full max-w-80">
        <SelectValue placeholder={placeHolder} className="text-sm"/>
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