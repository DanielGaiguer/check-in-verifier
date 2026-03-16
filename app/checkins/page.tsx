'use client'
import FieldObservation from '@/components/field-observation'
import PlaceCard from '@/components/place-card'
import SelectCard from '@/components/select-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

//Todo: Fazer estados e dados necessarios
export default function CheckinsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <h1 className="font-sans text-2xl font-semibold tracking-tight">
          Novo Check-in
        </h1>
        <h4 className="text-gray-500 text-sm">Preencha o status de cada lugar</h4>
        {/* TODO: Deixar interativo e retirar o hardCode, adicionar estado */}
        <div>
          <SelectCard
            textHeader="Responsável *"
            placeHolder="Selecione a pessoa"
          />
        </div>
        <div className="mt-3">
          {/* //TODO: Deixar interativo, colocar state, e tipar a requisicao do componente, olocar map com dados */}
          <PlaceCard
            title="Bancada de teste"
            subTitle="Lab 30"
            arrayProblems={['ferramenta faltando', 'desorganizado', 'outro']}
          />
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
          <Button className="bg-blue-400 p-5.5 text-sm hover:bg-blue-500">
            Finalizar Check-in
          </Button>
        </div>
      </div>
    </main>
  )
}
