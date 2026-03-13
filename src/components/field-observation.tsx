import { Field, FieldDescription } from "./ui/field";
import { Textarea } from "./ui/textarea";

interface FieldObservationProps{
	description: string,
	placeholder: string
	class?: string
}

export default function FieldObservation({...props}: FieldObservationProps) {
	return (
		<Field className={props.class}>
			<FieldDescription className="text-black gap-0">{props.description}</FieldDescription>
			<FieldDescription>
				<Textarea placeholder={props.placeholder} className="font-stretch-150% gap-0 h-23"/>
			</FieldDescription>
		</Field>
	)
}