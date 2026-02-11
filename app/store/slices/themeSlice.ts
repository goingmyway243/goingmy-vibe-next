import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
}

const initialState: ThemeState = {
  theme: 'system',
  resolvedTheme: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    setResolvedTheme: (state, action: PayloadAction<ResolvedTheme>) => {
      state.resolvedTheme = action.payload;
    },
    initializeTheme: (state) => {
      // Load theme from localStorage
      if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
          state.theme = storedTheme;
        }
      }
    },
  },
});

export const { setTheme, setResolvedTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
