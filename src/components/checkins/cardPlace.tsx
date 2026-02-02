'use client'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Checkbox } from '../ui/checkbox'
import { useState } from 'react'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { Select, SelectContent, SelectItem } from '../ui/select'
import { SelectTrigger, SelectValue } from '@radix-ui/react-select'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../ui/field'

interface PlaceProtocol {
  place: {
    id: string
    name: string
    labId: string
  }
  issues: {
    id: string
    code: string
    description: string
  }[]
}

export const CardPlace = ({ place, issues }: PlaceProtocol) => {
  const [status, setStatus] = useState<'organized' | 'disorganized' | null>(
    null
  )
  return (
    <>
      <Item
        variant="outline"
        key={place.id}
        className={`rounded-e-sm border-black ${
          status === 'organized'
            ? 'border-white bg-green-300'
            : status === 'disorganized'
              ? 'mb-0 rounded-b-none border-2 border-b-0 bg-red-300'
              : 'bg-gray-300'
        }`}
      >
        <ItemContent>
          <ItemTitle className="mt-1 text-lg font-semibold tracking-tight">
            {place.name}
          </ItemTitle>
          <ItemDescription className="text-gray-700">
            Selecione se o local está organizado ou não
          </ItemDescription>
        </ItemContent>

        <ItemActions className="flex items-center gap-2">
          {/* Organizado */}
          <Checkbox
            id={`organized-${place.id}`}
            checked={status === 'organized'}
            onCheckedChange={(checked) =>
              setStatus(checked ? 'organized' : null)
            }
          />
          <label htmlFor={`organized-${place.id}`}>Organizado</label>

          {/* Desorganizado */}
          <Checkbox
            id={`disorganized-${place.id}`}
            checked={status === 'disorganized'}
            onCheckedChange={(checked) =>
              setStatus(checked ? 'disorganized' : null)
            }
          />
          <label htmlFor={`disorganized-${place.id}`}>Desorganizado</label>
        </ItemActions>
      </Item>

      {/* Collapsible fora do Item, mas colado */}
      <Collapsible open={status === 'disorganized'}>
        <CollapsibleContent className="-mt-1 max-h-0 w-full overflow-hidden transition-all duration-500 ease-out data-[state=open]:max-h-96">
          <div className="mt-0 w-full rounded-b-md border-2 border-t-0 border-black bg-red-300 p-2">
            <FieldGroup className="w-full max-w-xs p-2">
              <FieldSet>
                <FieldGroup className="gap-3">
                  {issues.map((issue) => (
                      <Field orientation="horizontal" key={issue.id}>
                        <Checkbox id={issue.id} />
                        <FieldLabel
                          htmlFor={issue.id}
                          className="font-normal"
                          defaultChecked
                        >
                          {issue.description}
                        </FieldLabel>
                      </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default CardPlace
