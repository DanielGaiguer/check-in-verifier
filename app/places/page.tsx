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
  CheckIcon,
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
import { useProblems } from '@/hooks/useQuerys/useProblems'

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
  const { problems, isLoading: isLoadingProblems } = useProblems()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [labId, setLabId] = useState('')
  const [name, setName] = useState('')
  const [selectedProblems, setSelectedProblems] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)

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
                <div className="relative">
                  <Label
                    htmlFor="lab"
                    className="mb-1 block text-sm font-medium"
                  >
                    Laboratório
                  </Label>

                  {/* Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="focus:border-2.5 flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-400 bg-gray-100 px-3 focus:border-blue-400"
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
                  <Label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium "
                  >
                    Nome do Lugar
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Bancada A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full px-3 focus:border-2.5 flex items-center justify-between rounded-md border-2  border-gray-400 bg-gray-100!"
                  />
                </div>

                {/* PROBLEMAS POSSÍVEIS */}
                <div>
                  <Label className="mb-1 block text-sm font-medium">
                    Problemas Possíveis
                  </Label>

                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                    {isLoadingProblems && (
                      <p className="text-sm text-gray-500">
                        Carregando problemas...
                      </p>
                    )}

                    {problems.map((problem) => (
                      <div key={problem.id} className="flex items-center">
                        <Checkbox
                          id={`problem-${problem.id}`}
                          checked={selectedProblems.includes(problem.id)}
                          onCheckedChange={() => toggleProblem(problem.id)}
                          className="border-gray-400 data-[state=checked]:border-gray-400 data-[state=checked]:bg-gray-400"
                        />
                        <Label
                          htmlFor={`problem-${problem.id}`}
                          className="ml-3 cursor-pointer text-sm"
                        >
                          {problem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTÕES */}
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeDialog} >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!name.trim() || !labId} className='bg-blue-400 hover:bg-blue-300'>
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
