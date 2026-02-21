import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Article, Category, Source } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { Filter, Search, Newspaper } from 'lucide-react';

const CATEGORIES: Category[] = ['Technology', 'Business', 'Science', 'Health', 'General', 'Sports', 'Entertainment'];

export const Home: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
    const [selectedSourceId, setSelectedSourceId] = useState<string>('all');
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [fetchedArticles, fetchedSources, prefs] = await Promise.all([
                api.getArticles(),
                api.getSources(),
                api.getPreferences()
            ]);
            setArticles(fetchedArticles);
            setSources(fetchedSources);
            setSavedIds(prefs.savedArticleIds);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSave = async (id: string) => {
        const isNowSaved = await api.toggleSavedArticle(id);
        setSavedIds(prev =>
            isNowSaved ? [...prev, id] : prev.filter(savedId => savedId !== id)
        );
    };

    const filteredArticles = articles.filter(article => {
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;

        let matchesSource = true;
        if (selectedSourceId !== 'all') {
            const selectedSource = sources.find(s => s.id === selectedSourceId);
            const sourceName = selectedSource?.name;

            matchesSource =
                article.sourceId === selectedSourceId ||
                (!!sourceName && (article.source === sourceName || article.sourceName === sourceName));
        }

        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSource && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans text-slate-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                        <Newspaper className="text-blue-600" size={32} />
                        NEWS TRACKER
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">Real-time global headlines & insights</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    </div>

                    {/* Source Filter Dropdown */}
                    <div className="relative min-w-[200px]">
                        <select
                            value={selectedSourceId}
                            onChange={(e) => setSelectedSourceId(e.target.value)}
                            className="w-full appearance-none px-4 py-2.5 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-medium transition-all"
                        >
                            <option value="all">All Sources</option>
                            {sources.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${selectedCategory === 'All'
                            ? 'bg-blue-600 text-white shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                >
                    All News
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${selectedCategory === cat
                                ? 'bg-blue-600 text-white shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        isSaved={savedIds.includes(article.id)}
                        onToggleSave={handleToggleSave}
                    />
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        We couldn't find any articles matching your current filters. Try adjusting your search keywords or category selection.
                    </p>
                    <button
                        onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSelectedSourceId('all'); }}
                        className="mt-6 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};
