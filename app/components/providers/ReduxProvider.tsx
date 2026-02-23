'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/store/store';
import { loadStoredUser } from '@/app/store/slices/authSlice';
import { initializeTheme, setResolvedTheme } from '@/app/store/slices/themeSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store);
  const initialized = useRef(false);
  const previousTheme = useRef<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    if (!initialized.current) {
      // Initialize theme from localStorage
      storeRef.current.dispatch(initializeTheme());
      
      // Load stored user
      storeRef.current.dispatch(loadStoredUser());
      
      initialized.current = true;
    }
  }, []);

  // Handle theme resolution and system preference changes
  useEffect(() => {
    const updateResolvedTheme = () => {
      const state = storeRef.current.getState();
      const { theme } = state.theme;
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        storeRef.current.dispatch(setResolvedTheme(systemTheme));
      } else {
        storeRef.current.dispatch(setResolvedTheme(theme as 'light' | 'dark'));
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const state = storeRef.current.getState();
      if (state.theme.theme === 'system') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Subscribe to theme changes in store - only update if theme preference changed
    const unsubscribe = storeRef.current.subscribe(() => {
      const state = storeRef.current.getState();
      const currentTheme = state.theme.theme;
      
      // Only update if the theme preference (not resolvedTheme) changed
      if (currentTheme !== previousTheme.current) {
        previousTheme.current = currentTheme;
        updateResolvedTheme();
      }
    });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      unsubscribe();
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const unsubscribe = storeRef.current.subscribe(() => {
      const state = storeRef.current.getState();
      const { resolvedTheme } = state.theme;
      const root = document.documentElement;
      
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    });

    // Apply initial theme
    const state = storeRef.current.getState();
    const root = document.documentElement;
    if (state.theme.resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
