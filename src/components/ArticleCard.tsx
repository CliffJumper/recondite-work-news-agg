import React from 'react';
import { Bookmark, ExternalLink, Plus } from 'lucide-react';
import type { Article } from '../types';

interface ArticleCardProps {
    article: Article;
    isSaved?: boolean;
    onToggleSave: (id: string) => void;
    onAddToList?: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
    article,
    isSaved = false,
    onToggleSave,
    onAddToList
}) => {
    // Helper to get a placeholder if image fails (using a clean gradient or pattern instead of cyber assets)
    const getThumbnail = (cat: string) => {
        const lowerCat = cat.toLowerCase();
        // Dynamic lookup for new icons
        // Assuming they are in /assets/icon_[category].png
        return `/assets/icon_${lowerCat}.png`;
    };

    return (
        <article className="group relative bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full">

            <div className="p-5 flex flex-col h-full">
                {/* Header: Source and Date */}
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-50 text-blue-600">
                            {article.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{article.source}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex gap-4 mb-4 flex-1">
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                {article.title}
                            </a>
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            {article.summary}
                        </p>
                    </div>
                    {/* Thumbnail - Right aligned for cleaner list look, or could be top */}
                    {/* Let's try right-aligned square for that "news list" feel, or "flight tracker" card feel */}
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <img
                            src={article.imageUrl || getThumbnail(article.category)}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = getThumbnail(article.category);
                            }}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium">
                        {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onToggleSave(article.id);
                            }}
                            className={`p-2 rounded-full transition-colors ${isSaved
                                ? 'bg-blue-50 text-blue-600'
                                : 'hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                        </button>

                        {onAddToList && (
                            <button
                                onClick={() => onAddToList(article.id)}
                                className="p-2 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        )}

                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
};
