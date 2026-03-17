'use client'
import { EditCard } from '@/components/edit-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useProblems } from '@/hooks/useQuerys/useProblems'
import { FlaskConicalIcon, PlusIcon } from 'lucide-react'


export default function ProblemsPage() {
  const { problems, isLoading, error} = useProblems()

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar os problemas.</p>


  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Problemas
            </h1>
            <h4 className="text-sm text-gray-500">
              Cadastre os possíveis problemas para os lugares
            </h4>
          </div>
          <div>
            <Button className="w-40 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300">
              <PlusIcon className="mr-1 mb-0.5" />
              Novo Problema
            </Button>
          </div>
        </div>

        <div className="mt-5">
          {problems.length > 0 ? (
            problems.map((problem) => (
              <div className="mt-2" key={problem.id}>
                <EditCard
                  title={problem.name}
                  iconName="AlertTriangleIcon" // Passa apenas o nome da chave
                  iconColor="text-red-500"
                  iconBgColor="bg-red-100"
                />
              </div>
            ))
          ) : (
            <Card className="flex items-center justify-center">
              <FlaskConicalIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Ainda não foi cadastrado nenhum problema.
              </h4>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
