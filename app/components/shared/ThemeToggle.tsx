'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setTheme as setThemeAction } from '@/app/store/slices/themeSlice';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
        title="Change theme"
        aria-label="Theme selector"
      >
        <CurrentIcon className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-colors" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  dispatch(setThemeAction(value));
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-all duration-150 ${
                  theme === value
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${theme === value ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span className="text-sm flex-1">{label}</span>
                {theme === value && (
                  <span className="text-indigo-600 dark:text-indigo-400 text-base">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
