'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePeople } from '@/hooks/useQuerys/usePeoples'
import {
  FlaskConicalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'

export default function PeoplePage() {
  const { peoples, isLoading, error } = usePeople()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar os problemas.</p>

  function handleSubmit() {
    console.log('enviou')
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-40 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300">
                  <PlusIcon className="mr-1 mb-0.5" />
                  Nova Pessoa
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Nova Pessoa
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      id="name"
                      placeholder="Nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="focus:border-2.5 flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-300 bg-gray-100! px-3 focus:border-blue-400!"
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="cursor-pointer"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={!name.trim() || !name}
                      className="cursor-pointer bg-blue-400 hover:bg-blue-300"
                    >
                      Criar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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
                      <Button className="bg-white hover:bg-blue-50">
                        <PencilIcon className="text-black" size={25} />
                      </Button>
                      <Button className="bg-white hover:bg-blue-50">
                        <Trash2Icon className="text-red-400" size={25} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
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
