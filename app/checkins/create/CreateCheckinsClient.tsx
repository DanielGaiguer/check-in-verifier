'use client'
import { CardPlace } from '@/components/checkins/cardPlace'
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
import { SelectDateToday } from '@/components/checkins/selectDateToday'
import { GetDataForCheckinProtocol } from '@/types/dataForCheckinProtocol'
import { SelectLabel } from '@radix-ui/react-select'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { postDataForCheckin } from '@/services/checkins/checkinsServices'
import { CheckinPlaceSubmit, CheckinSubmit } from '@/types/postPayloadCheckin'

type CreateCheckinInput = {
  date: string
  userId: string
  places: {
    placeId: string
    status: 'organized' | 'disorganized'
    issues?: string[]
    photos?: string[]
    observation?: string
  }[]
}

interface CreateCheckinProps {
  data: GetDataForCheckinProtocol
}

export default function CreateCheckinsClient({
  data,
}: CreateCheckinProps) {
  //const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [placesState, setPlacesState] = useState<
    Record<string, CheckinPlaceSubmit>
  >({})

  const [selectUserId, setSelectUserId] = useState<
    CheckinSubmit['userId'] | undefined
  >(undefined)

  
  const setPlaceState = (
    placeId: string,
    data:
      | Partial<CheckinPlaceSubmit>
      | ((prev: CheckinPlaceSubmit) => Partial<CheckinPlaceSubmit>)
  ) => {
    setPlacesState((prev) => {
      const prevPlace = prev[placeId] ?? {}

      const newData =
        typeof data === 'function' ? data(prevPlace) : data

      return {
        ...prev,
        [placeId]: {
          ...prevPlace,
          ...newData,
        },
      }
    })
  }

  const handleSubmit = async () => {
    if (!selectUserId) {
      toast.error('Preencha o campo usuário para continuar.')
      return
    }

    if (!date) {
      toast.error('Preencha o campo data para continuar.')
      return
    }

    const totalPlaces = data.places.length
    const filledPlaces = Object.keys(placesState).length

    if (filledPlaces !== totalPlaces) {
      toast.error('Todos os locais precisam ser avaliados.')
      return
    }

    const payload: CreateCheckinInput = {
      userId: selectUserId,
      date: date.toISOString(),
      places: Object.entries(placesState).map(([placeId, placeData]) =>
        placeData.status == 'disorganized'
          ? {
              placeId,
              status: placeData.status,
              issues: placeData.issues,
              photos: placeData.photos?.map((img) => img.url),
              observation: placeData.observation ?? undefined,
            }
          : {
              placeId,
              status: placeData.status,
            }
      ),
    }

    await postDataForCheckin(payload)
    toast.success('Check-in salvo com sucesso!')
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
            onValueChange={(value) => setSelectUserId(value)}
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
                {data.users?.map((user) => (
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
                        setPlaceState={setPlaceState}
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
}
