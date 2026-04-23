'use client'
import DialogDelete from '@/components/dialog-delete'
import DialogPeople from '@/components/dialog-people'
import ErrorPage from '@/components/error-page'
import { SkeletonPeoplePage } from '@/components/people-skeleton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDeletePeople } from '@/hooks/useMutation/useDeletePeople'

import { usePeople } from '@/hooks/useQuerys/usePeoples'
import {
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersRoundIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function PeoplePage() {
  const deletePeopleMutation = useDeletePeople()
  const { people: peoples, isLoading, error } = usePeople()
  const [name, setName] = useState('')
  const [internalOpen, setInternalOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [id, setId] = useState('')

  if (isLoading) return <SkeletonPeoplePage />
  if (error)   return <ErrorPage />

  function handleDelete() {
    deletePeopleMutation.mutate({
      id: id,
    })
    toast.success('Pessoa deletada com sucesso.')
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight">
              Pessoas
            </h1>
            <h4 className="text-sm text-gray-500">
              Cadastre as pessoas que realizam check-ins
            </h4>
          </div>
          <div>
            <Button
              className="w-35 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300"
              onClick={() => {
                setInternalOpen?.(true)
                setName('')
                setId('')
              }}
            >
              <PlusIcon className="mr-1 mb-0.5" />
              Nova Pessoa
            </Button>
          </div>
        </div>
        <div className="mt-5">
          {peoples.length > 0 ? (
            peoples.map((people) => {
              const initial = people.name.charAt(0).toUpperCase()
              return (
                <Card
                  className="mt-2 flex h-20 w-full flex-row gap-3 shadow-xs transition hover:shadow-md md:flex-row"
                  key={people.id}
                >
                  <CardHeader className="flex items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50`}
                    >
                      <span className={`text-blue-400`}>{initial}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 items-center justify-between">
                    <div>
                      <CardTitle className="text-md font-sans font-normal">
                        {people.name}
                      </CardTitle>

                      {people.createdAt && (
                        <CardDescription className="font-sans text-sm">
                          Criado em {people.createdAt}
                        </CardDescription>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        className="bg-white hover:bg-blue-50"
                        onClick={() => {
                          setInternalOpen(true)
                          setName(people.name)
                          setId(people.id)
                        }}
                      >
                        <PencilIcon className="text-black" size={25} />
                      </Button>
                      <Button
                        className="bg-white hover:bg-blue-50"
                        onClick={() => {
                          setOpenDelete(true)
                          setName(people.name)
                          setId(people.id)
                        }}
                      >
                        <Trash2Icon className="text-red-400" size={25} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="flex items-center justify-center">
              <UsersRoundIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Ainda não foi cadastrado nenhuma pessoa.
              </h4>
            </Card>
          )}

          <DialogPeople
            setName={setName}
            name={name}
            forEdit={!!id}
            setInternalOpen={setInternalOpen}
            internalOpen={internalOpen}
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
