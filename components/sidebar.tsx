'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, BookOpen, Brain, Dumbbell, Home, Settings, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Cataloging', href: '/cataloging', icon: BookOpen },
  { name: 'Theory Practice', href: '/theory-practice', icon: Brain },
  { name: 'Question Practice', href: '/question-practice', icon: Dumbbell },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <div className="font-bold text-base text-foreground">PCM</div>
          <div className="text-xs text-muted-foreground">Study Platform</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
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
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary-foreground">SK</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">Study King</div>
            <div className="text-xs text-muted-foreground truncate">Tier 1 Learner</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
