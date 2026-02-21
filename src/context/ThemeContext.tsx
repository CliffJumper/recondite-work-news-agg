import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getUserPreferences, updateUserPreferences } from '../services/userService';

export type Theme = 'cyberpunk' | 'corporate' | 'sunset' | 'terminal';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'cyberpunk';
    });

    // 1. Sync from backend on login
    useEffect(() => {
        if (user) {
            getUserPreferences(user.uid).then((prefs) => {
                if (prefs.theme) {
                    setThemeState(prefs.theme);
                }
            });
        }
    }, [user]);

    // 2. Sync to local storage and DOM
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 3. Sync to backend on change
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        if (user) {
            updateUserPreferences(user.uid, { theme: newTheme });
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
