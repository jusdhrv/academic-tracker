export interface UserSettings {
  theme: 'light' | 'dark'
  notifications: boolean
  defaultSessionTime: number
  defaultTimePerQuestion: number
  autoStartTimer: boolean
  soundEnabled: boolean
  emailDigest: boolean
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'dark',
  notifications: true,
  defaultSessionTime: 30,
  defaultTimePerQuestion: 2.5,
  autoStartTimer: false,
  soundEnabled: true,
  emailDigest: true,
}
