'use client'
import { Card, CardHeader } from './ui/card'

export default function SelectCardSkeleton() {
  return (
    <Card className="mt-5 animate-pulse">
      <CardHeader className="flex flex-col gap-2">
        {/* Header */}
        <div className="h-4 w-1/3 rounded bg-gray-200" />

        {/* Select trigger placeholder */}
        <div className="mt-2 h-10 w-full max-w-80 rounded bg-gray-200" />
      </CardHeader>
    </Card>
  )
}