'use client'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import UserProfile from '@/components/playground/Sidebar/UserProfile'

type SidebarSection = 'knowledge' | 'other'

const KnowledgeSidebar = () => {
  const [activeSection, setActiveSection] =
    useState<SidebarSection>('knowledge')

  const sidebarItems = [
    {
      id: 'knowledge' as SidebarSection,
      label: 'Knowledge',
      icon: 'book-open' as const
    },
    {
      id: 'other' as SidebarSection,
      label: 'Other',
      icon: 'search' as const
    }
  ]

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col overflow-hidden px-2 py-3 font-dmmono">
      <div className="flex h-full flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Icon type="agno" size="xs" />
          <span className="text-xs font-medium uppercase text-white">
            KMSLV Knowledge
          </span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start rounded-xl p-3 text-xs font-medium uppercase transition-colors duration-200',
                activeSection === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-primary/5 hover:text-primary'
              )}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon type={item.icon} size="xs" className="mr-2" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* User Profile at bottom */}
        <div className="mt-auto pt-4">
          <UserProfile />
        </div>
      </div>
    </aside>
  )
}

export default KnowledgeSidebar
