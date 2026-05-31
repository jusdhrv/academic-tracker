import {
  BarChart3,
  BookOpen,
  Brain,
  Dumbbell,
  Home,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

export const MAIN_NAVIGATION: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Cataloging', href: '/cataloging', icon: BookOpen },
  { name: 'Theory Practice', href: '/theory-practice', icon: Brain },
  { name: 'Question Practice', href: '/question-practice', icon: Dumbbell },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]
