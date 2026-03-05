'use client'
import { Field, FieldLabel } from '@/components/ui/field'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { SelectDateToday } from '@/components/checkins/selectDateToday'
import CardPlace from '@/components/checkins/cardPlace'
import Button from '@mui/material/Button'
import { getDataForCheckin } from '@/services/checkins/checkinsServices'
import { GetDataForCheckinProtocol } from '@/types/dataForCheckinProtocol'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface CheckinPlaceFormatted {
  id: string
  checkinId: string
  place: string
  placeId: string
  lab: string
  status: 'organized' | 'disorganized'
  observation: string | null
  issues: string[]
  photos: string[]
  lastActions: string[]
  lastReasons: string[]
  auditCreatedAt: Date[]
}

type CreateCheckinInput = {
  date: string
  userId: string
  places: {
    placeId: string
    status: 'organized' | 'disorganized'
    issues?: string[]
    photos?: (string | UploadedImage)[]
    observation?: string
  }[]
}


type CheckinData = {
  user: string
  userId: string
  date: string
}

type checkinPayload = {
  checkin: CheckinData
  places: CheckinPlaceFormatted[]
}

export default function CheckinDetailPage() {
  const params = useParams()
  const id = params.id
  const [data, setData] = useState<checkinPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [checkinPlacesState, setCheckinPlacesState] = useState<Record<string, CheckinPlaceFormatted>>({})
  const [selectUserId, setSelectUserId] = useState<string | undefined>(undefined)
  const [initialDataCheckin, setInitialDataCheckin] = useState<GetDataForCheckinProtocol | null>(null)

  useEffect(() => {
    async function fetchAllData() {
      try {
        // 1️⃣ Pega os dados iniciais
        const initialData = await getDataForCheckin()
        setInitialDataCheckin(initialData)

        // 2️⃣ Pega os dados do check-in específico
        const res = await fetch(`/api/checkins/${id}`)
        if (!res.ok) throw new Error('Erro no fetch do check-in')
        const checkinJson: checkinPayload = await res.json()
        setData(checkinJson)
        setDate(new Date(checkinJson?.checkin.date))
        setCheckinPlacesState(checkinJson.places)

        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    fetchAllData()
  }, [id])

  const handleSubmit = () => {
  // const payload: CreateCheckinInput = {
  //   date: date.toISOString(),
  //   userId: selectUserId,
  //   places: Object.values(checkinPlacesState).map((place) => ({
  //     placeId: place.id, // <--- aqui mapeia id para placeId
  //     status: place.status as 'organized' | 'disorganized',
  //     issues: place.issues,
  //     photos: place.photos, // se tiver UploadedImage[], converta para string
  //     observation: place.observation || undefined,
  //   })),
  // }

  //Fazer o metodo POST
  }

  useEffect(() => {
    if (!initialDataCheckin || !data) return

    const normalizeName = (str: string) =>
      str
        .normalize("NFD") // separa acentos
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .trim()
        .toLowerCase()

    const user = initialDataCheckin.users.find(
      (u) => normalizeName(u.name ?? "") === normalizeName(data.checkin.user ?? "")
    )
    setSelectUserId(user?.id)


  }, [initialDataCheckin, data])

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
          Criar um Novo Check-in
        </h1>
        <Field className="w-full max-w-150 p-3">
          {/* data-invalid */}
          <FieldLabel className="text-md">
            Quem está realizando o Check-in?
          </FieldLabel>
          <Select
            value={selectUserId}
            onValueChange={setSelectUserId}
          >
            <SelectTrigger className="border-gray-700 bg-gray-900">
              {/* aria-invalid */}
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
          {/* <FieldError>Please select a fruit.</FieldError> */}
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
                  ?.filter((place) => place.labId === lab.id)
                  .map((place) => (
                    <CardPlace
                      key={place.id}
                      place={place}
                      issues={initialDataCheckin?.issues}
                      setPlaceState={(placeId, data) =>
                        setCheckinPlacesState((prev) => ({
                          ...prev,
                          [placeId]:
                            typeof data === 'function'
                              ? {
                                  ...prev[placeId],
                                  ...data(prev[placeId] || {}),
                                  photos: (data(prev[placeId] || {}) as any).photos?.map((p: any) =>
                                    typeof p === 'string' ? p : p.url
                                  ),
                                }
                              : {
                                  ...prev[placeId],
                                  ...data,
                                  photos: (data as any).photos?.map((p: any) =>
                                    typeof p === 'string' ? p : p.url
                                  ),
                                },
                        }))
                      }
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-5 mb-5" onClick={handleSubmit}>
          Salvar Check-in
        </Button>
      </div>
    </main>
  )
  return (
    <div>
      <h1>Detalhe do check-in {id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
