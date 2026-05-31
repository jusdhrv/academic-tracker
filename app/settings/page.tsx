'use client'

import { Sidebar } from '@/components/sidebar'
import { TopNav } from '@/components/top-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Save, Download, Upload, Moon, Sun, Bell } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    defaultSessionTime: 30,
    defaultTimePerQuestion: 2.5,
    autoStartTimer: false,
    soundEnabled: true,
    emailDigest: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Customize your study experience and preferences.</p>
          </div>

          <div className="space-y-6">
            {/* Theme Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                Theme
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Appearance</label>
                  <div className="flex gap-3">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                    ].map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => handleSettingChange('theme', theme.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          settings.theme === theme.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <theme.icon className="w-4 h-4" />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Study Preferences */}
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

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoStartTimer}
                      onChange={(e) => handleSettingChange('autoStartTimer', e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground">Auto-start timer when opening a question</span>
                  </label>
                </div>

                <div className="space-y-2">
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
            </div>

            {/* Notifications */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Enable notifications</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailDigest}
                    onChange={(e) => handleSettingChange('emailDigest', e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Weekly email digest</span>
                </label>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Data Management</h2>
              <div className="space-y-3">
                <div className="p-4 bg-secondary rounded">
                  <div className="text-sm text-muted-foreground mb-2">Last backup: 2 hours ago</div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Data
                  </Button>
                </div>

                <div className="p-4 bg-secondary rounded">
                  <div className="text-sm text-muted-foreground mb-2">Restore your study data from a previous backup</div>
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary/50 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Account</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    value="student@example.com"
                    disabled
                    className="bg-secondary border-border text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Username</label>
                  <Input
                    type="text"
                    value="studyking"
                    disabled
                    className="bg-secondary border-border text-muted-foreground"
                  />
                </div>

                <Button variant="outline" className="w-full border-red-900/50 text-red-400 hover:bg-red-900/20">
                  Change Password
                </Button>
              </div>
            </div>

            {/* Save Changes */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
                Reset to Defaults
              </Button>
            </div>

            {/* Info Section */}
            <div className="bg-secondary rounded-lg p-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Last Updated:</strong> November 7, 2024</p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs">Need help? Visit our <a href="#" className="text-primary hover:underline">Help Center</a> or <a href="#" className="text-primary hover:underline">Contact Support</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
