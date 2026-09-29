import { Card } from '../components/Card';
import { Button } from '../components/Button.tsx';
import { Settings as SettingsIcon, Bell, Monitor, Keyboard as KeyboardIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Settings() {
  const { theme, setTheme } = useTheme();

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
              <div className="text-sm text-secondary">Switch between Light and Dark mode.</div>
            </div>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="bg-surface-color border border-border-color rounded-md px-4 py-2"
            >
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
            <select className="bg-surface-color border border-border-color rounded-md px-4 py-2">
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
            <input type="checkbox" className="w-5 h-5 accent-accent-primary" defaultChecked />
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
            <Button variant="secondary">Enable Notifications</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
