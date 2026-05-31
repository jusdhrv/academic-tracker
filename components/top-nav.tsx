'use client'

import { Search, Flame, Clock, User } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function TopNav() {
  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-8 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search questions, topics..."
            className="pl-10 bg-secondary border-border text-sm"
          />
        </div>
      </div>

      {/* Right side info */}
      <div className="flex items-center gap-6">
        {/* Study Streak */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-sm font-semibold text-foreground">24 days</div>
            </div>
          </div>
        </div>

        {/* Review Count */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Due Today</div>
            <div className="text-sm font-semibold text-foreground">47</div>
          </div>
        </div>

        {/* Profile */}
        <button className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center hover:opacity-90 transition-opacity">
          <User className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
    </div>
  )
}
