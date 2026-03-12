'use client'

import { Button } from './ui/button'
import {
  CalendarIcon,
  ChartNoAxesCombined,
  FlaskConical,
  HistoryIcon,
  LayoutDashboardIcon,
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

  const isActive = pathname === '/'  // ajustar para cada rota

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

      <div className="flex flex-col gap-1 py-5 ml-5 mr-5 font-sans">
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
            <CalendarIcon size={15} />
            Realizar Check-in
          </Link>
        </Button>
      </SheetClose>

      <SheetClose asChild>
        <Button
          className={`mb-2 justify-start gap-4 text-sm ${
            pathname === '/bookings'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
          variant="default"
          asChild
        >
          <Link href="/bookings">
            <HistoryIcon size={15} />
            Histórico de Check-ins
          </Link>
        </Button>
      </SheetClose>

      <SheetClose asChild>
        <Button
          className={`mb-2 justify-start gap-4 text-sm ${
            pathname === '/bookings'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
          variant="default"
          asChild
        >
          <Link href="/bookings">
            <ChartNoAxesCombined size={15} />
            Relatórios de Check-ins
          </Link>
        </Button>
      </SheetClose>
      </div>

      {/* <div className="flex flex-col gap-1 border-b border-solid py-5">
        {quickSearchOptions.map((option) => (
          <SheetClose key={option.title} asChild>
            <Button className="justify-start gap-2" variant="ghost">
              <Link
                className="flex items-center gap-2"
                href={`/barbershops?service=${option.title}`}
              >
                <Image
                  alt={option.title}
                  src={option.imageUrl}
                  height={18}
                  width={18}
                />
                {option.title}
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div> */}

      {/* {data?.user && (
        <div className="flex flex-col gap-1 border-b border-solid py-5">
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )} */}
    </SheetContent>
  )
}

export default SidebarSheet
