'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card'
import { Button } from './ui/button'
import * as Icons from 'lucide-react'

interface EditCardProps {
  title: string | number
  description?: string
  iconName?: keyof typeof Icons // Passamos apenas o nome da chave
  iconColor?: string
  iconBgColor?: string
}

export function EditCard({
  title,
  description,
  iconName,
  iconColor = 'text-blue-400',
  iconBgColor = 'bg-blue-50',
}: EditCardProps) {
  // Resolve o ícone **dentro do componente**, nunca passa a função para props
  const Icon = iconName ? (Icons[iconName] as React.ComponentType<{ className?: string; size?: number }>) : null

  return (
    <Card className="flex w-full flex-row gap-3 shadow-xs transition hover:shadow-md md:flex-row h-20">
      <CardHeader className="flex items-center">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBgColor}`}>
          {Icon && <Icon className={iconColor} size={22} />}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-between">
        <div>
          <CardTitle className="text-md font-sans font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="font-sans text-sm">{description}</CardDescription>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-white hover:bg-blue-50">
            <Icons.PencilIcon className="text-black" size={25} />
          </Button>
          <Button className="bg-white hover:bg-blue-50">
            <Icons.Trash2Icon className="text-red-400" size={25} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}