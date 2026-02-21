import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Plus, Loader2, X, LogOut } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import type { Category, Source } from '../types';

const CATEGORIES: Category[] = ['Technology', 'Business', 'Science', 'Health', 'General', 'Sports', 'Entertainment'];

export const Settings: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { logout } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [existingSources, setExistingSources] = useState<Source[]>([]);
    const [newSource, setNewSource] = useState({ name: '', url: '', category: 'General' as Category });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        loadSources();
    }, []);

    const loadSources = async () => {
        const sources = await api.getSources();
        setExistingSources(sources);
    };

    const handleRemoveSource = async (id: string) => {
        if (!confirm('Are you sure you want to remove this source?')) return;
        try {
            await api.deleteSource(id);
            setExistingSources(prev => prev.filter(s => s.id !== id));
            setSuccessMsg('Source removed.');
        } catch (err) {
            console.error(err);
            setError('Failed to remove source.');
        }
    };

    const handleUpdateCategory = async (id: string, newCategory: Category) => {
        try {
            // Optimistic update
            setExistingSources(prev => prev.map(s =>
                s.id === id ? { ...s, category: newCategory } : s
            ));
            await api.updateSourceCategory(id, newCategory);
            setSuccessMsg('Category updated.');
        } catch (err) {
            console.error(err);
            setError('Failed to update category.');
            loadSources(); // Revert on error
        }
    };

    const handleAddSource = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handleAddSource triggered"); // Debug log
        setError('');
        setSuccessMsg('');
        setIsAdding(true);
        try {
            await api.addSource(newSource.name, newSource.url, newSource.category);
            setNewSource({ name: '', url: '', category: 'General' });
            setSuccessMsg('Source added successfully! Articles will appear in the feed shortly.');
            loadSources(); // Refresh list
        } catch (err: any) {
            setError(err.message || 'Failed to add source');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <SettingsIcon className="text-[var(--color-primary)]" size={32} />
                <h1 className="text-3xl font-bold">Settings</h1>
            </div>

            <div className="card p-4 md:p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)] uppercase tracking-wider">Manage Sources</h3>
                    <form onSubmit={handleAddSource} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                id="sourceName"
                                name="sourceName"
                                type="text"
                                placeholder="Source Name_"
                                className="w-full px-4 py-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] font-mono focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                value={newSource.name}
                                onChange={e => setNewSource({ ...newSource, name: e.target.value })}
                                required
                            />
                            <select
                                id="sourceCategory"
                                name="sourceCategory"
                                className="w-full px-4 py-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] font-mono focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                value={newSource.category}
                                onChange={e => setNewSource({ ...newSource, category: e.target.value as Category })}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                id="sourceUrl"
                                name="sourceUrl"
                                type="url"
                                placeholder="RSS Feed URL_"
                                className="w-full flex-1 px-4 py-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] font-mono focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                                value={newSource.url}
                                onChange={e => setNewSource({ ...newSource, url: e.target.value })}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isAdding}
                                className="btn btn-primary w-full sm:w-auto min-w-[100px] rounded-sm"
                            >
                                {isAdding ? <Loader2 className="animate-spin" /> : <><Plus size={18} className="mr-2" /> EXECUTE</>}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm font-mono">{'>'} ERROR: {error}</p>}
                        {successMsg && <p className="text-green-500 text-sm font-medium font-mono">{'>'} SUCCESS: {successMsg}</p>}
                    </form>
                </div>

                {/* List of Existing Sources */}
                <div className="border-t border-[var(--color-border)] pt-6">
                    <h4 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Active Feeds</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {existingSources.map(source => (
                            <div key={source.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-sm bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors group gap-2">
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm text-[var(--color-text-primary)] truncate">{source.name}</span>
                                    <span className="text-[10px] font-mono text-[var(--color-text-muted)] truncate">{source.url}</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <select
                                        value={source.category}
                                        onChange={(e) => handleUpdateCategory(source.id, e.target.value as Category)}
                                        className="text-[10px] uppercase font-bold text-[var(--color-secondary)] bg-[var(--color-secondary-dim)] border border-transparent hover:border-[var(--color-secondary)] rounded-sm px-1 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] max-w-[100px]"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleRemoveSource(source.id)}
                                        className="transition-all p-1.5 rounded-sm flex items-center justify-center"
                                        style={{ color: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)' }}
                                        title="Remove Feed"
                                    >
                                        <X size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {existingSources.length === 0 && (
                            <div className="text-center py-4 text-[var(--color-text-muted)] text-sm italic">
                                No sources active. Add one above.
                            </div>
                        )}
                    </div>
                </div>


                <div className="pt-6 border-t border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)] uppercase tracking-wider">Interface Theme</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(['cyberpunk', 'corporate', 'sunset', 'terminal'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`
                                    relative p-4 rounded-sm border transition-all text-left overflow-hidden group text-[var(--color-text-primary)]
                                    ${theme === t
                                        ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] bg-[var(--color-primary-dim)]'
                                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-[var(--color-bg)]'
                                    }
                                `}
                            >
                                <div className="font-bold uppercase tracking-wider text-sm mb-1">{t}</div>
                                <div className="h-2 w-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-50" />
                                {theme === t && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_5px_var(--color-primary)] animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)] uppercase tracking-wider">Content Preferences</h3>
                    <div className="space-y-4">
                        <label className="flex flex-wrap items-center justify-between p-3 rounded-sm hover:bg-[var(--color-accent)]/10 cursor-pointer border border-transparent hover:border-[var(--color-primary)]/30 transition-all gap-2">
                            <span className="font-mono text-sm shrink-0">Enable Notifications</span>
                            <input
                                id="enableNotifications"
                                name="enableNotifications"
                                type="checkbox"
                                className="w-5 h-5 rounded-sm border-[var(--color-primary)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-transparent shrink-0"
                            />
                        </label>
                        <label className="flex flex-wrap items-center justify-between p-3 rounded-sm hover:bg-[var(--color-accent)]/10 cursor-pointer border border-transparent hover:border-[var(--color-primary)]/30 transition-all gap-2">
                            <span className="font-mono text-sm shrink-0">Auto-refresh Feed</span>
                            <input
                                id="autoRefresh"
                                name="autoRefresh"
                                type="checkbox"
                                defaultChecked
                                className="w-5 h-5 rounded-sm border-[var(--color-primary)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-transparent shrink-0"
                            />
                        </label>
                    </div>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)] uppercase tracking-wider">Session Management</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={async () => {
                                try {
                                    await logout();
                                } catch (error) {
                                    console.error("Failed to log out", error);
                                }
                            }}
                            className="btn w-full justify-center bg-red-950/40 border border-red-500/50 hover:bg-red-500/20 hover:border-red-400 font-mono transition-all"
                            style={{ color: '#fca5a5' }}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            TERMINATE SESSION
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
