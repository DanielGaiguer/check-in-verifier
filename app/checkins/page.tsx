'use client'

import FieldObservation from '@/components/field-observation'
import PlaceCard from '@/components/place-card'
import SelectCard from '@/components/select-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePlaces } from '@/hooks/useQuerys/usePlaces'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Problem, Photo, Item } from '@/types/typesPayload'
import { useRouter } from 'next/navigation'

export interface CheckinPayload {
  date: string
  createdAt: string
  peopleId: string
  observation?: string
  placeCount: number
  items: Item[]
}

export default function CheckinsPage() {
  const { places, isLoading: isLoadingPlace, error: errorPlace } = usePlaces()
  const router = useRouter()

  const [selectedPersonId, setSelectedPersonId] = useState<string>('')
  const [generalObservation, setGeneralObservation] = useState<string>('')

  // Estado por item/lugar
  const [placeStatus, setPlaceStatus] = useState<
    Record<string, 'organized' | 'disorganized'>
  >({})
  const [itemProblems, setItemProblems] = useState<Record<string, Problem[]>>(
    {}
  )
  const [itemObservations, setItemObservations] = useState<
    Record<string, string>
  >({})
  const [itemFiles, setItemFiles] = useState<Record<string, Photo[]>>({})

  if (isLoadingPlace) return <p>Carregando...</p>
  if (errorPlace) return <p>Erro ao carregar os lugares.</p>

  function handleSubmit() {
    if (!selectedPersonId) {
      toast.error('Campo Responsável é obrigatório.')
      return
    }

    const unfilledPlaces = places.filter(
      (place) => placeStatus[place.id] === undefined
    )
    if (unfilledPlaces.length > 0) {
      toast.error('Todos os lugares precisam ter um status definido.')
      return
    }

    const items: Item[] = places.map((place) => ({
      itemId: place.id,
      place: {
        id: place.id,
        name: place.name,
        labName: place.labName,
        labId: place.labId,
      },
      status: placeStatus[place.id]!,
      observation: itemObservations[place.id] || '',
      problems: itemProblems[place.id] || [],
      photos: itemFiles[place.id] || [],
    }))

    const payload: CheckinPayload = {
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      peopleId: selectedPersonId,
      observation: generalObservation,
      placeCount: items.length,
      items,
    }

    fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('Check-in realizado com sucesso!')
          setPlaceStatus({})
          setItemProblems({})
          setItemObservations({})
          setItemFiles({})
          setGeneralObservation('')
          setSelectedPersonId('')
          router.push('/')
        } else {
          toast.error('Erro ao salvar check-in: ' + data.error)
        }
      })
      .catch((err) => toast.error('Erro na requisição: ' + err))
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <h1 className="font-sans text-2xl font-semibold tracking-tight">
          Novo Check-in
        </h1>
        <h4 className="text-sm text-gray-500">
          Preencha o status de cada lugar
        </h4>

        <div className="mt-3 mb-3">
          <SelectCard
            textHeader="Responsável *"
            placeHolder="Selecione a pessoa"
            onChange={setSelectedPersonId}
          />
        </div>

        {places.map((place) => (
          <PlaceCard
            key={place.id}
            title={place.name}
            subTitle={place.labName}
            arrayProblems={
              place.problems?.map((p) => ({ problemId: p.id, name: p.name })) ||
              []
            }
            status={placeStatus[place.id]}
            onStatusChange={(status) =>
              setPlaceStatus((prev) => ({ ...prev, [place.id]: status }))
            }
            selectedProblems={itemProblems[place.id]}
            onProblemsChange={(problems) =>
              setItemProblems((prev) => ({ ...prev, [place.id]: problems }))
            }
            onObservationChange={(obs) =>
              setItemObservations((prev) => ({ ...prev, [place.id]: obs }))
            }
            onFilesChange={(files) =>
              setItemFiles((prev) => ({ ...prev, [place.id]: files }))
            }
          />
        ))}

        <div className="mt-3">
          <Card>
            <CardContent>
              <FieldObservation
                description="Observação geral do check-in (opcional)"
                placeholder="Observação geral..."
                value={generalObservation}
                onChange={setGeneralObservation}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex flex-col items-end">
          <Button
            className="bg-blue-400 p-5.5 text-sm hover:bg-blue-300"
            onClick={handleSubmit}
          >
            Finalizar Check-in
          </Button>
        </div>
      </div>
    </main>
  )
}
