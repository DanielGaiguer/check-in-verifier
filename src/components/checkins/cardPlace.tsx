'use client'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Checkbox } from '../ui/checkbox'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { Field, FieldGroup, FieldLabel, FieldSet } from '../ui/field'
import { FileUploadCircularProgress } from '../drop-files'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { CheckCircle, ChevronDownIcon } from 'lucide-react'
import { photos } from '@/db/schema'
import { CheckinPlaceSubmit } from '@/types/postPayloadCheckin'

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

  placeState?: CheckinPlaceSubmit

  setPlaceState: (
    placeId: string,
    data:
      | Partial<CheckinPlaceSubmit>
      | ((prev: CheckinPlaceSubmit) => Partial<CheckinPlaceSubmit>)
  ) => void
}
export const CardPlace = ({
  place,
  issues,
  placeState,
  setPlaceState,
}: PlaceProtocol) => {

  const status = placeState?.status ?? null
  const observation = placeState?.observation ?? ''
  const selectedIssues = placeState?.issues ?? []
  const photos = placeState?.photos ?? []

  const [open, setOpen] = useState(false)

  const handleClickCard = () => {
    if (status === 'disorganized') {
      setOpen((prev) => !prev)
    }
  }

  return (
    <>
      <Item
        variant="outline"
        key={place.id}
        onClick={handleClickCard}
        className={`h-21 rounded-e-sm border-black ${
          status === 'organized'
            ? 'border-white bg-green-300'
            : status === 'disorganized'
            ? open
              ? 'mb-0 rounded-b-none border-2 border-b-0 bg-red-300'
              : 'border-2 bg-red-300'
            : 'bg-gray-300'
        }`}
      >
        <ItemContent>
          <ItemTitle className="mt-1 text-lg font-semibold tracking-tight">
            {place.name}
          </ItemTitle>

          <ItemDescription className="text-gray-700">
            {!status && (
              <span>Selecione se o local está organizado ou não</span>
            )}
          </ItemDescription>
        </ItemContent>

        <ItemActions className="mb-1 flex items-center gap-2">

          <Checkbox
            className="h-7 w-7"
            checked={status === 'organized'}
            onCheckedChange={(checked) => {
              const newStatus = checked ? 'organized' : undefined

              setPlaceState(place.id, {
                status: newStatus,
              })
            }}
          />

          <label>Organizado</label>

          <Checkbox
            className="h-7 w-7"
            checked={status === 'disorganized'}
            onCheckedChange={(checked) => {
              const newStatus = checked ? 'disorganized' : undefined

              setPlaceState(place.id, {
                status: newStatus,
              })

              if (checked) setOpen(true)
            }}
          />

          <label>Desorganizado</label>

          {status === 'disorganized' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((prev) => !prev)}
            >
              <ChevronDownIcon
                className={`transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Button>
          )}
        </ItemActions>
      </Item>

      <Collapsible open={open && status === 'disorganized'}>
        <CollapsibleContent>

          {issues.map((issue) => (
            <Field orientation="horizontal" key={issue.id}>

              <Checkbox
                checked={selectedIssues.includes(issue.id)}

                onCheckedChange={(checked) => {

                  const newArray = checked
                    ? [...selectedIssues, issue.id]
                    : selectedIssues.filter((id) => id !== issue.id)

                  setPlaceState(place.id, {
                    issues: newArray,
                  })
                }}
              />

              <FieldLabel>{issue.description}</FieldLabel>

            </Field>
          ))}

          <Textarea
            value={observation}
            onChange={(e) => {

              setPlaceState(place.id, {
                observation: e.target.value,
              })
            }}
          />

          <FileUploadCircularProgress
            onFileUploaded={(photo) => {

              setPlaceState(place.id, (prev) => ({
                photos: [...(prev.photos ?? []), photo],
              }))

            }}
          />

        </CollapsibleContent>
      </Collapsible>
    </>
  )
}