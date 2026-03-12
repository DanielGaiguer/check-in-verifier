'use client'

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
    <div className="mr-5 ml-5 flex flex-col gap-1 py-5 font-sans">
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
    </div>
  )
}