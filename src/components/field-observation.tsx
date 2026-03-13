import { Field, FieldDescription } from "./ui/field";
import { Textarea } from "./ui/textarea";

export default function FieldObservation() {
	return (
		<Field className="mt-6 gap-1">
			<FieldDescription className="text-black gap-0">Observação (Opcional) </FieldDescription>
			<FieldDescription>
				<Textarea placeholder="Adicione uma observação..." className="font-stretch-150% gap-0 h-23"/>
			</FieldDescription>
		</Field>
	)
}