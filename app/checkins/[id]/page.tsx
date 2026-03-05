'use client'
import { Field, FieldLabel } from '@/components/ui/field'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Select } from 'react-day-picker'
import CircularProgress from "@mui/material/CircularProgress";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { SelectDateToday } from '@/components/checkins/selectDateToday'
import { Badge } from 'lucide-react'
import CardPlace from '@/components/checkins/cardPlace'
import Button from '@mui/material/Button'
import { getDataForCheckin } from '@/services/checkins/checkinsServices'
import { GetDataForCheckinProtocol } from '@/types/dataForCheckinProtocol'

interface CheckinPlaceFormatted {
  id: string;
  checkinId: string;
  place: string;
  lab: string;
  status: string;
  observation: string | null;
  issues: string[];
  photos: string[];
  lastActions: string[];
  lastReasons: string[];
  auditCreatedAt: Date[];
}

type CheckinData = {
  userName: string;
  date: string; 
}

type checkinPayload = { 
  checkin: CheckinData,
  places: CheckinPlaceFormatted[]
}


export default function CheckinDetailPage() {
  const params = useParams()
  const id = params.id
  const [data, setData] = useState<checkinPayload | null>(null)
  const [loading, setLoading] = useState(true)
  // const [date, setDate] = useState<Date | undefined>(new Date())
  // const [checkinPlacesState, setCheckinPlacesState] = useState<
  //   Record<string, CheckinPlaceSubmit>
  // >({})
  // const [selectUserId, setSelectUserId] = useState<
  //   CheckinSubmit['userId'] | undefined
  // >(undefined)
  const [initialDataCheckin, setInitialDataCheckin] = useState<GetDataForCheckinProtocol | null>(null)


  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/checkins/${id}`)

      if (!res.ok) {
        console.error('Erro no fetch:', res.status)
        setLoading(false)
        return
      }

      const json = await res.json()
      setData(json)
      setLoading(false)
    }

    async function fetchInitialData() {
      const res = await getDataForCheckin()

      setInitialDataCheckin(res)
    }

    fetchData()
    fetchInitialData()
  }, [id])


  const handleSubmit = () => {}

  if (loading) return (
    <div className="flex h-screen items-center justify-center -translate-y-30">
      <CircularProgress size={60} thickness={1}/>
    </div>
  )

  // return (
  //   <main className="flex flex-col items-center justify-center">
  //     <div className="flex w-full flex-col items-center justify-center p-4 lg:w-[60%]">
  //       <h1 className="font-title mt-1 text-lg font-semibold tracking-tight">
  //         Criar um Novo Check-in
  //       </h1>
  //       <Field className="w-full max-w-150 p-3">
  //         {/* data-invalid */}
  //         <FieldLabel className="text-md">
  //           Quem está realizando o Check-in?
  //         </FieldLabel>
  //         <Select
  //           value={selectUserId}
  //           onValueChange={(value) => setSelectUserId(value)}
  //         >
  //           <SelectTrigger className="border-gray-700 bg-gray-900">
  //             {/* aria-invalid */}
  //             <SelectValue placeholder="Selecione um usuário" />
  //           </SelectTrigger>
  //           <SelectContent>
  //             <SelectGroup>
  //               <SelectLabel className="p-1 text-sm text-gray-600">
  //                 Usuários
  //               </SelectLabel>
  //               {data.users?.map((user) => (
  //                 <SelectItem value={user.id} key={user.id}>
  //                   {user.name}
  //                 </SelectItem>
  //               ))}
  //             </SelectGroup>
  //           </SelectContent>
  //         </Select>
  //         {/* <FieldError>Please select a fruit.</FieldError> */}
  //         <SelectDateToday
  //           textLabel="Qual a data do check-in?"
  //           date={date}
  //           setDate={setDate}
  //         />
  //       </Field>
  //       <h1 className="font-title mt-2 mb-3 font-medium tracking-tight">
  //         Checar os Seguintes Locais
  //       </h1>
  //       <div className="w-[95%] space-y-4">
  //         {data.labs?.map((lab) => (
  //           <div key={lab.id}>
  //             <Badge variant="default" className="mb-2 w-fit">
  //               {lab.name}
  //             </Badge>

  //             <div className="mt-2 ml-4 flex w-full flex-col gap-1">
  //               {data.places
  //                 ?.filter((place) => place.labId === lab.id)
  //                 .map((place) => (
  //                   <CardPlace
  //                     key={place.id}
  //                     place={place}
  //                     issues={data.issues}
  //                     //placeId → o ID do lugar que você quer atualizar.
  //                     // data → pode ser:
  //                     // Um objeto parcial com os campos que quer atualizar.
  //                     // Uma função que recebe o estado atual daquele lugar e retorna os campos que quer atualizar.
  //                     setPlaceState={(placeId, data) =>
  //                       setCheckinPlacesState((prev) => ({
  //                         //Aqui usamos a forma funcional de setState do React, que recebe o estado anterior (prev) e retorna o novo estado. Isso garante que estamos atualizando o estado com segurança, sem sobrescrever alterações feitas por outros lugares ao mesmo tempo.

  //                         ...prev, //Isso espalha (spread) todas as entradas antigas do objeto prev, para não perder os outros lugares.
  //                         //[placeId] → cria ou atualiza a chave referente ao lugar que queremos modificar.
  //                         [placeId]:
  //                           typeof data === 'function' //typeof data === 'function' → verifica se o que foi passado é uma função ou um objeto direto.
  //                             ? {
  //                                 ...prev[placeId],
  //                                 ...data(prev[placeId] || {}),
  //                               }
  //                             : //prev[placeId] || {} → pega o estado atual do lugar ou um objeto vazio se ainda não existir.

  //                               //data(prev[placeId] || {}) → chama a função passada para calcular os novos campos.

  //                               //{ ...prev[placeId], ...data(...) } → combina o estado antigo com os novos campos, garantindo que nenhum campo antigo seja perdido.

  //                               { ...prev[placeId], ...data },
  //                         //Se for objeto direto
  //                         //Apenas combina o estado antigo com os novos dados passados diretamente.

  //                         // Resumo
  //                         //setPlaceState recebe placeId e data.
  //                         // Atualiza apenas o lugar selecionado no estado global.
  //                         // Mantém todos os outros lugares intactos (...prev).
  //                         // Funciona tanto se você passar:
  //                         // Um objeto com os novos campos.
  //                         // Uma função que calcula novos campos com base no estado atual.

  //                         //Exemplo
  //                         // Passando objeto:
  //                         // setPlaceState("place-1", { status: "organized" })

  //                         // Resultado: place-1 agora tem status "organized", fotos continuam intactas.

  //                         // Passando função:
  //                         // setPlaceState("place-2", (prev) => ({
  //                         //   photos: [...(prev.photos || []), "novaFoto.png"]
  //                         // }))

  //                         // Resultado: adiciona "novaFoto.png" às fotos existentes de place-2 sem sobrescrever status.
  //                       }))
  //                     }
  //                   />
  //                 ))}
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //       <Button className="mt-5 mb-5" onClick={handleSubmit}>
  //         Salvar Check-in
  //       </Button>
  //     </div>
  //   </main>
  // )
  return (
    <div>
      <h1>Detalhe do check-in {id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
