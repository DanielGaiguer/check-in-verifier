'use client'

import { Button } from './ui/button'
import {
  CalendarIcon,
  ChartColumn,
  ChartNoAxesCombined,
  ClipboardCheckIcon,
  FlaskConical,
  HistoryIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  TriangleAlertIcon,
  UsersRoundIcon,
} from 'lucide-react'
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SidebarSheet = () => {
  const pathname = usePathname()

  const isActive = pathname === '/' // ajustar para cada rota

  return (
    <SheetContent
      className="w-65 overflow-y-auto bg-[#14181F] [&>button]:scale-125 [&>button]:border-0 [&>button]:bg-transparent [&>button]:p-2 [&>button]:ring-0 [&>button]:outline-none [&>button]:focus:ring-0 [&>button]:focus:ring-offset-0 [&>button]:focus:outline-none [&>button]:focus-visible:ring-0 [&>button]:focus-visible:ring-offset-0 [&>button]:focus-visible:outline-none"
      side="left"
    >
      <SheetHeader className="mt-2 flex flex-row border-b border-b-gray-700 pr-12">
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

      <div className="mr-5 ml-5 flex flex-col gap-1 py-5 font-sans">
        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              isActive
                ? 'bg-gray-800 text-blue-400' // estilo quando selecionado
                : 'text-gray-600 hover:bg-gray-700 hover:text-white' // estilo normal
            }`}
            variant="default"
            asChild
          >
            <Link href="/">
              <LayoutDashboardIcon size={15} />
              Dashboard
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              pathname === '/checkins/create'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href="/checkins/create">
              <ClipboardCheckIcon size={15} />
              Novo Check-in
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              pathname === '/new'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href="/history">
              <HistoryIcon size={15} />
              Histórico
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              pathname === '/history'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href="/reports">
              <ChartColumn size={15} />
              Relatórios
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              pathname === '/history'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href="/laboratories">
              <FlaskConical size={15} />
              Laboratórios
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              pathname === '/places'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href="/reports">
              <ChartColumn size={15} />
              Relatórios
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              pathname === '/places'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href="/places">
              <MapPinIcon size={15} />
              Lugares
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              pathname === '/places'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href="/reports">
              <TriangleAlertIcon size={15} />
              Problemas
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className={`mb-2 justify-start gap-4 text-sm ${
              pathname === '/places'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            variant="default"
            asChild
          >
            <Link href="/reports">
              <UsersRoundIcon size={15} />
              Pessoas
            </Link>
          </Button>
        </SheetClose>
      </div>
    </SheetContent>
  )
}

export default SidebarSheet
