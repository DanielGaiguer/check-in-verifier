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
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'

interface PlaceProtocol {
  id: string
  name: string
  labId: string
}

export const CardPlace = (place: PlaceProtocol) => {
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
              ? 'rounded-b-none border-2 border-b-0 bg-red-300 mb-0'
              : 'bg-gray-300'
        }`}
      >
        <ItemContent>
          <ItemTitle className='mt-1 text-lg font-semibold tracking-tight'>{place.name}</ItemTitle>
          <ItemDescription className='text-gray-700'>
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
          <div className="w-full rounded-b-md border-2 border-t-0 border-black bg-red-300 p-2 mt-0">
            <FieldGroup className="w-full max-w-xs p-2">
              <FieldSet>
                <FieldGroup className="gap-3">
                  <Field orientation="horizontal">
                    <Checkbox id="finder-pref-9k2-hard-disks-ljj" />
                    <FieldLabel
                      htmlFor="finder-pref-9k2-hard-disks-ljj"
                      className="font-normal"
                      defaultChecked
                    >
                      Hard disks
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="finder-pref-9k2-external-disks-1yg" />
                    <FieldLabel
                      htmlFor="finder-pref-9k2-external-disks-1yg"
                      className="font-normal"
                    >
                      External disks
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="finder-pref-9k2-cds-dvds-fzt" />
                    <FieldLabel
                      htmlFor="finder-pref-9k2-cds-dvds-fzt"
                      className="font-normal"
                    >
                      CDs, DVDs, and iPods
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="finder-pref-9k2-connected-servers-6l2" />
                    <FieldLabel
                      htmlFor="finder-pref-9k2-connected-servers-6l2"
                      className="font-normal"
                    >
                      Connected servers
                    </FieldLabel>
                  </Field>
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
