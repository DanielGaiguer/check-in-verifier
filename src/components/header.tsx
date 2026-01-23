import Image from 'next/image'
import { Card, CardContent } from './ui/card'
import SidebarSheet from './sidebar-sheet'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'

const Header = () => {
  return (
    <>
      <Card>
        <CardContent className="flex flex-row items-center justify-between m-5 mb-2">
          <Link href="/">
            <Image
              alt="Checklist"
              src="/billing.png"
              height={12}
              width={70}
              className="ml-2"
            />
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="default"
                variant="outline"
                className="mr-2 flex min-h-17 min-w-17 items-center justify-center p-3"
                asChild
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
        </CardContent>
      </Card>
      <div className="flex flex-row items-center justify-center mt-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">Inicío</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">Realizar Check-in</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">Histórico de Check-ins</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">Relátorios de Check-ins</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  )
}

export default Header
