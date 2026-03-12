import Image from 'next/image'
import SidebarSheet from './sidebar'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'

const Header = () => {
  return <div className="sticky top-0 z-40 h-12 rounded-t-xl border-b border-gray-300 shadow-sm bg-white"></div>
}

export default Header
