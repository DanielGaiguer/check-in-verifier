'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">

        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>

        {/* Alert */}
        <div className="mt-5">
          <Card>
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-5 w-60" />
              <Skeleton className="h-4 w-full max-w-[420px]" />
              <Skeleton className="h-10 w-36" />
            </CardContent>
          </Card>
        </div>

        {/* Info cards */}
        <div className="mt-5 grid grid-cols-2 gap-4 p-1 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Últimos check-ins */}
        <div className="mt-6 space-y-4">

          <Skeleton className="h-6 w-48" />

          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>

                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </main>
  )
}