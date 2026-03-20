'use client'
import DialogLaboratories from '@/components/dialog-laboratories'
import { EditCard } from '@/components/edit-card'
import { Card } from '@/components/ui/card'
import { useLaboratories } from '@/hooks/useQuerys/useLaboratories'
import { FlaskConicalIcon } from 'lucide-react'
import { useState } from 'react'

export default function LaboratoriesPage() {
  const { laboratories, isLoading, error } = useLaboratories()
  const [name, setName] = useState('')
  const [internalOpen, setInternalOpen] = useState(false)

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao buscar laboratórios</p>

  function handleSubmit() {
    console.log('enviou')
  }
  
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
            <DialogLaboratories
              setName={setName}
              name={name}
              internalOpen={internalOpen}
              setInternalOpen={setInternalOpen}
            />
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
                  componentEdit={
                    <DialogLaboratories
                      setName={setName}
                      name={lab.name}
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
                Ainda não foi cadastrado nenhum laboratório.
              </h4>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
