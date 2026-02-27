'use client'
import CardPlace from '@/components/checkins/cardPlace'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectDateToday }  from '@/components/checkins/selectDateToday';
import { GetDataForCheckinProtocol } from '@/types/dataForCheckinProtocol'
import { SelectLabel } from '@radix-ui/react-select'
import { useEffect, useState } from 'react'

interface CreateCheckinProps {
  data: GetDataForCheckinProtocol
}

export default function CreateCheckinsClient({ data }: CreateCheckinProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [checkinPlacesState, setCheckinPlacesState] = useState<Record<string, CheckinPlaceSubmit>>({});

  const handleSubmit = () => {
    console.log(uploadedImages);
  }

  useEffect(() => {
    console.log(checkinPlacesState)
  }, [checkinPlacesState])

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center p-4 lg:w-[60%]">
        <h1 className="font-title mt-1 text-lg font-semibold tracking-tight">
          Criar um Novo Check-in
        </h1>
        <Field className="w-full max-w-150 p-3">
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
          <SelectDateToday textLabel='Qual a data do check-in?' date={date} setDate={setDate}/>
        </Field>
        <h1 className="font-title mt-2 mb-3 font-medium tracking-tight">
          Checar os Seguintes Locais
        </h1>
        <div className="w-[95%] space-y-4">
          {data.labs?.map((lab) => (
            <div key={lab.id}>
              <Badge variant="default" className="mb-2 w-fit">
                {lab.name}
              </Badge>

              <div className="mt-2 ml-4 flex w-full flex-col gap-1">
                {data.places
                  ?.filter((place) => place.labId === lab.id)
                  .map((place) => (
                    <CardPlace
                      key={place.id}
                      place={place}
                      issues={data.issues}

                      //placeId → o ID do lugar que você quer atualizar.
                      // data → pode ser:
                      // Um objeto parcial com os campos que quer atualizar.
                      // Uma função que recebe o estado atual daquele lugar e retorna os campos que quer atualizar.
                      setPlaceState={(placeId, data) =>
                        setCheckinPlacesState((prev) => ({ //Aqui usamos a forma funcional de setState do React, que recebe o estado anterior (prev) e retorna o novo estado. Isso garante que estamos atualizando o estado com segurança, sem sobrescrever alterações feitas por outros lugares ao mesmo tempo.

                          ...prev, //Isso espalha (spread) todas as entradas antigas do objeto prev, para não perder os outros lugares.
                          [placeId]: //[placeId] → cria ou atualiza a chave referente ao lugar que queremos modificar.
                            typeof data === 'function' //typeof data === 'function' → verifica se o que foi passado é uma função ou um objeto direto.
                              ? { ...prev[placeId], ...data(prev[placeId] || {}) } 
                              //prev[placeId] || {} → pega o estado atual do lugar ou um objeto vazio se ainda não existir.

                              //data(prev[placeId] || {}) → chama a função passada para calcular os novos campos. 

                              //{ ...prev[placeId], ...data(...) } → combina o estado antigo com os novos campos, garantindo que nenhum campo antigo seja perdido.

                              : { ...prev[placeId], ...data },
                              //Se for objeto direto
                              //Apenas combina o estado antigo com os novos dados passados diretamente.

                              // Resumo 
                                //setPlaceState recebe placeId e data.
                                // Atualiza apenas o lugar selecionado no estado global.
                                // Mantém todos os outros lugares intactos (...prev).
                                // Funciona tanto se você passar:
                                // Um objeto com os novos campos.
                                // Uma função que calcula novos campos com base no estado atual.
                              
                              //Exemplo
                                  // Passando objeto:
                                  // setPlaceState("place-1", { status: "organized" })

                                  // Resultado: place-1 agora tem status "organized", fotos continuam intactas.

                                  // Passando função:
                                  // setPlaceState("place-2", (prev) => ({
                                  //   photos: [...(prev.photos || []), "novaFoto.png"]
                                  // }))

                                  // Resultado: adiciona "novaFoto.png" às fotos existentes de place-2 sem sobrescrever status.
                        }))
                      }
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-5 mb-5" onClick={handleSubmit}>Salvar Check-in</Button>
      </div>
    </main>
  )
}
