'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Icon from '@/components/ui/icon'
import { useState } from 'react'

const sidebarItems = [
  {
    name: 'Knowledge',
    href: '/settings/knowledge',
    icon: 'references' as const
  },
  {
    name: 'Other',
    href: '/settings/other',
    icon: 'hammer' as const
  }
]

export default function SettingsSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className="relative flex h-screen shrink-0 grow-0 flex-col overflow-hidden px-2 py-3 font-dmmono">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-2 top-2 z-10 p-1"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        type="button"
      >
        <Icon
          type="sheet"
          size="xs"
          className={`transform ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      <div
        className={cn(
          'flex h-full w-60 flex-col space-y-5 transition-all duration-300',
          isCollapsed && 'pointer-events-none w-12 opacity-0'
        )}
      >
        <div className="flex items-center gap-2">
          <Icon type="agno" size="xs" />
          <span className="text-xs font-medium uppercase text-primary">
            Settings
          </span>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium uppercase transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-primary/5 hover:text-primary'
                )}
              >
                <Icon type={item.icon} size="xs" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
