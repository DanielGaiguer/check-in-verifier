'use client'

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonHistoryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2 max-w-full sm:max-w-6xl">
      <div className="m-5 flex-1 rounded-t-xl bg-gray-50">

        {/* Header */}
        <div className="flex flex-row justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-7 w-60" />
            <Skeleton className="h-4 w-52" />
          </div>
          <div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Check-ins list */}
        <div className="mt-5 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}

          {/* Empty state */}
          <Card className="flex flex-col items-center justify-center p-6">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-4 w-60 mt-3" />
            <Skeleton className="h-4 w-48 mt-1" />
          </Card>
        </div>
      </div>
    </main>
  )
} 