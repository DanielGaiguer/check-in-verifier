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
import { PlusIcon } from 'lucide-react'
import { useCreateLab } from '@/hooks/useMutation/useCreateLab'
import { useUpdateLab } from '@/hooks/useMutation/useUpdateLab'
import { toast } from 'react-toastify'

interface DialogLaboratoriesProtocol {
  setName: Dispatch<SetStateAction<string>>
  name: string
  forEdit?: boolean
  internalOpen?: boolean
  setInternalOpen?: Dispatch<SetStateAction<boolean>>
  id: string
}

export default function DialogLaboratories({
  setName,
  name,
  forEdit,
  internalOpen,
  setInternalOpen,
  id,
}: DialogLaboratoriesProtocol) {
  const createLabMutation = useCreateLab()
  const updateLabMutation = useUpdateLab()

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (forEdit) {
      updateLabMutation.mutate({
        id,
        name,
      })
      toast.success('Laboratorio atualizado com sucesso.')
      return
    }

    createLabMutation.mutate({
      name,
    })
    toast.success('Laboratorio criado com sucesso.')
    return
  }

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
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
