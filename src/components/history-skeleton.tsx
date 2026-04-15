'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonHistoryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col overflow-x-hidden rounded-t-xl bg-gray-50 md:mt-2">
      <div className="rounded-t-xl bg-gray-50 px-4 py-5 sm:px-5">
        <div className="flex flex-row md:items-start md:justify-between md:mt-0 mt-15">
          <div className="space-y-2">
            <Skeleton className="h-7 w-[90%]" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
          <div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Check-ins list */}
        <div className="mt-5 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <div className="flex md:items-center md:justify-between flex-col p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-3 w-[50%]" />
                </div>
                <Skeleton className="h-8 w-[40%] mt-2" />
              </div>
            </Card>
          ))}

          {/* Empty state */}
          <Card className="flex flex-col items-center justify-center p-6">
            <Skeleton className="h-14 w-[30%] rounded-full" />
            <Skeleton className="mt-3 h-4 w-[20%]" />
            <Skeleton className="mt-1 h-4 w-[20%]" />
          </Card>
        </div>
      </div>
    </main>
  )
}
