'use client'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Checkbox } from '../ui/checkbox'
import { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../ui/field'
import { FileUploadCircularProgress } from '../drop-files'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import {
  CheckCheckIcon,
  CheckCircle,
  CheckIcon,
  ChevronDownIcon,
} from 'lucide-react'

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

  const [open, setOpen] = useState(false)

  return (
    <>
      <Item
        variant="outline"
        key={place.id}
        className={`rounded-e-sm border-black ${
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
            onCheckedChange={(checked) => {
              setStatus(checked ? 'disorganized' : null)
              setOpen(!!checked)
            }}
          />
          <label htmlFor={`disorganized-${place.id}`}>Desorganizado</label>

          {status === 'disorganized' && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-6"
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
            <div className="flex flex-col items-center">
              <Field className="p-4 pl-5">
                <FieldLabel htmlFor="textarea-message" className="mt-2 -mb-2">
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
                <FieldLabel>Adicionar Arquivos</FieldLabel>
              </Field>
              <FileUploadCircularProgress />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Collapsible fora do Item, mas colado */}
      {/* <Collapsible open={status === 'disorganized'}>
        
      </Collapsible> */}
    </>
  )
}

export default CardPlace
