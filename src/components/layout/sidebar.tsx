'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookMarked } from 'lucide-react'
import { MAIN_NAVIGATION } from '@/constants/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <BookMarked className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <div className="font-bold text-base text-foreground">IIT-JEE</div>
          <div className="text-xs text-muted-foreground">Study Platform</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {MAIN_NAVIGATION.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
