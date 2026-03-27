'use client'
import FieldObservation from '@/components/field-observation'
import PlaceCard from '@/components/place-card'
import SelectCard from '@/components/select-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePeople } from '@/hooks/useQuerys/usePeoples'
import { usePlaces } from '@/hooks/useQuerys/usePlaces'

//Todo: Fazer estados e dados necessarios
export default function CheckinsPage() {
  const { people, isLoading: isLoadingPeople, error: errorPeople } = usePeople()
  const { places, isLoading: isLoadingPlace, error: errorPlace } = usePlaces()

  if (isLoadingPeople || isLoadingPlace) return <p>Carregando...</p>
  if (errorPeople || errorPlace) return <p>Erro ao carregar os lugares.</p>

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <h1 className="font-sans text-2xl font-semibold tracking-tight">
          Novo Check-in
        </h1>
        <h4 className="text-sm text-gray-500">
          Preencha o status de cada lugar
        </h4>
        <div>
          <SelectCard
            textHeader="Responsável *"
            placeHolder="Selecione a pessoa"
          />
        </div>
        <div className="mt-3 mb-3">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              title={place.name}
              subTitle={place.labName}
              arrayProblems={place.problems}
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
          <Button className="bg-blue-400 p-5.5 text-sm hover:bg-blue-300">
            Finalizar Check-in
          </Button>
        </div>
      </div>
    </main>
  )
}
