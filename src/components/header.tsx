import Image from 'next/image'
import SidebarSheet from './sidebar'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'

const Header = () => {
  return <div className="md:sticky top-0 z-40 h-5 md:h-12 flex items-center px-4 border-b border-gray-300 shadow-sm bg-white rounded-t-xl"></div>
}

export default Header
