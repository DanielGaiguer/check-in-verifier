'use client'

import { useEffect, useState } from 'react'
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
import { usePlaces } from '@/hooks/usePlaces'

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
    useSortable({
      id: place.id,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

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
              {place.labId?.name ?? '—'}
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
  console.log(places)
  const [placesState, setPlacesState] = useState(places)

  useEffect(() => {
    setPlacesState(places)
  }, [places])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar os problemas.</p>

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = placesState.findIndex((p) => p.id === active.id)
    const newIndex = placesState.findIndex((p) => p.id === over.id)

    const reordered = arrayMove(placesState, oldIndex, newIndex)

    const updated = reordered.map((p, index) => ({
      ...p,
      sortOrder: index,
    }))

    setPlacesState(updated)

    /* 
    FUTURO BANCO:

    await updateSortOrder(updated)

    */
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

          <Button className="w-35 rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300">
            <PlusIcon className="mr-1 mb-0.5" />
            Novo lugar
          </Button>
        </div>

        {/* LIST */}

        <div className="mt-5">
          {placesState.length === 0 ? (
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
                items={placesState.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {placesState.map((place) => (
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
