'use client'

import { FlaskConical, MenuIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from './ui/sheet'

import { Button } from './ui/button'
import { SidebarMenu } from './sidebar-menu'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function SidebarSheet() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Fecha o sheet quando a rota muda
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Botão que abre */}
      <SheetTrigger>
        <Button
          size="icon"
          variant="outline"
          className="mt-4 ml-3 h-5 w-8 border-0 bg-white text-gray-600"
          asChild
        >
          <MenuIcon size={1} />
        </Button>
      </SheetTrigger>

      {/* Conteúdo */}
      <SheetContent
        side="left"
        className="w-65 overflow-y-auto bg-[#14181F] [&>button]:scale-125 [&>button]:border-0 [&>button]:bg-transparent [&>button]:p-2 [&>button]:ring-0 [&>button]:outline-none [&>button]:focus:ring-0 [&>button]:focus:ring-offset-0 [&>button]:focus:outline-none [&>button]:focus-visible:ring-0 [&>button]:focus-visible:ring-offset-0 [&>button]:focus-visible:outline-none"
      >
        <SheetHeader className="mt-2 flex flex-row border-b border-gray-700 pr-12">
          <FlaskConical
            color="white"
            className="rounded-xl bg-blue-400 p-2"
            size={35}
          />

          <div>
            <SheetTitle className="ml-1 text-left font-sans text-sm font-bold text-white">
              LabCheck
            </SheetTitle>

            <SheetDescription className="ml-1 text-xs">
              Check-in de Laboratório
            </SheetDescription>
          </div>
        </SheetHeader>

        <SidebarMenu />
      </SheetContent>
    </Sheet>
  )
}