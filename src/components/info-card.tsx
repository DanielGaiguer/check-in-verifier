'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card'
import * as Icons from 'lucide-react'
import Link from 'next/link'

interface InfoCardProps {
  title: number | string
  description: string
  iconName: keyof typeof Icons // nome do ícone como string
  iconColor?: string
  iconBgColor?: string
  href?: string
}

export function InfoCard({
  title,
  description,
  iconName,
  iconColor = 'text-white',
  iconBgColor = 'bg-blue-500',
  href,
}: InfoCardProps) {
  const Icon = Icons[iconName] as unknown as (
    props: React.ComponentProps<typeof Icons.HomeIcon>
  ) => React.JSX.Element

  if (href) {
    return (
      <Link href={href}>
        <Card className="flex w-full min-h-45 md:min-h-0 flex-col gap-3 shadow-xs md:flex-row">
          <CardHeader className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgColor}`}
            >
              <Icon className={`h-5 w-15 ${iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Card className="flex w-full flex-col gap-3 shadow-xs md:flex-row">
      <CardHeader className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgColor}`}
        >
          <Icon className={`h-5 w-15 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}



// 'use client'

// import React from 'react'
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from './ui/card'
// import * as Icons from 'lucide-react'
// import Link from 'next/link'

// interface InfoCardProps {
//   title: number | string
//   description: string
//   iconName: keyof typeof Icons // nome do ícone como string
//   iconColor?: string
//   iconBgColor?: string
//   href?: string
// }

// export function InfoCard({
//   title,
//   description,
//   iconName,
//   iconColor = 'text-white',
//   iconBgColor = 'bg-blue-500',
//   href,
// }: InfoCardProps) {
//   const Icon = Icons[iconName] as unknown as (
//     props: React.ComponentProps<typeof Icons.HomeIcon>
//   ) => React.JSX.Element

//   if (href) {
//     return (
//       <Link href={href}>
//         <Card className="flex h-full min-h-45 w-full flex-col items-center justify-center gap-3 text-center shadow-xs md:min-h-0 md:flex-row md:items-start md:justify-start md:text-left">
//           <CardHeader className="flex items-center justify-center md:justify-start">
//             <div
//               className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgColor}`}
//             >
//               <Icon className={`h-5 w-15 ${iconColor}`} />
//             </div>
//           </CardHeader>

//           <CardContent className="flex flex-col items-center md:items-start">
//             <CardTitle className="text-2xl">{title}</CardTitle>
//             <CardDescription>{description}</CardDescription>
//           </CardContent>
//         </Card>
//       </Link>
//     )
//   }

//   return (
//     <Card className="flex w-full flex-col gap-3 shadow-xs md:flex-row">
//       <CardHeader className="flex items-center gap-4">
//         <div
//           className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgColor}`}
//         >
//           <Icon className={`h-5 w-15 ${iconColor}`} />
//         </div>
//       </CardHeader>
//       <CardContent>
//         <CardTitle className="text-2xl">{title}</CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardContent>
//     </Card>
//   )
// }
