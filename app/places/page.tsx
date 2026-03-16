'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FlaskConicalIcon, PlusIcon, MapPin, GripVertical, Pencil, Trash2 } from 'lucide-react'

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

/* ---------------- MOCK DATA (igual schema) ---------------- */

const mockPlaces = [
  {
    id: '1',
    labId: 'lab-1',
    name: 'Bancada A',
    sortOrder: 0,
    createdAt: '2026-03-07',
    laboratory: { name: 'Lab 30' },
  },
  {
    id: '2',
    labId: 'lab-1',
    name: 'Microscópio',
    sortOrder: 1,
    createdAt: '2026-03-07',
    laboratory: { name: 'Lab 30' },
  },
  {
    id: '3',
    labId: 'lab-2',
    name: 'Bancada B',
    sortOrder: 2,
    createdAt: '2026-03-07',
    laboratory: { name: 'Lab 31' },
  },
]

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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: place.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardContent className="flex items-center gap-3 h-9">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 shrink-0">
            <MapPin className="h-5 w-5 text-blue-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{place.name}</p>
            <p className="text-xs text-muted-foreground">
              {place.laboratory?.name ?? '—'}
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
  const [places, setPlaces] = useState(mockPlaces)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = places.findIndex((p) => p.id === active.id)
    const newIndex = places.findIndex((p) => p.id === over.id)

    const reordered = arrayMove(places, oldIndex, newIndex)

    const updated = reordered.map((p, index) => ({
      ...p,
      sortOrder: index,
    }))

    setPlaces(updated)

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

            <Button className="rounded-md bg-blue-400 p-5 font-sans text-white hover:bg-blue-300 w-35">
            <PlusIcon className="mr-1 mb-0.5" />
            Novo lugar
          </Button>
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