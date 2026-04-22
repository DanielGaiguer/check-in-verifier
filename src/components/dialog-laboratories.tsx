import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from './ui/button'
import { useCreateLab } from '@/hooks/useMutation/useCreateLab'
import { useUpdateLab } from '@/hooks/useMutation/useUpdateLab'
import { toast } from 'react-toastify'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useUnits } from '@/hooks/useQuerys/useUnits'
import SelectCardSkeleton from './skeleton-select-card'
import ErrorPage from './error-page'
import { CheckIcon } from 'lucide-react'

interface DialogLaboratoriesProtocol {
  setName: Dispatch<SetStateAction<string>>
  name: string
  unitId: string
  setUnitId: Dispatch<SetStateAction<string>>
  forEdit?: boolean
  internalOpen?: boolean
  setInternalOpen?: Dispatch<SetStateAction<boolean>>
  id: string
}

export default function DialogLaboratories({
  setName,
  name,
  unitId,
  setUnitId,
  forEdit,
  internalOpen,
  setInternalOpen,
  id,
}: DialogLaboratoriesProtocol) {
  const { units, isLoading, error} = useUnits()
  const createLabMutation = useCreateLab()
  const updateLabMutation = useUpdateLab()

  if (isLoading) return <SelectCardSkeleton />
  if (error) return <ErrorPage />

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (forEdit) {
      updateLabMutation.mutate({
        id,
        unitId,
        name,
      })
      setInternalOpen?.(false)
      setName('')
      setUnitId('')
      toast.success('Laboratorio atualizado com sucesso.')
      return
    }

    createLabMutation.mutate({
      name,
      unitId,
    })
    setInternalOpen?.(false)
    setName('')
    toast.success('Laboratorio criado com sucesso.')
    return
  }

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogContent className="z-9999 max-h-[85vh] w-[80%] max-w-[80%] overflow-y-auto p-6 md:w-full md:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {forEdit ? 'Editar Laboratório' : 'Novo Laboratório'}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          <div>
            <Input
              id="name"
              placeholder="Nome do laboratório"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:border-2.5 flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-300 bg-gray-100! px-3 focus:border-blue-400!"
            />
          </div>

          <div>
            <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-gray-50 shadow-md">
                {units.map((unit) => (
                  <li
                    key={unit.id}
                    onClick={() => setUnitId(unit.id)}
                    className={`cursor-pointer rounded-md px-3 py-2 hover:bg-green-100 ${
                      unitId === unit.id ? 'bg-green-200' : ''
                    }`}
                  >
                    {unitId === unit.id ? (
                      <div className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-gray-500" />
                        {unit.name}
                      </div>
                    ) : (
                      <span className="ml-6">{unit.name}</span>
                    )}
                  </li>
                ))}
              </ul>
          </div>
          {/* BOTÕES */}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setInternalOpen?.(false)
              }}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!name.trim() || !name}
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
