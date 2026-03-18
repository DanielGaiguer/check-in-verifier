'use client'
import { EditCard } from '@/components/edit-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useProblems } from '@/hooks/useQuerys/useProblems'
import { FlaskConicalIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'


export default function ProblemsPage() {
  const { problems, isLoading, error} = useProblems()
  const [ name, setName] = useState("")
  const [ dialogOpen, setDialogOpen] = useState(false)
  const [ description, setDescription] = useState("")

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
              Problemas
            </h1>
            <h4 className="text-sm text-gray-500">
              Cadastre os possíveis problemas para os lugares
            </h4>
          </div>
          <div>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
            <Button className="w-40 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300">
              <PlusIcon className="mr-1 mb-0.5" />
              Novo Problema
            </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Novo Problema
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium "
                  >
                    Nome do Lugar
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nome do problema"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full px-3 focus:border-2.5 flex items-center justify-between rounded-md border-2  border-gray-300 bg-gray-100! focus:border-blue-400!"
                  />
                </div>

                {/* PROBLEMAS POSSÍVEIS */}
                <div>
                  <Label className="mb-1 block text-sm font-medium">
                    Problemas Possíveis
                  </Label>
                  <Textarea placeholder='Descrição (Opcional)' className='bg-gray-50! border-2 border-gray-300' value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>

                {/* BOTÕES */}
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className='cursor-pointer' >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!name.trim() || !name} className='bg-blue-400 hover:bg-blue-300 cursor-pointer'>
                    Criar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
