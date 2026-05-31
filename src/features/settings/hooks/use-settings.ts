'use client'

import { useState } from 'react'
import { DEFAULT_USER_SETTINGS, type UserSettings } from '@/types/settings'

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS)

  const handleSettingChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return { settings, handleSettingChange }
}
