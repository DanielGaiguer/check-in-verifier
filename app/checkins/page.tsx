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
import { CheckinsSkeleton } from '@/components/checkins-skeleton'
import ErrorPage from '@/components/error-page'

export interface CheckinPayload {
  date: string
  createdAt: string
  peopleId: string
  unitId: string
  observation?: string
  placeCount: number
  items: Item[]
}

export default function CheckinsPage() {
  const { places, isLoading: isLoadingPlace, error: errorPlace } = usePlaces()
  const router = useRouter()

  const [selectedPersonId, setSelectedPersonId] = useState<string>('')
  const [selectedUnitId, setSelectedUnitId] = useState('')
  const [generalObservation, setGeneralObservation] = useState<string>('')

  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const filteredPlaces = places.filter(place => place.unitId === selectedUnitId)

  if (isLoadingPlace) return <CheckinsSkeleton />
  if (errorPlace) return <ErrorPage />

  async function handleSubmit() {
    if (isSubmitting) return

    if (!selectedPersonId) {
      toast.error('Campo Responsável é obrigatório.')
      return
    }
    if (!selectedUnitId) {
      toast.error('Campo Unidade é obrigatório.')
      return
    }

    const unfilledPlaces = filteredPlaces.filter(
      (place) => placeStatus[place.id] === undefined
    )
    if (unfilledPlaces.length > 0) {
      toast.error('Todos os lugares precisam ter um status definido.')
      return
    }

    setIsSubmitting(true)

    const items: Item[] = filteredPlaces.map((place) => ({
      itemId: place.id,
      place: {
        id: place.id,
        name: place.name,
        unitId: place.unitId,
        labName: place.labName,
        order: place.order,
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
      unitId: selectedUnitId,
      observation: generalObservation,
      placeCount: items.length,
      items,
    }

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Check-in realizado com sucesso!')
        setPlaceStatus({})
        setItemProblems({})
        setItemObservations({})
        setItemFiles({})
        setGeneralObservation('')
        setSelectedPersonId('')
        setSelectedUnitId('')
        router.push('/')
      } else {
        toast.error('Erro ao salvar check-in: ' + data.error)
      }
    } catch (err) {
      toast.error('Erro na requisição: ' + err)
    } finally {
      setIsSubmitting(false)
    }
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
            param="people"
          />
        </div>
        <div className="mt-3 mb-3">
          <SelectCard
            textHeader="Unidade *"
            placeHolder="Selecione a unidade"
            onChange={setSelectedUnitId}
            param="unit"
          />
        </div>

        {filteredPlaces.map((place) => (
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
            disabled={isSubmitting}
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
