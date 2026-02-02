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
      <Item
        variant="outline"
        key={place.id}
        className={`rounded-e-sm mb-3 border-black ${
          status === "organized"
            ? "bg-green-300 border-white"
            : status === "disorganized"
            ? "bg-red-300 border-2"
            : "bg-gray-300"
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
            checked={status === "organized"}
            onCheckedChange={(checked) =>
              setStatus(checked ? "organized" : null)
            }
          />
          <label htmlFor={`organized-${place.id}`}>Organizado</label>

          {/* Desorganizado */}
          <Checkbox
            id={`disorganized-${place.id}`}
            checked={status === "disorganized"}
            onCheckedChange={(checked) =>
              setStatus(checked ? "disorganized" : null)
            }
          />
          <label htmlFor={`disorganized-${place.id}`}>Desorganizado</label>
        </ItemActions>
      </Item>
    );
}

export default CardPlace
