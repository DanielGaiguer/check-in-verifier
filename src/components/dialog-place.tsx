'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckIcon } from 'lucide-react'
import { Problem } from '@/hooks/useQuerys/useProblems'
import { useUpdatePlaces } from '@/hooks/useMutation/useUpdatePlace'
import { useCreatePlace } from '@/hooks/useMutation/useCreatePlace'
import { toast } from 'react-toastify'

interface DialogPlaceProtocol {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  name: string
  setName: Dispatch<SetStateAction<string>>
  labId: string
  setLabId: Dispatch<SetStateAction<string>>
  labName: string
  setLabName: Dispatch<SetStateAction<string>>
  uniqueLabs: { id: string; name: string }[]
  problems: Problem[]
  isLoadingProblems: boolean
  selectedProblems: string[]
  setSelectedProblems: Dispatch<SetStateAction<string[]>>
  originalProblems: string[]
  placeId: string
  placeSortOrder: number
  edit: boolean
}

export default function DialogPlace({
  dialogOpen,
  setDialogOpen,
  name,
  setName,
  labId,
  setLabId,
  labName,
  setLabName,
  uniqueLabs,
  problems,
  isLoadingProblems,
  selectedProblems,
  setSelectedProblems,
  originalProblems,
  placeId,
  placeSortOrder,
  edit,
}: DialogPlaceProtocol) {
  const updatePlaceMutation = useUpdatePlaces()
  const createPlaceMutatation = useCreatePlace()
  const [labDropdownOpen, setLabDropdownOpen] = useState(false)

  function closeDialog() {
    setDialogOpen(false)
    setName('')
    setLabId('')
    setLabName('')
  }

  function toggleProblem(problemId: string) {
    setSelectedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    )
  }

  function selectLab(lab: { id: string; name: string }) {
    setLabId(lab.id)
    setLabName(lab.name)
    setLabDropdownOpen(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (edit) {
      const toAdd = selectedProblems.filter(
        (id) => !originalProblems.includes(id)
      )
      const toRemove = originalProblems.filter(
        (id) => !selectedProblems.includes(id)
      )

      updatePlaceMutation.mutate(
        {
          id: placeId,
          labId,
          name,
          sortOrder: placeSortOrder,
          toAdd,
          toRemove,
        },
        { onSuccess: closeDialog }
      )

      toast.success('Local atualizado com sucesso.')
      return
    }

    createPlaceMutatation.mutate({
      labId: labId,
      name: name,
      problemIds: selectedProblems,
    })

    toast.success('Local cadastrado com sucesso.')
    closeDialog()
  }

  console.log('uniqueLabs:', uniqueLabs)
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-h-[85vh] w-full max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {placeId ? 'Editar Lugar' : 'Novo Lugar'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* LABORATÓRIO */}
          <div className="relative">
            <Label htmlFor="lab" className="mb-1 block text-sm font-medium">
              Laboratório
            </Label>
            <button
              type="button"
              onClick={() => {
                console.log('clicou')
                setLabDropdownOpen((prev) => !prev)
              }}
              className="flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-400 bg-gray-100 px-3 focus:border-blue-400"
            >
              <span className={`${!labId && 'text-gray-400'}`}>
                {labName || 'Selecione um laboratório'}
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
            {labDropdownOpen && (
              <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-gray-50 shadow-md">
                {uniqueLabs.map((lab) => (
                  <li
                    key={lab.id}
                    onClick={() => selectLab(lab)}
                    className={`cursor-pointer rounded-md px-3 py-2 hover:bg-green-100 ${
                      labId === lab.id ? 'bg-green-200' : ''
                    }`}
                  >
                    {labId === lab.id ? (
                      <div className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-gray-500" />
                        {lab.name}
                      </div>
                    ) : (
                      <span className="ml-6">{lab.name}</span>
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
              className="focus:border-2.5 h-10 w-full rounded-md border-2 border-gray-400 bg-gray-100 px-3"
            />
          </div>

          {/* PROBLEMAS */}
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
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !labId || selectedProblems.length === 0}
              className="cursor-pointer bg-blue-400 hover:bg-blue-300"
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
