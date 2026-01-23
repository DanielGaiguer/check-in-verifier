'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'
import { usePathname } from 'next/navigation'

const navLinkClass = (active: boolean) =>
  `relative px-3 py-2 text-sm font-medium transition-colors
   after:absolute after:left-0 after:-bottom-1 after:h-[2px]
   after:bg-foreground after:transition-all
   ${active ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`

const NavigationMenuBar = () => {
  const pathname = usePathname()
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navLinkClass(pathname === '/')}
            >
              <Link href="/">Inicío</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navLinkClass(pathname.startsWith('/checkins'))}
            >
              <Link href="/checkins/create">Realizar Check-in</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navLinkClass(pathname.startsWith('/checkins'))}
            >
              <Link href="/">Histórico de Check-ins</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navLinkClass(pathname.startsWith('/checkins'))}
            >
              <Link href="/">Relátorios de Check-ins</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default NavigationMenuBar
