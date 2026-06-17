'use client'

import { Sidebar } from '@/components/layout/sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 mt-16 p-8">{children}</main>
    </div>
  )
}
