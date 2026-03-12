'use client'

import { FlaskConical } from 'lucide-react'
import { SidebarMenu } from './sidebar-menu'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-65 flex-col overflow-y-auto bg-[#14181F] border-r border-gray-700">
      
      <div className="mt-4 flex flex-row border-b border-gray-700 px-5 pb-4">
        <FlaskConical
          color="white"
          className="rounded-xl bg-blue-400 p-2"
          size={35}
        />

        <div className="ml-2">
          <h1 className="font-sans text-sm font-bold text-white">
            LabCheck
          </h1>

          <p className="text-xs text-gray-400">
            Check-in de Laboratório
          </p>
        </div>
      </div>

      <SidebarMenu />
    </aside>
  )
}