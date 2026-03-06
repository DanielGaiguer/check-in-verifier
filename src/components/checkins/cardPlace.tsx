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

  placeState?: CheckinPlaceSubmit // ✅ Removido o '?' para obrigar a ter valor

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
  // useEffect(() => {
  //   console.log('🎴 CardPlace - place.id:', place.id)
  //   console.log('🎴 CardPlace - placeState:', placeState)
  //   console.log('🎴 CardPlace - status:', placeState?.status)
  // }, [place.id, placeState])

  const status = placeState?.status ?? undefined
  const observation = placeState?.observation ?? ''
  const selectedIssues = placeState?.issues ?? []
  const photos = placeState?.photos ?? []
  //console.log(placeState)

  const [open, setOpen] = useState(false)

  const [statusState, setStatusState] = useState(status)
  const [observationState, setObservationState] = useState(observation)
  const [selectedIssuesState, setSelectedIssuesState] = useState(selectedIssues)
  const [photoState, setPhotoState] = useState(photos)

  const handleClickCard = () => {
    if (statusState === 'disorganized') {
      setOpen((prev) => !prev)
    }
  }

  useEffect(() => {
    setStatusState(placeState?.status ?? undefined)
  }, [placeState?.status])

  return (
    <>
      <Item
        variant="outline"
        key={place.id}
        onClick={() =>
          statusState === 'disorganized' && setOpen((prev) => !prev)
        }
        className={`h-21 rounded-e-sm border-black ${
          statusState === 'organized'
            ? 'border-white bg-green-300'
            : statusState === 'disorganized'
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
            {!statusState && (
              <span>Selecione se o local está organizado ou não</span>
            )}
          </ItemDescription>
        </ItemContent>

        <ItemActions
          className={`mb-1 flex items-center gap-2 ${statusState ? '' : 'mr-10.5 mb-3'}`}
        >
          <Checkbox
            className="h-7 w-7"
            id={`organized-${place.id}`}
            checked={statusState === 'organized'}
            onCheckedChange={(checked) => {
              let newStatus: 'organized' | 'disorganized' | undefined
              if (statusState === 'organized') {
                newStatus = undefined // desmarca ao clicar de novo
              } else {
                newStatus = 'organized'
              }
              setStatusState(newStatus)
              setPlaceState(place.id, { status: newStatus })
            }}
          />
          <label htmlFor={`organized-${place.id}`}>Organizado</label>

          <Checkbox
            className="h-7 w-7"
            id={`disorganized-${place.id}`}
            checked={statusState === 'disorganized'}
            onCheckedChange={(checked) => {
              let newStatus: 'organized' | 'disorganized' | undefined
              if (statusState === 'disorganized') {
                newStatus = undefined // desmarca ao clicar de novo
              } else {
                newStatus = 'disorganized'
              }
              setOpen(true)
              setStatusState(newStatus)
              setPlaceState(place.id, { status: newStatus })
            }}
          />
          <label htmlFor={`disorganized-${place.id}`}>Desorganizado</label>

          {statusState === 'disorganized' && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-7.5"
              onClick={() => setOpen((prev) => prev)}
            >
              <ChevronDownIcon
                className={`transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </Button>
          )}

          {statusState === 'organized' && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-7.5"
              onClick={() => setOpen((prev) => !prev)}
            >
              <CheckCircle />
            </Button>
          )}
        </ItemActions>
      </Item>

      <Collapsible open={open && statusState === 'disorganized'}>
        <CollapsibleContent className="-mt-1 mb-1 w-full overflow-hidden">
          <div className="-mt-2 w-full rounded-b-md border-2 border-t-0 border-black bg-red-300 p-2">
            <FieldGroup className="w-full max-w-xs p-2">
              <FieldSet>
                <FieldGroup className="gap-3 pl-3">
                  {issues.map((issue) => (
                    <Field orientation="horizontal" key={issue.description}>
                      <Checkbox
                        id={issue.description}
                        className="h-8 w-8"
                        checked={selectedIssuesState.includes(
                          issue.description
                        )}
                        onCheckedChange={(checked) => {
                          const newArray = checked
                            ? [...selectedIssuesState, issue.description]
                            : selectedIssuesState.filter(
                                (description) =>
                                  description !== issue.description
                              )
                          setSelectedIssuesState(newArray)
                          console.log(newArray)
                          setPlaceState(place.id, { issues: newArray })
                        }}
                      />
                      <FieldLabel
                        htmlFor={issue.id}
                        className="text-lg font-normal"
                      >
                        {issue.description}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>

            <Field className="p-4 pl-5">
              <FieldLabel
                htmlFor="textarea-message"
                className="mt-2 -mb-2 text-lg"
              >
                Adicionar descrição
              </FieldLabel>
              <Textarea
                className="p-3"
                id="textarea-message"
                value={observationState}
                placeholder="Adicione aqui a descrição do Check-in."
                onChange={(e) => {
                  setObservationState(e.target.value)
                  setPlaceState(place.id, { observation: e.target.value })
                }}
              />
            </Field>

            <div className="mb-2 flex flex-col items-center pl-5">
              <Field>
                <FieldLabel className="text-lg">Adicionar Arquivos</FieldLabel>
              </Field>
              <FileUploadCircularProgress
                onFileUploaded={(photo) =>
                  setPlaceState(place.id, (prev) => ({
                    photos: [...(prev.photos ?? []), photo],
                  }))
                }
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
