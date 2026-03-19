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
import { useState } from 'react'
import { Button } from './ui/button'
import { CheckIcon, PlusIcon } from 'lucide-react'
import { Problem } from '@/hooks/useQuerys/useProblems'
import { Checkbox } from './ui/checkbox'
import { Dispatch, SetStateAction } from 'react'

interface DialogPlaceProtocol {
  dialogOpen: boolean,
  setDialogOpen:  Dispatch<SetStateAction<boolean>>,

  name: string
  setName: Dispatch<SetStateAction<string>>

  labId: string
  setLabId: Dispatch<SetStateAction<string>>

  uniqueLabs: string[]

  problems: Problem[]
  isLoadingProblems: boolean

  selectedProblems: number[]
  setSelectedProblems: Dispatch<SetStateAction<number[]>>
}

export default function DialogPlace({
  dialogOpen,
  setDialogOpen,
  setName,
  name,
  labId,
  setLabId,
  uniqueLabs,
  problems,
  isLoadingProblems,
  selectedProblems,
  setSelectedProblems,
}: DialogPlaceProtocol) {
  const [isOpen, setIsOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Criou/Atualizou lugar:', { labId, name, selectedProblems })
    // Aqui você faria sua lógica de POST/PUT
    setDialogOpen(false)
    setName('')
    setLabId('')
    setSelectedProblems([])
  }

  function closeDialog() {
    setDialogOpen(false)
    setName('')
    setLabId('')
    setSelectedProblems([])
  }

  function toggleProblem(problemId: number) {
    setSelectedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

      <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Novo Lugar
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* LABORATÓRIO */}
          <div className="relative">
            <Label htmlFor="lab" className="mb-1 block text-sm font-medium">
              Laboratório
            </Label>

            {/* Trigger */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="focus:border-2.5 flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-300 bg-gray-100 px-3 focus:border-blue-400"
            >
              <span className={`${!labId && 'text-gray-400'}`}>
                {labId || 'Selecione um laboratório'}
              </span>

              <svg
                className="h-4 w-4 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.937a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-gray-50 shadow-md">
                {uniqueLabs?.map((lab) => (
                  <li
                    key={lab}
                    onClick={() => {
                      setLabId(lab)
                      setIsOpen(false)
                    }}
                    className={`cursor-pointer rounded-md px-3 py-2 hover:bg-green-100 ${labId === lab ? 'bg-green-200' : ''}`}
                  >
                    {lab === labId ? (
                      <div className={`flex flex-row items-center`}>
                        <CheckIcon className="mr-2 h-4 w-4 text-gray-500" />
                        {lab}
                      </div>
                    ) : (
                      <span className="ml-6">{lab}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* NOME DO LUGAR */}
          <div>
            <Label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nome do Lugar
            </Label>
            <Input
              id="name"
              placeholder="Ex: Bancada A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:border-2.5 flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-400 bg-gray-100! px-3"
            />
          </div>

          {/* PROBLEMAS POSSÍVEIS */}
          <div>
            <Label className="mb-1 block text-sm font-medium">
              Problemas Possíveis
            </Label>

            <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
              {isLoadingProblems && (
                <p className="text-sm text-gray-500">Carregando problemas...</p>
              )}

              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center rounded-md hover:bg-gray-100"
                >
                  <Checkbox
                    id={`problem-${problem.id}`}
                    checked={selectedProblems.includes(problem.id)}
                    onCheckedChange={() => toggleProblem(problem.id)}
                    className="border-gray-400 data-[state=checked]:border-gray-300 data-[state=checked]:bg-gray-400"
                  />

                  <Label
                    htmlFor={`problem-${problem.id}`}
                    className="ml-3 cursor-pointer text-sm select-none"
                  >
                    {problem.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* BOTÕES */}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !labId || selectedProblems.length == 0}
              className="cursor-pointer bg-blue-400 hover:bg-blue-300"
            >
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
