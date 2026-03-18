'use client'
import { EditCard } from '@/components/edit-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLaboratories } from '@/hooks/useQuerys/useLaboratories'
import { FlaskConicalIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'

export default function LaboratoriesPage() {
  const { laboratories, isLoading, error } = useLaboratories()
  const [name, setName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-40 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300">
                  <PlusIcon className="mr-1 mb-0.5" />
                  Novo Laboratório
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Novo Laboratório
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      id="name"
                      placeholder="Nome do laboratório"
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
