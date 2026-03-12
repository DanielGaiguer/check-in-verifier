'use client'

import Link from 'next/link'
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
  textButton: string
  href: string
}

export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  description,
  textButton,
  href
}) => {
  return (
    <Card className="border-yellow-200 bg-[#FFFFF0] p-5">
      <CardHeader className="flex flex-row justify-between gap-2 p-0">
        <div className="flex flex-row items-start gap-2 p-0">
          <AlertCircle className="mt-3.5 mr-1 h-5 w-5 text-yellow-600 md:mt-2 md:mr-0" />
          <div>
            <CardTitle className="text-md font-sans leading-snug font-normal text-gray-900">
              {title}
            </CardTitle>
            <CardDescription className="mt-1 text-xs leading-tight text-gray-500">
              {description}
            </CardDescription>
          </div>
        </div>

        <div className="mt-0 flex flex-row items-start gap-2 sm:mt-2">
          <Link href={href}>
            <Button
              size="sm"
              variant="default"
              className="bg-blue-500 hover:bg-blue-600"
            >
              {textButton}
            </Button>
          </Link>
        </div>
      </CardHeader>
    </Card>
  )
}
