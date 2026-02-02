import CardPlace from '@/components/checkins/cardPlace'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
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
        <h1 className="font-title mt-1 mb-3 font-medium tracking-tight">
          Checar os Seguintes Locais
        </h1>
        <div className="space-y-4">
          {data.labs?.map((lab) => (
            <div key={lab.id}>
              <Badge variant="default" className="mb-2 w-fit">
                {lab.name}
              </Badge>

              <div className="mt-2 ml-4 flex w-full flex-col gap-1">
                {data.places
                  ?.filter((place) => place.labId === lab.id)
                  .map((place) => (
                    <CardPlace key={place.id} place={place} issues={data.issues}/>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
