import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from './ui/button'
import { PlusIcon } from 'lucide-react'
import DialogDelete from './dialog-delete'
import { useCreateProblem } from '@/hooks/useMutation/useCreateProblem'
import { useUpdateProblem } from '@/hooks/useMutation/useUpdateProblem'
import { toast } from 'react-toastify'

interface DialogProblemsProtocol {
  setName: Dispatch<SetStateAction<string>>
  name: string
  forEdit?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  internalOpen?: boolean
  setInternalOpen?: Dispatch<SetStateAction<boolean>>
  id?: string
  setId?: Dispatch<SetStateAction<string>>
}

export default function DialogProblems({
  setName,
  name,
  forEdit = false,
  internalOpen,
  setInternalOpen,
  id,
  setId,
}: DialogProblemsProtocol) {
  const createProblemMutation = useCreateProblem()
  const updateProblemMutation = useUpdateProblem()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (id && id.trim()) {
      updateProblemMutation.mutate({ id, name })
      toast.success('Problema atualizado com sucesso.')
    } else {
      createProblemMutation.mutate({ name })
      toast.success('Problema cadastrado com sucesso.')
    }

    setInternalOpen?.(false)
    setName('')
    setId?.('')
  }
  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6 z-9999">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {forEdit ? 'Editar Problema' : 'Novo Problema'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="name"
              placeholder="Nome do problema"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:border-2.5 flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-300 bg-gray-100! px-3 focus:border-blue-400!"
            />
          </div>

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
              type="submit"
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
