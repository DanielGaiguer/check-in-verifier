'use client'
import { EditCard } from '@/components/edit-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FlaskConicalIcon, PlusIcon } from 'lucide-react'

interface LaboratoriesProtocol{
  id: string
  name: string
  createdAt: string
}

interface ApiResponse{
  success: boolean
  data: LaboratoriesProtocol[]
  count: number
}

export default function LaboratoriesPage() {
  const { data, isLoading, error} = useQuery<ApiResponse>({
    queryKey: ['laboratories'],
    queryFn: async () => {
      const res = await fetch('api/laboratories')
      if (!res) throw new Error('Erro ao buscar laboratórios')
      const json = await res.json()
      return json.data
    }
  })

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao buscar laboratórios</p>

  const laboratories: LaboratoriesProtocol[] = Array.isArray(data) ? data : []

  laboratories.map((lab) => {
    return [lab.createdAt = format(new Date(lab.createdAt), 'dd/MM/yyyy', {locale: ptBR})]
  })


  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Laboratórios
            </h1>
            <h4 className="text-sm text-gray-500">
              Gerencie os laboratórios cadastrados
            </h4>
          </div>
          <div>
            <Button className="w-40 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300">
              <PlusIcon className="mr-1 mb-0.5" />
              Novo Laboratório
            </Button>
          </div>
        </div>
        <div className="mt-5">
          {laboratories.length > 0 ? (
            laboratories.map((lab) => (
              <div className="mt-2" key={lab.id}>
                <EditCard
                  title={lab.name}
                  description={`Criado em ${lab.createdAt}`}
                  iconName="FlaskConicalIcon"
                />
              </div>
            ))
          ) : (
            <Card className="flex items-center justify-center">
              <FlaskConicalIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Ainda não foi cadastrado nenhum laboratório.
              </h4>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
