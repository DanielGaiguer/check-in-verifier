'use client'
import DialogDelete from '@/components/dialog-delete'
import DialogProblems from '@/components/dialog-problems'
import { EditCard } from '@/components/edit-card'
import { Card } from '@/components/ui/card'
import { useProblems } from '@/hooks/useQuerys/useProblems'
import { FlaskConicalIcon } from 'lucide-react'
import { useState } from 'react'

export default function ProblemsPage() {
  const { problems, isLoading, error } = useProblems()
  const [name, setName] = useState('')
  const [internalOpen, setInternalOpen] = useState(false)


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
            <DialogProblems
              setName={setName}
              name={name}
              internalOpen={internalOpen}
              setInternalOpen={setInternalOpen}
            />
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
                  componentEdit={
                    <DialogProblems
                      setName={setName}
                      name={problem.name}
                      forEdit={true}
                    />
                  }
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
