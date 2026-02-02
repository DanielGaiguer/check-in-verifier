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

interface PlaceProtocol {
  id: string
  name: string
  labId: string
}

const CardPlace = (place: PlaceProtocol) => {
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
              ? 'border-2 bg-red-300 rounded-b-none'
              : 'bg-gray-300'
        }`}
      >
        <ItemContent>
          <ItemTitle>{place.name}</ItemTitle>
          <ItemDescription>
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
        <CollapsibleContent className="w-full -mt-1">
          <div className="w-full bg-red-800 p-2 rounded-b-md border-x border-b border-black">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione os problemas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="problema1">Problema 1</SelectItem>
                <SelectItem value="problema2">Problema 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default CardPlace
