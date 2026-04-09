'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLaboratoriesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-60" />
            <Skeleton className="h-4 w-52" />
          </div>
          <div>
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>

        {/* Laboratory cards */}
        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="flex h-20 w-full flex-row gap-3 shadow-xs transition hover:shadow-md md:flex-row">
              <CardHeader className="flex items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>
                    <Skeleton className="h-4 w-32" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-3 w-24" />
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty state */}
          <Card className="flex flex-col items-center justify-center p-6">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-4 w-64 mt-3" />
            <Skeleton className="h-4 w-48 mt-1" />
          </Card>
        </div>
      </div>
    </main>
  )
}