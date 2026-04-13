'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CheckinsSkeleton() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2 max-w-full sm:max-w-6xl">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">

        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-56" />
        </div>

        {/* Select responsável */}
        <div className="mt-4">
          <Card>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Place cards */}
        <div className="mt-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>

              <CardContent className="space-y-4">

                {/* Botões status */}
                <div className="flex gap-3">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-28" />
                </div>

                {/* Problemas */}
                <Skeleton className="h-4 w-40" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-24" />
                </div>

                {/* Observação */}
                <Skeleton className="h-16 w-full" />

                {/* Upload */}
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Observação geral */}
        <div className="mt-4">
          <Card>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Botão */}
        <div className="mt-5 flex justify-end">
          <Skeleton className="h-11 w-44" />
        </div>

      </div>
    </main>
  )
}