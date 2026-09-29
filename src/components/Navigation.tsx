import { Link, useLocation } from 'react-router-dom';
import { Keyboard, Moon, Sun, Settings, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button.tsx';

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'Practice', path: '/practice' },
    { name: 'Test', path: '/test' },
    { name: 'Progress', path: '/progress' },
  ];

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--surface)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '3.75rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-1)', textDecoration: 'none' }}>
          <Keyboard size={22} style={{ color: 'var(--accent)' }} />
          <span>TypeSprint</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {navLinks.map((link) => {
            const active = link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--accent)' : 'var(--text-2)',
                  background: active ? 'var(--accent-glow)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Button variant="icon" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Link to="/settings">
            <Button variant="icon" aria-label="Settings">
              <Settings size={18} />
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="icon" aria-label="User Profile">
              <User size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
