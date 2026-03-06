'use client'
import { Field, FieldLabel } from '@/components/ui/field'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { SelectDateToday } from '@/components/checkins/selectDateToday'
import Button from '@mui/material/Button'
import { getDataForCheckin } from '@/services/checkins/checkinsServices'
import { GetDataForCheckinProtocol } from '@/types/dataForCheckinProtocol'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CheckinPlaceSubmit } from '@/types/postPayloadCheckin'
import { CardPlace } from '@/components/checkins/cardPlace'
import { checkinPayload } from '@/types/getCheckinPayload'

export default function CheckinDetailPage() {
  const params = useParams()
  const id = params.id
  const [data, setData] = useState<checkinPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined >(new Date())
  const [placeState, setPlacesState] = useState<
    Record<string, CheckinPlaceSubmit>
  >({})
  const [selectUserId, setSelectUserId] = useState<string | undefined>(undefined)
  const [initialDataCheckin, setInitialDataCheckin] =
    useState<GetDataForCheckinProtocol | null>(null)

  const setPlaceState = (
    placeId: string,
    data:
      | Partial<CheckinPlaceSubmit>
      | ((prev: CheckinPlaceSubmit) => Partial<CheckinPlaceSubmit>)
  ) => {
    setPlacesState((prev) => {
      const prevPlace = prev[placeId] ?? {
        placeId,
        status: 'organized' as 'organized' | 'disorganized',
        issues: [],
        photos: [],
        observation: '',
      }
      const newData = typeof data === 'function' ? data(prevPlace) : data
      return {
        ...prev,
        [placeId]: {
          ...prevPlace,
          ...newData,
        },
      }
    })
  }

    useEffect(() => {
      async function fetchAllData() {
        try {
          setLoading(true)

          // 1️⃣ Pega os dados iniciais (Configuração)
          const initialData = await getDataForCheckin()
          setInitialDataCheckin(initialData)  // ✅ Atualiza o estado

          // 2️⃣ Pega os dados do check-in específico
          const res = await fetch(`/api/checkins/${id}`)
          if (!res.ok) throw new Error('Erro no fetch do check-in')
          const checkinJson: checkinPayload = await res.json()
          setData(checkinJson)
          setDate(new Date(checkinJson.checkin.date))

          // 3️⃣ Inicializa o estado dos lugares COM TODOS os lugares do sistema
          const newPlaceState: Record<string, CheckinPlaceSubmit> = {}

          // ✅ CORRETO: Use 'initialData' em vez de 'initialDataCheckin'
          initialData.places.forEach((place) => {
            console.log(`📍 Criando placeState para place.id: ${place.id}`)
            
            // ✅ Busca pelo placeId correto
            const existingPlace = checkinJson.places.find(
              (p) => p.placeId === place.id
            )

            if (existingPlace) {
              // Se existe, usa os dados do check-in
              newPlaceState[place.id] = {
                ...existingPlace,
                photos: existingPlace.photos?.map((url) => ({ url })) ?? [],
              }
            } else {
              // Se não existe, cria com dados padrão
              newPlaceState[place.id] = {
                placeId: place.id,
                status: 'organized' as 'organized' | 'disorganized',
                issues: [],
                photos: [],
                observation: '',
              }
            }
          })

          console.log('✅ placeState final:', newPlaceState)
          console.log('✅ Total de chaves:', Object.keys(newPlaceState).length)

          setPlacesState(newPlaceState)
          setLoading(false)
        } catch (error) {
          console.error(error)
          setLoading(false)
        }
      }

      fetchAllData()
    }, [id])

  // ✅ Debug para verificar o que está no placeState
  // No useEffect, adicione este debug:
  useEffect(() => {
    console.log('🔍 placeState completo:', placeState)
    console.log('🔍 Total de lugares no placeState:', Object.keys(placeState).length)
    console.log('🔍 initialDataCheckin.places:', initialDataCheckin?.places?.map(p => p.id))
    console.log('🔍 Chaves do placeState:', Object.keys(placeState))
  }, [placeState, initialDataCheckin])

  // Lógica para encontrar o userId
  useEffect(() => {
    if (!initialDataCheckin || !data) return

    const normalizeName = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()

    const user = initialDataCheckin.users.find(
      (u) =>
        normalizeName(u.name ?? '') === normalizeName(data.checkin.user ?? '')
    )
    setSelectUserId(user?.id)
  }, [initialDataCheckin, data])

  // Condição de Loading
  if (loading || !initialDataCheckin || !data) {
    return (
      <div className="flex h-screen -translate-y-30 items-center justify-center">
        <CircularProgress size={60} thickness={1} />
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center p-4 lg:w-[60%]">
        <h1 className="font-title mt-1 text-lg font-semibold tracking-tight">
          Editar Check-in
        </h1>
        <Field className="w-full max-w-150 p-3">
          <FieldLabel className="text-md">
            Quem está realizando o Check-in?
          </FieldLabel>
          <Select value={selectUserId} onValueChange={setSelectUserId}>
            <SelectTrigger className="border-gray-700 bg-gray-900">
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="p-1 text-sm text-gray-600">
                  Usuários
                </SelectLabel>
                {initialDataCheckin?.users.map((user) => (
                  <SelectItem value={user.id} key={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <SelectDateToday
            textLabel="Qual a data do check-in?"
            date={date}
            setDate={setDate}
          />
        </Field>
        <h1 className="font-title mt-2 mb-3 font-medium tracking-tight">
          Checar os Seguintes Locais
        </h1>
        <div className="w-[95%] space-y-4">
          {initialDataCheckin?.labs.map((lab) => (
            <div key={lab.id}>
              <Badge variant="default" className="mb-2 w-fit">
                {lab.name}
              </Badge>

              <div className="mt-2 ml-4 flex w-full flex-col gap-1">
                {initialDataCheckin?.places
                  ?.filter((p) => p.labId === lab.id)
                  .map((place) => {
                    // ✅ Garante que o placeState existe
                    const currentPlaceState = placeState[place.id]

                    // ✅ Debug para cada CardPlace
                    console.log(`📍 CardPlace - place.id: ${place.id}, placeState:`, currentPlaceState)

                    return (
                      <CardPlace
                        key={place.id}
                        place={place}
                        issues={initialDataCheckin.issues}
                        placeState={currentPlaceState}
                        setPlaceState={setPlaceState}
                      />
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-5 mb-5" onClick={() => console.log('Salvar')}>
          Salvar Check-in
        </Button>
        <div>
          <h1>Detalhe do check-in {id}</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </main>
  )
}