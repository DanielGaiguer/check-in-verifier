import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Item } from '@/components/ui/item'
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
            <SelectTrigger className="bg-gray-900 border-gray-700">
              {/* aria-invalid */}
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className='text-sm text-gray-600 p-1'>Usuários</SelectLabel>
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
        <h1 className="font-title mt-1 font-medium tracking-tight">
          Checar os Seguintes Locais
        </h1>
        <Item></Item>
      </div>
    </main>
  )
}
