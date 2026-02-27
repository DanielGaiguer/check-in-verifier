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
import {
  Collapsible,
  CollapsibleContent,
} from '../ui/collapsible'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '../ui/field'
import { FileUploadCircularProgress } from '../drop-files'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { CheckCircle, ChevronDownIcon } from 'lucide-react'
import { photos } from '@/db/schema'

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
  
  //placeId: o id do lugar que quer atualizar, tanto no backend quanto no estado
  // data: os dados que voce quer aplicar no estado daquele lugar do ID

  //Partial<CheckinPlaceSubmit>:
  // CheckinPlaceSubmit é provavelmente um objeto com vários campos, Partial<CheckinPlaceSubmit> significa que você não precisa enviar todos os campos, apenas os que quer atualizar:

  //((prev: CheckinPlaceSubmit) => Partial<CheckinPlaceSubmit>) 
  // Alternativamente, data pode ser uma função que recebe o estado atual (prev) do lugar e retorna os dados que devem ser atualizados.
  // Isso é útil quando você quer atualizar algo baseado no valor atual do lugar, como adicionar uma foto sem sobrescrever as antigas:

  //Resumindo em palavras simples
    // O setPlaceState é uma função que:
    // Recebe o ID de um lugar.
    // Recebe os dados a atualizar, que podem ser:
    // Um objeto direto com os campos que você quer mudar.
    // Uma função que calcula os campos a mudar usando o estado atual.
    // Atualiza o estado do lugar sem retornar nada.

  setPlaceState: (placeId: string, data: Partial<CheckinPlaceSubmit> | ((prev: CheckinPlaceSubmit) => Partial<CheckinPlaceSubmit>)) => void;
}

export const CardPlace = ({ place, issues, setPlaceState }: PlaceProtocol) => {
  const [status, setStatus] = useState<'organized' | 'disorganized' | null>(
    null
  )

  const [open, setOpen] = useState(false)

  const handleClickCard = () => {
    if (status === 'disorganized'){
      if (open){
        setOpen(false)
        return
      }
      setOpen(true);
    } 
  } 

  return (
    <>
      <Item
        variant="outline"
        key={place.id}
        className={`rounded-e-sm border-black h-21 ${
          status === 'organized'
            ? 'border-white bg-green-300'
            : status === 'disorganized'
              ? open
                ? 'mb-0 rounded-b-none border-2 border-b-0 bg-red-300'
                : 'border-2 bg-red-300'
              : 'bg-gray-300'
        }`}
      >
        <ItemContent onClick={handleClickCard}>
          <ItemTitle className="mt-1 text-lg font-semibold tracking-tight ">
            {place.name}
          </ItemTitle>
          <ItemDescription className="text-gray-700">
            {!status && (
              <span>Selecione se o local está organizado ou não</span>
            )}
          </ItemDescription>
        </ItemContent>

        <ItemActions className="flex items-center gap-2 mb-1">
          {/* Organizado */}
          <Checkbox
            className="h-7 w-7"
            id={`organized-${place.id}`}
            checked={status === 'organized'}
            onCheckedChange={(checked) => {
              const newStatus = checked ? 'organized' : null
              setStatus(newStatus)
              setPlaceState(place.id, { status: newStatus || undefined })
            }}
          />
          <label htmlFor={`organized-${place.id}`}>Organizado</label>

          {/* Desorganizado */}
          <Checkbox
            className='h-7 w-7'
            id={`disorganized-${place.id}`}
            checked={status === 'disorganized'}
            onCheckedChange={(checked) => {
              setStatus(checked ? 'disorganized' : null)
              setOpen(!!checked)
            }}
          />
          <label
            className={`${!status ? 'mr-11' : ''}`}
            htmlFor={`disorganized-${place.id}`}
          >
            Desorganizado
          </label>

          {status === 'disorganized' && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-7"
              onClick={() => setOpen((prev) => !prev)}
            >
              <ChevronDownIcon
                className={`transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </Button>
          )}
        </ItemActions>
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
      </Item>

      <Collapsible
        open={open && status === 'disorganized'}
        onOpenChange={setOpen}
      >
        <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up -mt-1 mb-1 w-full overflow-hidden motion-reduce:transition-none">
          <div className="-mt-2 w-full rounded-b-md border-2 border-t-0 border-black bg-red-300 p-2">
            <FieldGroup className="w-full max-w-xs p-2">
              <FieldSet>
                <FieldGroup className="gap-3 pl-3">
                  {issues.map((issue) => (
                    <Field orientation="horizontal" key={issue.id}>
                      <Checkbox id={issue.id} className='h-8 w-8'/>
                      <FieldLabel
                        htmlFor={issue.id}
                        className="font-normal text-lg"
                        defaultChecked
                      >
                        {issue.description}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
            <div className="flex flex-col items-center">
              <Field className="p-4 pl-5">
                <FieldLabel htmlFor="textarea-message" className="mt-2 -mb-2 text-lg">
                  Adicionar descrição
                </FieldLabel>
                {/* <FieldDescription>Enter your message below.</FieldDescription> */}
                <Textarea
                  className="p-3"
                  id="textarea-message"
                  placeholder="Adicione aqui a descrição do Check-in."
                />
              </Field>
            </div>
            <div className="mb-2 flex flex-col items-center pl-5">
              <Field>
                <FieldLabel className='text-lg'>Adicionar Arquivos</FieldLabel>
              </Field>
              <FileUploadCircularProgress onFileUploaded={(photo) => {
                setPlaceState(place.id, (prev) => ({
                  photos: [...(prev.photos || []), photo]
                }))
              }}/> 
              {/*Aqui vai o estado das fotos */}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default CardPlace
