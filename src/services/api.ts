import { db, functions } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import type { Article, CustomList, Source, UserPreferences } from '../types';

const STORAGE_KEYS = {
    PREFERENCES: 'news_agg_preferences',
    CUSTOM_LISTS: 'news_agg_lists',
};

export const api = {
    getArticles: async (): Promise<Article[]> => {
        try {
            // Get articles from Firestore
            const q = query(collection(db, 'articles'), orderBy('publishedAt', 'desc'), limit(50));
            const snapshot = await getDocs(q);
            const articles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Article[];

            // If no articles, return empty (or could trigger initial fetch)
            return articles;
        } catch (error) {
            console.error("Error fetching articles:", error);
            return [];
        }
    },

    getSources: async (): Promise<Source[]> => {
        try {
            const snapshot = await getDocs(collection(db, 'sources'));
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Source[];
        } catch (error) {
            console.error("Error fetching sources:", error);
            return [];
        }
    },

    addSource: async (name: string, url: string, category: string): Promise<void> => {
        console.log("api.addSource called with:", { name, url, category });

        // Connectivity Check: Try to read first
        try {
            console.log("Testing Firestore connectivity (read)...");

            const readTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Firestore READ timed out (5s). Network is likely blocked.")), 5000)
            );

            await Promise.race([
                getDocs(query(collection(db, 'sources'), limit(1))),
                readTimeout
            ]);
            console.log("Firestore read successful. Connectivity is OK.");
        } catch (readErr) {
            console.error("Firestore connectivity test FAILED:", readErr);
            throw new Error(`Connection Test Failed: ${readErr instanceof Error ? readErr.message : readErr}`);
        }

        try {
            console.log("Attempting to write to Firestore 'sources' collection...");

            // Race addDoc against a 10s timeout
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Database write timed out (10s). Local Firewal blocking connection?")), 10000)
            );

            const docRef = await Promise.race([
                addDoc(collection(db, 'sources'), {
                    name,
                    url,
                    category,
                    createdAt: new Date().toISOString()
                }),
                timeout
            ]) as any; // Cast for the race result

            console.log("Source added to Firestore with ID:", docRef.id);

            // Trigger initial fetch properly
            try {
                console.log("Invoking fetchRSSCallable...");
                const fetchRSS = httpsCallable(functions, 'fetchRSSCallable');
                // Pass the new document ID as sourceId so articles are linked correctly
                const result = await fetchRSS({ url, name, category, sourceId: docRef.id });
                console.log("Initial fetch result:", result.data);
            } catch (fetchError) {
                console.error("Warning: Initial RSS fetch failed.", fetchError);
                console.warn("The source was added to the database, so articles may appear later via scheduled refresh.");
            }
        } catch (error) {
            console.error("Error adding source:", error);
            throw error;
        }
    },

    deleteSource: async (sourceId: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, 'sources', sourceId));
            console.log(`Source ${sourceId} deleted`);
        } catch (error) {
            console.error("Error deleting source:", error);
            throw error;
        }
    },

    updateSourceCategory: async (sourceId: string, newCategory: string): Promise<void> => {
        try {
            await updateDoc(doc(db, 'sources', sourceId), { category: newCategory });
            console.log(`Source ${sourceId} updated to category ${newCategory}`);
        } catch (error) {
            console.error("Error updating source category:", error);
            throw error;
        }
    },

    // Preferences and Custom Lists kept in LocalStorage for MVP (Anonymous)

    getPreferences: async (): Promise<UserPreferences> => {
        const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            theme: 'light',
            savedArticleIds: [],
            blockedSourceIds: [],
            favoriteCategories: [],
        };
    },

    updatePreferences: async (prefs: UserPreferences): Promise<UserPreferences> => {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
        return prefs;
    },

    getCustomLists: async (): Promise<CustomList[]> => {
        const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_LISTS);
        return stored ? JSON.parse(stored) : [];
    },

    createCustomList: async (name: string): Promise<CustomList> => {
        const lists = await api.getCustomLists();
        const newList: CustomList = {
            id: crypto.randomUUID(),
            name,
            articleIds: [],
            createdAt: new Date().toISOString(),
        };
        lists.push(newList);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LISTS, JSON.stringify(lists));
        return newList;
    },

    addToCustomList: async (listId: string, articleId: string): Promise<void> => {
        const lists = await api.getCustomLists();
        const list = lists.find((l) => l.id === listId);
        if (list && !list.articleIds.includes(articleId)) {
            list.articleIds.push(articleId);
            localStorage.setItem(STORAGE_KEYS.CUSTOM_LISTS, JSON.stringify(lists));
        }
    },

    toggleSavedArticle: async (articleId: string): Promise<boolean> => {
        const prefs = await api.getPreferences();
        const isSaved = prefs.savedArticleIds.includes(articleId);
        let newSavedIds;

        if (isSaved) {
            newSavedIds = prefs.savedArticleIds.filter(id => id !== articleId);
        } else {
            newSavedIds = [...prefs.savedArticleIds, articleId];
        }

        await api.updatePreferences({
            ...prefs,
            savedArticleIds: newSavedIds,
        });

        return !isSaved;
    }
};
