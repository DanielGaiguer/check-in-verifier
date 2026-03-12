'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import * as Icons from 'lucide-react'

interface InfoCardProps {
  number: number | string
  description: string
  iconName: keyof typeof Icons // nome do ícone como string
  iconColor?: string
  iconBgColor?: string
}

export function InfoCard({
  number,
  description,
  iconName,
  iconColor = 'text-white',
  iconBgColor = 'bg-blue-500',
}: InfoCardProps) {
  const Icon = Icons[iconName] as unknown as (props: React.ComponentProps<typeof Icons.HomeIcon>) => React.JSX.Element

  return (
    <Card className="w-full flex flex-col md:flex-row gap-3 shadow-xs">
      <CardHeader className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${iconBgColor}`}>
          <Icon className={`w-15 h-5 ${iconColor}`} />
        </div>
				
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl">{number}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}