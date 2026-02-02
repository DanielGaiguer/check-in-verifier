import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getDataForCheckin } from '@/services/checkins/checkinsServices'
import { SelectLabel } from '@radix-ui/react-select'

export default async function CreateCheckins() {
  const data = await getDataForCheckin()
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center p-4 lg:w-[45%]">
        <h1 className="font-title mt-1 text-lg font-semibold tracking-tight">
          Criar um Novo Check-in
        </h1>
        <Field className="w-full max-w-120 p-3">
          {/* data-invalid */}
          <FieldLabel className="text-md">
            Quem está realizando o Check-in?
          </FieldLabel>
          <Select>
            <SelectTrigger className="border-gray-700 bg-gray-900">
              {/* aria-invalid */}
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="p-1 text-sm text-gray-600">
                  Usuários
                </SelectLabel>
                {data.users?.map((user) => (
                  <SelectItem value={user.name} key={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* <FieldError>Please select a fruit.</FieldError> */}
        </Field>
        <h1 className="font-title mt-1 font-medium tracking-tight mb-3">
          Checar os Seguintes Locais
        </h1>
        <div className="space-y-4">
          {data.labs?.map((lab) => (
            <div key={lab.id}>
              <Badge variant="default" className="w-fit mb-2">
                {lab.name}
              </Badge>

              <div className="mt-2 ml-4 flex flex-col gap-1 w-full">
                {data.places
                  ?.filter((place) => place.labId === lab.id)
                  .map((place) => (
                    <Item variant="outline" key={place.id} className='rounded-e-sm bg-gray-300 border-black mb-3'>
                      <ItemContent>
                        <ItemTitle>{place.name}</ItemTitle>
                        <ItemDescription>
                          Selecione se o local está organizado ou não
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Checkbox
                          id={`organized-${place.id}`}
                        />{' '}
                        {/* marcado = organizado */}
                        <label className='mr-3' htmlFor={`organized-${place.id}`}>
                          Organizado
                        </label>
                        <Checkbox
                          id={`disorganized-${place.id}`}
                        />{' '}
                        {/* marcado = desorganizado */}
                        <label htmlFor={`disorganized-${place.id}`}>
                          Desorganizado
                        </label>
                      </ItemActions>
                    </Item>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
