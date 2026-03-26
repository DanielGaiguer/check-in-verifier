'use client'

import DialogDelete from '@/components/dialog-delete'
import DialogProblems from '@/components/dialog-problems'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useDeleteProblem } from '@/hooks/useMutation/useDeleteProblem'

import { useProblems } from '@/hooks/useQuerys/useProblems'
import {
  FlaskConicalIcon,
  AlertTriangleIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'

import { useState } from 'react'
import { toast } from 'react-toastify'

export default function ProblemsPage() {
  const deleteProblemMutation = useDeleteProblem()

  const { problems, isLoading, error } = useProblems()

  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [internalOpen, setInternalOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar os problemas.</p>

    function handleDelete() {
      deleteProblemMutation.mutate({
        id: id,
      })
      toast.success('Problema deletado com sucesso.')
    }
  

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
            <Button
              className="w-40 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300"
              onClick={() => {
                setInternalOpen(true)
                setName('')
                setId('')
              }}
            >
              <PlusIcon className="mr-1 mb-0.5" />
              Novo Problema
            </Button>

          </div>
        </div>

        <div className="mt-5">
          {problems.length > 0 ? (
            problems.map((problem) => (
              <Card
                className="mt-2 flex h-20 w-full flex-row gap-3 shadow-xs transition hover:shadow-md md:flex-row"
                key={problem.id}
              >
                <CardHeader className="flex items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <AlertTriangleIcon className="text-red-500" size={22} />
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 items-center justify-between">
                  <div>
                    <CardTitle className="text-md font-sans font-normal">
                      {problem.name}
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-white hover:bg-blue-50"
                      onClick={() => {
                        setInternalOpen(true)
                        setName(problem.name)
                        setId(problem.id)
                      }}
                    >
                      <PencilIcon className="text-black" size={25} />
                    </Button>

                    <Button
                      className="bg-white hover:bg-blue-50"
                      onClick={() => {
                        setOpenDelete(true)
                        setName(problem.name)
                        setId(problem.id)
                      }}
                    >
                      <Trash2Icon className="text-red-400" size={25} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="flex items-center justify-center">
              <FlaskConicalIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Ainda não foi cadastrado nenhum problema.
              </h4>
            </Card>
          )}

            <DialogProblems
              setName={setName}
              name={name}
              forEdit={!!id}
              internalOpen={internalOpen}
              setInternalOpen={setInternalOpen}
              id={id}
              setId={setId}
            />

          {openDelete && (
            <DialogDelete
              title={name}
              open={openDelete}
              onOpenChange={setOpenDelete}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </main>
  )
}