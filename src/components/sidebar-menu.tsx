'use client'

import { LinkIcon } from 'lucide-react'
import { sidebarItems } from './sidebar-items'
import { Button } from './ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  onItemClick?: () => void
}

export function SidebarMenu({ onItemClick }: Props) {
  const pathname = usePathname()

  return (
    <div className="relative mr-5 ml-5 flex h-full flex-col gap-1 py-5 font-sans">
      {sidebarItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Button
            key={item.href}
            onClick={onItemClick}
            className={`mb-2 justify-start gap-4 text-sm ${
              isActive
                ? 'bg-gray-800 text-blue-400'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href={item.href}>
              <Icon size={15} />
              {item.title}
            </Link>
          </Button>
        )
      })}
      <Link href="https://github.com/DanielGaiguer" target="_blank" rel="noopener noreferrer">
        <div className="absolute bottom-3 left-0 inline-flex w-full text-xs text-gray-400">
            <LinkIcon size={15} className='mr-1' />
            By Daniel Gaiguer
        </div>
      </Link>
    </div>
  )
}
