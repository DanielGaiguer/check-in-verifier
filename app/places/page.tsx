'use client'

import DialogDelete from '@/components/dialog-delete'
import DialogPlace from '@/components/dialog-place'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  GripVertical,
  Pencil,
  Trash2,
  PlusIcon,
  MapPinIcon,
} from 'lucide-react'

import { usePlaces } from '@/hooks/useQuerys/usePlaces'
import { useProblems } from '@/hooks/useQuerys/useProblems'
import { useUpdatePlacesOrder } from '@/hooks/useMutation/useUpdatePlacesOrder'

import { useState } from 'react'
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
import { useDeletePlace } from '@/hooks/useMutation/useDeletePlace'
import { toast } from 'react-toastify'
import { SkeletonPlacesPage } from '@/components/place-skeleton'
import ErrorPage from '@/components/error-page'
import { useLaboratories } from '@/hooks/useQuerys/useLaboratories'

interface Place {
  id: string
  name: string
  labId: string
  labName: string
  order: number
  problems?: {id: string, name: string}[]
}

function SortablePlace({
  place,
  onEdit,
  onDelete,
}: {
  place: Place
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

export default function PlacesPage() {
  const { places, isLoading, error } = usePlaces()
  const { problems, isLoading: isLoadingProblems, error: errorProblems } = useProblems()
  const { laboratories, isLoading: isLoadingLaboratories, error: errorLaboratories} = useLaboratories()
  const updateOrder = useUpdatePlacesOrder()
  const deletePlace = useDeletePlace()

  const [placeId, setPlaceId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [labId, setLabId] = useState('')
  const [labName, setLabName] = useState('')
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  const [originalProblems, setOriginalProblems] = useState<string[]>([])
  const [placeSortOrder, setPlaceSortOrder] = useState<number>(0)

  const [openDialog, setOpenDialog] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (isLoading || isLoadingProblems || isLoadingLaboratories) return <SkeletonPlacesPage />
  if (error || errorProblems || errorLaboratories) return <ErrorPage />

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = places.findIndex((p) => p.id === active.id)
    const newIndex = places.findIndex((p) => p.id === over.id)

    const reordered = arrayMove(places, oldIndex, newIndex)
    const updated = reordered.map((p, index) => ({ ...p, order: index }))

    // Atualiza o backend (quando estiver pronto) e cache imediatamente
    updateOrder.mutate(updated)
  }

  function handleEdit(place: Place) {
    setPlaceId(place.id)
    setLabId(place.labId ?? '')
    setLabName(place.labName ?? '')
    setName(place.name)

    const problemIds = (place.problems ?? []).map((p: any) =>
      typeof p === 'string' ? p : p.id
    )

    setSelectedProblems(problemIds)
    setOriginalProblems(problemIds)

    setPlaceSortOrder(place.order)
    setOpenDialog(true)
  }

  function handleCreate() {
    setPlaceId(null)
    setLabId('')
    setLabName('')
    setName('')
    setSelectedProblems([])
    setOriginalProblems([])
    setPlaceSortOrder(places.length)
    setOpenDialog(true)
  }

  function handleDelete() {
    if (!placeId) return toast.error('Erro ao tentar deletar local')
    deletePlace.mutate({
      id: placeId,
    })
    toast.success('Local deletado com sucesso.')
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
          <Button
            onClick={handleCreate}
            className="w-40 cursor-pointer rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300"
          >
            <PlusIcon className="mr-1 mb-0.5" />
            Novo Lugar
          </Button>
        </div>

        {/* LIST */}
        <div className="mt-5">
          {places.length > 0 ? (
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
                      onEdit={() => handleEdit(place)}
                      onDelete={() => {
                        setName(place.name)
                        setOpenDelete(true)
                        setPlaceId(place.id)
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <Card className="flex flex-col items-center justify-center py-10">
              <MapPinIcon className="mt-5 text-gray-300" size={55} />
              <h4 className="mb-5 font-light text-gray-500">
                Ainda não foi cadastrado nenhum lugar.
              </h4>
            </Card>
          )}
        </div>

        {/* DIALOG PLACE */}
        <DialogPlace
          dialogOpen={openDialog}
          setDialogOpen={setOpenDialog}
          name={name}
          setName={setName}
          labId={labId}
          labName={labName}
          setLabName={setLabName}
          setLabId={setLabId}
          uniqueLabs={laboratories}
          problems={problems}
          isLoadingProblems={isLoadingProblems}
          selectedProblems={selectedProblems}
          setSelectedProblems={setSelectedProblems}
          originalProblems={originalProblems}
          placeId={placeId || ''}
          placeSortOrder={placeSortOrder}
          edit={!!placeId}
        />

        {/* DIALOG DELETE */}
        {openDelete && (
          <DialogDelete
            title={name}
            open={openDelete}
            onOpenChange={setOpenDelete}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </main>
  )
}
