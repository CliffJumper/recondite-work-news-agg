export type Category = 'General' | 'Technology' | 'Business' | 'Science' | 'Health' | 'Sports' | 'Entertainment';

export interface Article {
    id: string;
    title: string;
    summary: string;
    content: string;
    source: string;
    sourceName?: string; // For compatibility with backend
    sourceId: string;
    category: Category;
    url: string;
    imageUrl?: string;
    publishedAt: string;
}

export interface Source {
    id: string;
    name: string;
    url: string;
    category: Category;
}

export interface CustomList {
    id: string;
    name: string;
    articleIds: string[];
    createdAt: string;
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    savedArticleIds: string[];
    blockedSourceIds: string[];
    favoriteCategories: Category[];
}
