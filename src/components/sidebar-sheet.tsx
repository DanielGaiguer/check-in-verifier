'use client'

import { Button } from './ui/button'
import {
  CalendarIcon,
  ChartNoAxesCombined,
  HistoryIcon,
  HomeIcon,
} from 'lucide-react'
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'
import Link from 'next/link'

const SidebarSheet = () => {
  return (
    <SheetContent className="overflow-y-auto [&>button]:scale-125 [&>button]:p-2 [&>button>svg]:h-7 [&>button>svg]:w-7 ">
      <SheetHeader className="mt-2 pr-12">
        <SheetTitle className="text-left text-2xl">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col gap-1 border-b border-solid py-5">
        <SheetClose asChild>
          <Button
            className="mb-2 justify-start gap-4 text-xl text-gray-600 [&_svg]:size-6!"
            variant="ghost"
            asChild
          >
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className="mb-2 justify-start gap-4 text-xl text-gray-600 [&_svg]:size-6!"
            variant="ghost"
            asChild
          >
            <Link href="/checkins/create">
              <CalendarIcon size={18} />
              Realizar Check-in
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className="mb-2 justify-start gap-4 text-xl text-gray-600 [&_svg]:size-6!"
            variant="ghost"
            asChild
          >
            <Link href="/bookings">
              <HistoryIcon size={18} />
              Histórico de Check-ins
            </Link>
          </Button>
        </SheetClose>

        <SheetClose asChild>
          <Button
            className="mb-2 justify-start gap-4 text-xl text-gray-600 [&_svg]:size-6!"
            variant="ghost"
            asChild
          >
            <Link href="/bookings">
              <ChartNoAxesCombined size={18} />
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
