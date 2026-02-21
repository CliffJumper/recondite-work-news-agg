import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, List, Settings, Terminal } from 'lucide-react';

const NAV_ITEMS = [
    { path: '/', label: 'NET_FEED', icon: Home },
    { path: '/saved', label: 'DATA_BANK', icon: Bookmark },
    { path: '/lists', label: 'PROTOCOLS', icon: List },
    { path: '/settings', label: 'SYSTEM_CONFIG', icon: Settings },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)] w-full">
            {/* Scanline Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat"
                style={{ opacity: 'var(--scanline-opacity, 0.5)' }}
            />

            {/* Persistent Top Toolbar */}
            <header className="sticky top-0 z-40 w-full bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border-glow)] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] opacity-70" />

                <div className="w-full max-w-7xl mx-auto px-3 md:px-4 h-16 flex items-center justify-between gap-4">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2 shrink-0 text-[var(--color-primary)]">
                        <Terminal size={24} className="drop-shadow-[0_0_5px_var(--color-primary)]" />
                        <h1 className="text-xl md:text-2xl font-bold tracking-widest hidden sm:block" style={{ textShadow: '0 0 10px var(--color-primary-glow)' }}>
                            NEURAL_AGG
                        </h1>
                        <h1 className="text-xl font-bold tracking-widest sm:hidden">N_AGG</h1>
                    </div>

                    {/* Navigation Items (Responsive) */}
                    <nav className="flex items-center flex-1 justify-between md:justify-center gap-1 md:gap-4 overflow-x-auto no-scrollbar mask-image-linear-to-r min-w-0">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        relative group flex items-center justify-center gap-1.5 px-3 py-2 md:px-3 rounded-sm transition-all duration-200
                                        whitespace-nowrap font-display text-xs md:text-base tracking-wider border border-transparent shrink-0 flex-1 md:flex-none
                                        ${isActive
                                            ? 'text-[var(--color-primary)] bg-[var(--color-primary-dim)] border-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary-dim)]'
                                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border)]'
                                        }
                                    `}
                                >
                                    <Icon size={20} className={`md:w-[18px] md:h-[18px] ${isActive ? 'animate-pulse' : ''}`} />
                                    <span className="hidden md:inline font-bold uppercase">{item.label}</span>

                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] shadow-[0_0_5px_var(--color-primary)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Status Indicator (Right aligned) */}
                    <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[var(--color-border)]">
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-[10px] text-[var(--color-text-muted)]">SYSTEM</span>
                            <span className="text-xs font-bold text-[var(--color-primary)]">ONLINE</span>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgb(34,197,94)]" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-3 py-4 md:p-6 lg:p-8 z-10 animate-in fade-in duration-500 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};
