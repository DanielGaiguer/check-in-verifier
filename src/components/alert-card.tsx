'use client'

import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card'
import { AlertCircle } from 'lucide-react'

interface AlertCardProps {
  title: string
  description: React.ReactNode
}

export const AlertCard: React.FC<AlertCardProps> = ({ title, description }) => {
  return (
    <Card className="border-yellow-200 bg-[#FFFFF0] p-5">
      <CardHeader className="flex flex-row justify-between gap-2 p-0">
        <div className="flex flex-row items-start gap-2 p-0">
          <AlertCircle className="mt-2 h-5 w-5 text-yellow-600" />
          <div>
            <CardTitle className="font-sans text-md leading-snug font-normal text-gray-900">
              {title}
            </CardTitle>
            <CardDescription className="mt-1 text-xs leading-tight text-gray-500">
              {description}
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-row items-start gap-2 mt-0 sm:mt-2">
          <Button size="sm" variant="default" className="bg-blue-500">
            Fazer Check-in
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
