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
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from './ui/button'
import { PlusIcon } from 'lucide-react'

interface DialogProblemsProtocol {
  setName: Dispatch<SetStateAction<string>>
  name: string
  forEdit?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  internalOpen?: boolean
  setInternalOpen?: Dispatch<SetStateAction<boolean>>
}

export default function DialogProblems({
  setName,
  name,
  forEdit = false,
  open,
  onOpenChange,
  internalOpen,
  setInternalOpen,
}: DialogProblemsProtocol) {
  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    console.log('enviou')
  }

  return (
    <Dialog
      open={forEdit ? open : internalOpen}
      onOpenChange={forEdit ? onOpenChange : setInternalOpen}
    >
      {!forEdit && (
        <Button
          className="w-40 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300"
          onClick={() => setInternalOpen?.(true)}
        >
          <PlusIcon className="mr-1 mb-0.5" />
          Novo Problema
        </Button>
      )}

      <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {forEdit ? 'Editar Problema' : 'Novo Problema'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nome do Problema
            </Label>
            <Input
              id="name"
              placeholder="Nome do problema"
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
                if (forEdit) {
                  onOpenChange?.(false)
                } else {
                  setInternalOpen?.(false)
                }
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
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
