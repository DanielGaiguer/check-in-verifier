import Image from 'next/image'
import SidebarSheet from './sidebar-sheet'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'

const Header = () => {
  return (
    <div className='h-10 rounded-t-xl mt-3  border-b border-gray-300'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-5 w-7 text-gray-600 bg-white border-0 ml-3"
                asChild
              >
                <MenuIcon size={1} />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
    </div>
  )
}

export default Header
