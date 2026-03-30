'use client'
import FieldObservation from '@/components/field-observation'
import PlaceCard from '@/components/place-card'
import SelectCard from '@/components/select-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePeople } from '@/hooks/useQuerys/usePeoples'
import { usePlaces } from '@/hooks/useQuerys/usePlaces'
import { useState } from 'react'
import { toast } from 'react-toastify'
// Foto relacionada a um problema
export interface Photo {
  photoId: string
  url: string
}

// Problema encontrado em um item
export interface Problem {
  problemId: string
  name: string
  photos: Photo[]
}

// Local do item
export interface Place {
  id: string
  name: string
  labId: string
  labName: string
}

// Item do check-in
export interface Item {
  itemId: string
  place: Place
  status: 'organized' | 'disorganized' // mais seguro do que booleano
  observation?: string
  problems?: Problem[]
}

// Pessoa responsável
export interface People {
  id: string
  name: string
}

// Registro de edições (opcional)
export interface Edits {
  id: string
  editedBy: string
  reason: string
  createdAt: string
}

// Payload do check-in
export interface CheckinPayload {
  date: string // ISO string, ou Date
  createdAt: string // ISO string
  peopleId: string // referência à pessoa responsável
  observation?: string
  placeCount: number
  items: Item[]
  edits?: Edits[]
}
export interface Checkin {
  // checkinId: string
  date: string // ou Date, se você fizer parse
  createdAt: string
  people: People
  observation: string
  placeCount: number
  items: Item[]
  edits: Edits[]
}

//Todo: Fazer estados e dados necessarios
export default function CheckinsPage() {
  const { people, isLoading: isLoadingPeople, error: errorPeople } = usePeople()
  const { places, isLoading: isLoadingPlace, error: errorPlace } = usePlaces()
  const [selectedPersonId, setSelectedPersonId] = useState<string>('')
  const [generalObservation, setGeneralObservation] = useState<string>('')
  const [placeStatus, setPlaceStatus] = useState<
    Record<string, 'organized' | 'disorganized'>
  >({})
  const [itemProblems, setItemProblems] = useState<Record<string, Problem[]>>(
    {}
  )
  const [itemObservations, setItemObservations] = useState<
    Record<string, string>
  >({})

  if (isLoadingPeople || isLoadingPlace) return <p>Carregando...</p>
  if (errorPeople || errorPlace) return <p>Erro ao carregar os lugares.</p>

  function handleSubmit() {
    if (!selectedPersonId) {
      toast.error('Campo Responsável é obrigatório.')
      return
    }

    // Verifica se todos os lugares têm status definido
    const unfilledPlaces = places.filter(
      (place) => placeStatus[place.id] === undefined
    )

    if (unfilledPlaces.length > 0) {
      toast.error('Todos os lugares precisam ter um status definido.')
      return
    }

    // Monta o payload com todos os lugares
    const items: Item[] = places.map((place) => ({
      itemId: place.id,
      place: place,
      status: placeStatus[place.id]!, // sabemos que não é undefined
      observation: itemObservations[place.id],
      problems: itemProblems[place.id] || [],
    }))

    const payload: CheckinPayload = {
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      peopleId: selectedPersonId,
      observation: generalObservation,
      placeCount: items.length,
      items,
    }

    console.log('Payload a enviar:', payload)

    // Aqui vai o fetch POST
    // fetch('/api/checkins', { method: 'POST', headers: {...}, body: JSON.stringify(payload) })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <h1 className="font-sans text-2xl font-semibold tracking-tight">
          Novo Check-in
        </h1>
        <h4 className="text-sm text-gray-500">
          Preencha o status de cada lugar
        </h4>``
        <div>
          <SelectCard
            textHeader="Responsável *"
            placeHolder="Selecione a pessoa"
            onChange={setSelectedPersonId}
          />
        </div>
        <div className="mt-3 mb-3">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              title={place.name}
              subTitle={place.labName}
              arrayProblems={
                place.problems?.map((p) => ({
                  problemId: p.id, // renomeia id -> problemId
                  name: p.name,
                  photos: [], // coloca array vazio se não houver fotos
                })) || []
              }
            />
          ))}
        </div>
        <div>
          <Card className="mt-3">
            <CardContent>
              <FieldObservation
                description="Observação geral do check-in (opcional)"
                placeholder="Observação geral..."
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
