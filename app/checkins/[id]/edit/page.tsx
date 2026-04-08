'use client'

import FieldObservation from '@/components/field-observation'
import PlaceCard from '@/components/place-card'
import SelectCard from '@/components/select-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Problem, Photo, Item } from '@/types/typesPayload'
import { useParams, useRouter } from 'next/navigation'
import { useDetailsCheckin } from '@/hooks/useQuerys/useDetailsCheckin'

export default function EditCheckinPage() {
  const router = useRouter()
  const params = useParams()

  const id =
    params?.id && !Array.isArray(params.id) ? params.id : params?.id?.[0]

  const { data: checkin, isLoading, error } = useDetailsCheckin(id || '')

  const [selectedPersonId, setSelectedPersonId] = useState('')
  const [generalObservation, setGeneralObservation] = useState('')

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

  useEffect(() => {
    if (!checkin) return

    setSelectedPersonId(checkin.people.id)
    setGeneralObservation(checkin.observation || '')

    const status: Record<string, 'organized' | 'disorganized'> = {}
    const problems: Record<string, Problem[]> = {}
    const observations: Record<string, string> = {}
    const photos: Record<string, Photo[]> = {}

    checkin.items.forEach((item: Item) => {
      const placeId = item.place.id
      status[placeId] = item.status as 'organized' | 'disorganized'
      problems[placeId] = item.problems || []
      observations[placeId] = item.observation || ''
      photos[placeId] = item.photos || []
    })

    setPlaceStatus(status)
    setItemProblems(problems)
    setItemObservations(observations)
    setItemFiles(photos)
  }, [checkin])

  // useEffect(() => {
  //   console.log(itemFiles)
  // }, [itemFiles])

  if (isLoading) return <p>Carregando...</p>
  if (error || !checkin) return <p>Erro ao carregar o check-in.</p>

  async function handleSubmit() {
    if (!selectedPersonId) {
      toast.error('Campo Responsável é obrigatório.')
      return
    }

    const unfilledPlaces = checkin!.items.filter(
      (item) => placeStatus[item.place.id] === undefined
    )

    if (unfilledPlaces.length > 0) {
      toast.error('Todos os lugares precisam ter um status definido.')
      return
    }

    const items: Item[] = checkin!.items.map((item) => ({
      itemId: item.itemId,
      place: item.place,
      status: placeStatus[item.place.id]!,
      observation: itemObservations[item.place.id] || '',
      problems: itemProblems[item.place.id] || [],
      photos: itemFiles[item.place.id] || [],
    }))


    const payload = {
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      peopleId: selectedPersonId,
      observation: generalObservation,
      placeCount: items.length,
      items,
    }

    try {
      const response = await fetch(`/api/checkins/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!data.success) {
        toast.error('Erro ao salvar check-in: ' + data.error)
        return
      }

      toast.success('Check-in atualizado com sucesso!')
      router.push('/')
    } catch (err) {
      toast.error('Erro na requisição: ' + err)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <h1 className="font-sans text-2xl font-semibold tracking-tight">
          Editar Check-in
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

        {checkin.items.map((item: Item) => {
          const place = item.place
          const problemsArray = itemProblems[place.id] || []
          const photosArray = itemFiles[place.id] || []
          return (
            <PlaceCard
              key={place.id}
              title={place.name}
              subTitle={place.labName}
              observation={itemObservations[place.id]}
              arrayProblems={problemsArray.map((p: Problem) => ({
                problemId: p.problemId,
                name: p.name,
              }))}
              status={placeStatus[place.id]}
              selectedProblems={itemProblems[place.id]}
              onStatusChange={(status) =>
                setPlaceStatus((prev) => ({ ...prev, [place.id]: status }))
              }
              onProblemsChange={(problems) =>
                setItemProblems((prev) => ({ ...prev, [place.id]: problems }))
              }
              onObservationChange={(obs) =>
                setItemObservations((prev) => ({ ...prev, [place.id]: obs }))
              }
              onFilesChange={(files) =>
                setItemFiles((prev) => ({ ...prev, [place.id]: files }))
              }
              initialPhotos={photosArray}
            />
          )
        })}

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
            Salvar Alterações
          </Button>
        </div>
      </div>
    </main>
  )
}
