import type { Article, Source } from '../types';

export const MOCK_SOURCES: Source[] = [
    { id: 'tech-daily', name: 'Tech Daily', category: 'Technology', url: 'https://example.com/rss' },
    { id: 'business-insider', name: 'Business Insider', category: 'Business', url: 'https://example.com/rss' },
    { id: 'health-plus', name: 'Health Plus', category: 'Health', url: 'https://example.com/rss' },
    { id: 'science-today', name: 'Science Today', category: 'Science', url: 'https://example.com/rss' },
    { id: 'world-news', name: 'World News', category: 'General', url: 'https://example.com/rss' },
];

export const MOCK_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'The Future of AI in Web Development',
        summary: 'How artificial intelligence is reshaping the way we build web applications.',
        content: 'Full content would go here...',
        source: 'Tech Daily',
        sourceId: 'tech-daily',
        category: 'Technology',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: '2',
        title: 'Global Markets Rally Amidst Uncertainty',
        summary: 'Stocks hit new highs as investors remain optimistic about economic recovery.',
        content: 'Full content would go here...',
        source: 'Business Insider',
        sourceId: 'business-insider',
        category: 'Business',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=1000',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: '3',
        title: 'New Breakthrough in Quantum Computing',
        summary: 'Scientists achieve quantum supremacy with new processor architecture.',
        content: 'Full content would go here...',
        source: 'Science Today',
        sourceId: 'science-today',
        category: 'Science',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: '4',
        title: 'Top 10 Exercises for Longevity',
        summary: 'Recent studies show these simple exercises can add years to your life.',
        content: 'Full content would go here...',
        source: 'Health Plus',
        sourceId: 'health-plus',
        category: 'Health',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
];
