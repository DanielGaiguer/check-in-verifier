import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from './ui/button'
import { useCreateLab } from '@/hooks/useMutation/useCreateLab'
import { useUpdateLab } from '@/hooks/useMutation/useUpdateLab'
import { toast } from 'react-toastify'
import { useUnits } from '@/hooks/useQuerys/useUnits'
import SelectCardSkeleton from './skeleton-select-card'
import ErrorPage from './error-page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dispatch, SetStateAction, useState } from 'react'

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
  const { units, isLoading, error } = useUnits()
  const createLabMutation = useCreateLab()
  const updateLabMutation = useUpdateLab()

  const unitName = units.find((u) => u.id === unitId)?.name

  if (isLoading) return <SelectCardSkeleton />
  if (error) return <ErrorPage />
  
  setUnitId(unitId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (forEdit) {
      updateLabMutation.mutate({ id, unitId, name })
      setInternalOpen?.(false)
      setName('')
      setUnitId('')
      toast.success('Laboratorio atualizado com sucesso.')
    } else {
      createLabMutation.mutate({ name, unitId })
      setInternalOpen?.(false)
      setName('')
      toast.success('Laboratorio criado com sucesso.')
    }
  }

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogContent className="z-9999 max-h-[85vh] w-[80%] max-w-[80%] overflow-visible p-6 md:w-full md:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {forEdit ? 'Editar Laboratório' : 'Novo Laboratório'}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              id="name"
              placeholder="Nome do laboratório"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:border-2.5 flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-300 bg-gray-100! px-3 focus:border-blue-400!"
            />
          </div>
          <div className="relative w-full">
            <Select value={unitId} onValueChange={setUnitId}>
              <SelectTrigger className="w-full bg-gray-50!">
                <SelectValue placeholder="Todas as unidades" />
              </SelectTrigger>
              <SelectContent className="z-99999" position="popper">
                {units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => setInternalOpen?.(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
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
