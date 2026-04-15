"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonHistoryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-[3%] flex-1 rounded-t-xl bg-gray-50 space-y-[4%]">
        {/* Header */}
        <div className="flex flex-col gap-[4%] md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-[60%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>

          <Skeleton className="h-10 w-full md:w-44 mt-4 md:mt-0" />
        </div>

        {/* List skeleton */}
        <div className="mt-[4%] space-y-[3%]">
          {/* Card 1 */}
          <div className="rounded-xl border p-[4%] space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-[40%]" />
              <Skeleton className="h-4 w-[20%]" />
            </div>
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[50%]" />
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border p-[4%] space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-[45%]" />
              <Skeleton className="h-4 w-[25%]" />
            </div>
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[55%]" />
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border p-[4%] space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-[50%]" />
              <Skeleton className="h-4 w-[20%]" />
            </div>
            <Skeleton className="h-4 w-[65%]" />
            <Skeleton className="h-4 w-[45%]" />
          </div>

          {/* repeat generic loading cards (mobile-friendly) */}
          <div className="rounded-xl border p-[4%] space-y-3">
            <Skeleton className="h-5 w-[55%]" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[50%]" />
          </div>
        </div>
      </div>
    </main>
  )
}
