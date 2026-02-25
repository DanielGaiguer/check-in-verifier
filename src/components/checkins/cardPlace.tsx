'use client'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Checkbox } from '../ui/checkbox'
import { Dispatch, SetStateAction, useState } from 'react'
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
  //“Uma função (Dispatch) que recebe ou um array de UploadedImage 
  // ou uma função que recebe o array anterior e devolve um novo array”
  setImageState: Dispatch<SetStateAction<UploadedImage[]>>
}

export const CardPlace = ({ place, issues, setImageState }: PlaceProtocol) => {
  const [status, setStatus] = useState<'organized' | 'disorganized' | null>(
    null
  )

  const [open, setOpen] = useState(false)

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
        <ItemContent>
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
            onCheckedChange={(checked) =>
              setStatus(checked ? 'organized' : null)
            }
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
              <FileUploadCircularProgress onFileUploaded={(data) => {
                setImageState((prev) => [...prev, data])
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
