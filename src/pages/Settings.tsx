import { Card } from '../components/Card';
import { Button } from '../components/Button.tsx';
import { Settings as SettingsIcon, Bell, Monitor, Keyboard as KeyboardIcon, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLocalStorage, INITIAL_SETTINGS, INITIAL_PROGRESS } from '../hooks/useLocalStorage';
import type { UserSettings, UserProgress } from '../hooks/useLocalStorage';
import { useState } from 'react';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useLocalStorage<UserSettings>('typesprint-settings', INITIAL_SETTINGS);
  const [, setProgress] = useLocalStorage<UserProgress>('typesprint-progress', INITIAL_PROGRESS);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="text-accent" size={32} />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="text-secondary" size={24} />
            <h2 className="text-xl font-bold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border-color">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-secondary">Switch between Light, Dark, or System mode.</div>
            </div>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="bg-surface-color border border-border-color rounded-md px-4 py-2"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <KeyboardIcon className="text-secondary" size={24} />
            <h2 className="text-xl font-bold">Typing Preferences</h2>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border-color">
            <div>
              <div className="font-medium">Default Test Duration</div>
              <div className="text-sm text-secondary">Set the default length for typing tests.</div>
            </div>
            <select 
              value={settings.defaultDuration}
              onChange={(e) => setSettings((prev) => ({ ...prev, defaultDuration: parseInt(e.target.value, 10) }))}
              className="bg-surface-color border border-border-color rounded-md px-4 py-2"
            >
              <option value="15">15 Seconds</option>
              <option value="30">30 Seconds</option>
              <option value="60">60 Seconds</option>
              <option value="120">2 Minutes</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border-color">
            <div>
              <div className="font-medium">Show Visual Keyboard</div>
              <div className="text-sm text-secondary">Display the on-screen keyboard during tests.</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.showKeyboard}
              onChange={(e) => setSettings((prev) => ({ ...prev, showKeyboard: e.target.checked }))}
              className="w-5 h-5 accent-accent-primary cursor-pointer" 
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-secondary" size={24} />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Daily Reminders</div>
              <div className="text-sm text-secondary">Get reminded to practice every day.</div>
            </div>
            <Button 
              variant={settings.dailyReminder ? 'primary' : 'secondary'}
              onClick={() => setSettings((prev) => ({ ...prev, dailyReminder: !prev.dailyReminder }))}
            >
              {settings.dailyReminder ? 'Enabled' : 'Enable Reminders'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="text-red-500" size={24} />
            <h2 className="text-xl font-bold">Data & Progress</h2>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Reset Progress</div>
              <div className="text-sm text-secondary">Clear all saved test history, statistics, and unlocked lessons.</div>
            </div>
            <Button 
              variant="secondary"
              style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
              onClick={handleResetProgress}
            >
              {resetConfirmed ? '✓ Progress Reset!' : 'Reset All Progress'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
