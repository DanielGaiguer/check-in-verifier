'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonPlacesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2 max-w-full sm:max-w-6xl">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-60" />
            <Skeleton className="h-4 w-52" />
          </div>
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>

        {/* LIST OF PLACES */}
        <div className="mt-5 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="flex h-14 w-full flex-row items-center gap-3 shadow-xs transition hover:shadow-md">
              <Skeleton className="h-5 w-5 ml-2" /> {/* Drag handle */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex gap-2 mr-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </Card>
          ))}

          {/* EMPTY STATE */}
          <Card className="flex flex-col items-center justify-center py-10">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-4 w-64 mt-3" />
            <Skeleton className="h-4 w-48 mt-1" />
          </Card>
        </div>
      </div>
    </main>
  )
}