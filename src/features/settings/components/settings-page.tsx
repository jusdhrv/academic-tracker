'use client'

import { Save, Download, Upload, Moon, Sun, Bell } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSettings } from '@/features/settings/hooks/use-settings'

export function SettingsPage() {
  const { settings, handleSettingChange } = useSettings()

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your study experience and preferences.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Study Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Default Session Time (minutes)</label>
                <Input
                  type="number"
                  value={settings.defaultSessionTime}
                  onChange={(e) => handleSettingChange('defaultSessionTime', Number(e.target.value))}
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Default Time Per Question (minutes)</label>
                <Input
                  type="number"
                  value={settings.defaultTimePerQuestion}
                  onChange={(e) => handleSettingChange('defaultTimePerQuestion', Number(e.target.value))}
                  className="bg-secondary border-border text-foreground"
                  step="0.5"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoStartTimer}
                  onChange={(e) => handleSettingChange('autoStartTimer', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">Auto-start timer when opening a question</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">Enable sound notifications</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
