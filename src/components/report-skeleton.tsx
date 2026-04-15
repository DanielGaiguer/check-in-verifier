"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsSkeleton() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-[3%] space-y-[3%] rounded-t-xl bg-gray-50">
        {/* Header */}
        <div className="flex flex-col gap-[2%] sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>

          <Skeleton className="h-10 w-full sm:w-48" />
        </div>

        {/* Empty state cards row */}
        <div className="grid grid-cols-2 gap-[3%] sm:grid-cols-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="col-span-2 h-28 w-full rounded-xl sm:col-span-1" />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 gap-[4%] lg:grid-cols-2">
          {/* Pie chart skeleton */}
          <div className="rounded-xl border p-[4%] space-y-[4%]">
            <Skeleton className="h-6 w-[50%]" />

            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="h-62.5 w-full rounded-xl" />
          </div>

          {/* Top people */}
          <div className="rounded-xl border p-[4%] space-y-[4%]">
            <Skeleton className="h-6 w-[60%]" />
            <Skeleton className="h-62.5 w-full rounded-xl" />
          </div>

          {/* Top problems */}
          <div className="rounded-xl border p-[4%] space-y-[4%]">
            <Skeleton className="h-6 w-[70%]" />
            <Skeleton className="h-75 w-full rounded-xl" />
          </div>

          {/* Top places */}
          <div className="rounded-xl border p-[4%] space-y-[4%]">
            <Skeleton className="h-6 w-[65%]" />
            <Skeleton className="h-75 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  )
}