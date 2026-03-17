'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  FlaskConicalIcon,
  PlusIcon,
  MapPin,
  GripVertical,
  Pencil,
  Trash2,
} from 'lucide-react'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'
import { usePlaces } from '@/hooks/useQuerys/usePlaces'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdatePlacesOrder } from '@/hooks/useMutation/useUpdatePlacesOrder'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { SelectContent, SelectTrigger } from '@radix-ui/react-select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

/* ---------------- SORTABLE CARD ---------------- */
function SortablePlace({
  place,
  onEdit,
  onDelete,
}: {
  place: any
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: place.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardContent className="flex h-9 items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100">
            <MapPin className="h-5 w-5 text-blue-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{place.name}</p>
            <p className="text-muted-foreground text-xs">
              {place.labName ?? '—'}
            </p>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------------- PAGE ---------------- */
export default function PlacesPage() {
  const { places, isLoading, error } = usePlaces()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [labId, setLabId] = useState('')
  const [name, setName] = useState('')
  const [selectedProblems, setSelectedProblems] = useState<number[]>([])

  const queryClient = useQueryClient()
  const updateOrder = useUpdatePlacesOrder()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const uniqueLabs = Array.from(
    new Set(places.filter((p) => p.labName).map((p) => p.labName))
  )

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar os lugares.</p>

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = places.findIndex((p) => p.id === active.id)
    const newIndex = places.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(places, oldIndex, newIndex)
    const updated = reordered.map((p, index) => ({ ...p, sortOrder: index }))
    updateOrder.mutate(updated)
  }

  function toggleProblem(problemId: number) {
    setSelectedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    )
  }

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">
        {/* HEADER */}
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Lugares</h1>
            <h4 className="text-sm text-gray-500">
              Arraste para reordenar os lugares do check-in
            </h4>
          </div>

          {/* DIALOG */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600">
                <PlusIcon className="h-4 w-4" /> Novo Lugar
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Novo Lugar
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* LABORATÓRIO */}
                <div>
                  <Label
                    htmlFor="lab"
                    className="mb-1 block text-sm font-medium"
                  >
                    Laboratório
                  </Label>
                  <Select value={labId} onValueChange={setLabId}>
                    <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-xl border-2 border-gray-400 px-3">
                      <SelectValue placeholder="Selecione um laboratório" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] w-full rounded-md" >
                      <SelectGroup className="w-full bg-white rounded-md mt-1 ml-1">
                        {uniqueLabs?.map((lab) => (
                          <SelectItem key={lab} value={lab} className="w-full data-highlighted:bg-green-100 data-[state=checked]:bg-green-200 rounded-md">
                            {lab}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* NOME DO LUGAR */}
                <div>
                  <Label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium"
                  >
                    Nome do Lugar
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Bancada A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full px-3"
                  />
                </div>

                {/* PROBLEMAS POSSÍVEIS */}
                {places[0]?.problems && places[0].problems.length > 0 && (
                  <div>
                    <Label className="mb-1 block text-sm font-medium">
                      Problemas Possíveis
                    </Label>
                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                      {places[0].problems.map((problem: any) => (
                        <label
                          key={problem.id}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <Checkbox
                            key={problem.id}
                            checked={selectedProblems.includes(problem.id)}
                            onCheckedChange={() => toggleProblem(problem.id)}
                          />
                          {problem.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* BOTÕES */}
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!name.trim() || !labId}>
                    Criar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* LIST */}
        <div className="mt-5">
          {places.length === 0 ? (
            <Card className="flex items-center justify-center py-10">
              <FlaskConicalIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Ainda não foi cadastrado nenhum lugar.
              </h4>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={places.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {places.map((place) => (
                    <SortablePlace
                      key={place.id}
                      place={place}
                      onEdit={() => console.log('editar', place)}
                      onDelete={() => console.log('delete', place)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </main>
  )
}
