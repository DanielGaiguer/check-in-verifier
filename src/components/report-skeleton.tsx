'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsSkeleton() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col rounded-t-xl bg-gray-50 md:mt-2 max-w-full sm:max-w-6xl">
      <div className="m-5 rounded-t-xl bg-gray-50">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>

          <Skeleton className="h-10 w-40" />
        </div>

        {/* Cards métricas */}
        <div className="mt-3 mb-4 grid grid-cols-2 gap-4 p-1 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex min-h-30 w-full flex-col shadow-xs">
              <CardContent className="flex h-full flex-col items-center justify-center gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full rounded-md" />
            </CardContent>
          </Card>

          {/* Top People */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-52" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full rounded-md" />
            </CardContent>
          </Card>

          {/* Top Problems */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full rounded-md" />
            </CardContent>
          </Card>

          {/* Top Places */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full rounded-md" />
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  )
}