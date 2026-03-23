'use client'
import { Button } from '@/components/ui/button'
import { useDetailsCheckin } from '@/hooks/useQuerys/useDetailsCheckin'
import { useParams } from 'next/navigation'

export default function DetailsCheckin() {
  const params = useParams();

  // Garante que seja uma string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: checkin, isLoading, error } = useDetailsCheckin(id || '');

  if (isLoading) return <p>Carregando checkins...</p>
  if (error) return <p>Erro ao carregar checkins</p>

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Detalhes do Check-in
            </h1>
            <h4 className="text-sm text-gray-500">
              {checkin?.people.name} - {checkin?.date}
            </h4>
          </div>
          <div>
            <Button variant={'ghost'}></Button>
          </div>
        </div>
      </div>
    </main>
  )
}