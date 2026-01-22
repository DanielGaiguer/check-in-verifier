import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import SidebarSheet from "./sidebar-sheet"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import Link from "next/link"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/">
          <Image alt="Checklist" src="/billing.png" height={12} width={80} className="ml-4"/>
        </Link>
        <Sheet>
          <SheetTrigger asChild >
            <Button size="default" variant="outline" className="p-4 min-w-18 min-h-16 flex items-center justify-center" asChild>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          {/* <SidebarSheet /> */}
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header