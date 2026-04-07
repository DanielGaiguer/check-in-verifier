import { Field, FieldDescription } from './ui/field'
import { Textarea } from './ui/textarea'

interface FieldObservationProps {
  description?: string
  placeholder?: string
  class?: string
  value?: string
  onChange?: (value: string) => void
}

export default function FieldObservation({ ...props }: FieldObservationProps) {
  return (
    <Field className={props.class}>
      <FieldDescription className="gap-0 text-black">
        {props.description}
      </FieldDescription>
      <FieldDescription>
        <Textarea
          value={props.value}
          placeholder={props.placeholder}
          className="h-23 gap-0 font-stretch-150%"
          onChange={(e) => props.onChange?.(e.target.value)}
        />
      </FieldDescription>
    </Field>
  )
}
