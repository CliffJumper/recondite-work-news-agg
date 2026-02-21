import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { Bookmark } from 'lucide-react';

export const Saved: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSaved();
    }, []);

    const loadSaved = async () => {
        setLoading(true);
        const [allArticles, prefs] = await Promise.all([
            api.getArticles(),
            api.getPreferences()
        ]);

        const saved = allArticles.filter(a => prefs.savedArticleIds.includes(a.id));
        setArticles(saved);
        setLoading(false);
    };

    const handleToggleSave = async (id: string) => {
        await api.toggleSavedArticle(id);
        setArticles(prev => prev.filter(a => a.id !== id));
    };

    if (loading) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Bookmark className="text-[var(--color-primary)]" size={32} />
                <h1 className="text-3xl font-bold">Saved Articles</h1>
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
                    <Bookmark size={48} className="mx-auto mb-4 text-[var(--color-text-secondary)] opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No saved articles yet</h3>
                    <p className="text-[var(--color-text-secondary)]">
                        Bookmark articles you want to read later.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map(article => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            isSaved={true}
                            onToggleSave={handleToggleSave}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
