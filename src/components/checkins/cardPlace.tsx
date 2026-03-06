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
        onClick={() => status === 'disorganized' && setOpen((prev) => !prev)}
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
            {!status && <span>Selecione se o local está organizado ou não</span>}
          </ItemDescription>
        </ItemContent>

        <ItemActions className="mb-1 flex items-center gap-2">
          <Checkbox
            className="h-7 w-7"
            id={`organized-${place.id}`}
            checked={status === 'organized'}
            onCheckedChange={(checked) => {
              const newStatus = checked ? 'organized' : undefined
              setPlaceState(place.id, { status: newStatus })
            }}
          />
          <label htmlFor={`organized-${place.id}`}>Organizado</label>

          <Checkbox
            className="h-7 w-7"
            id={`disorganized-${place.id}`}
            checked={status === 'disorganized'}
            onCheckedChange={(checked) => {
              const newStatus = checked ? 'disorganized' : undefined
              setPlaceState(place.id, { status: newStatus })
              if (checked) setOpen(true)
            }}
          />
          <label htmlFor={`disorganized-${place.id}`}>Desorganizado</label>

          {status === 'disorganized' && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-7"
              onClick={() => setOpen((prev) => prev)}
            >
              <ChevronDownIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </Button>
          )}

          {status === 'organized' && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-6"
              onClick={() => setOpen((prev) => !prev)}
            >
              <CheckCircle />
            </Button>
          )}
        </ItemActions>
      </Item>

      <Collapsible open={open && status === 'disorganized'}>
        <CollapsibleContent className="-mt-1 mb-1 w-full overflow-hidden">
          <div className="-mt-2 w-full rounded-b-md border-2 border-t-0 border-black bg-red-300 p-2">

            <FieldGroup className="w-full max-w-xs p-2">
              <FieldSet>
                <FieldGroup className="gap-3 pl-3">
                  {issues.map((issue) => (
                    <Field orientation="horizontal" key={issue.id}>
                      <Checkbox
                        id={issue.id}
                        className="h-8 w-8"
                        checked={selectedIssues.includes(issue.id)}
                        onCheckedChange={(checked) => {
                          const newArray = checked
                            ? [...selectedIssues, issue.id]
                            : selectedIssues.filter((id) => id !== issue.id)

                          setPlaceState(place.id, { issues: newArray })
                        }}
                      />
                      <FieldLabel htmlFor={issue.id} className="text-lg font-normal">
                        {issue.description}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>

            <Field className="p-4 pl-5">
              <FieldLabel htmlFor="textarea-message" className="mt-2 -mb-2 text-lg">
                Adicionar descrição
              </FieldLabel>
              <Textarea
                className="p-3"
                id="textarea-message"
                value={observation}
                placeholder="Adicione aqui a descrição do Check-in."
                onChange={(e) => setPlaceState(place.id, { observation: e.target.value })}
              />
            </Field>

            <div className="mb-2 flex flex-col items-center pl-5">
              <Field>
                <FieldLabel className="text-lg">Adicionar Arquivos</FieldLabel>
              </Field>
              <FileUploadCircularProgress
                onFileUploaded={(photo) =>
                  setPlaceState(place.id, (prev) => ({ photos: [...(prev.photos ?? []), photo] }))
                }
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}