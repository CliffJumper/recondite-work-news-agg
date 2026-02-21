import { onRequest, onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import cors from "cors";
import Parser from "rss-parser";
import * as functions from "firebase-functions";

admin.initializeApp();
// Connect to the specific named database
const db = admin.firestore();
db.settings({ databaseId: 'recondite-news-agg' });
const parser = new Parser();
const corsHandler = cors({ origin: true });

// Type definitions matching Firestore
interface Article {
    title: string;
    summary: string;
    content: string;
    url: string;
    sourceId: string;
    sourceName: string;
    publishedAt: string;
    category: string;
}

interface Source {
    id: string;
    name: string;
    url: string;
    category: string;
}

// Helper function to fetch and store articles
async function fetchAndStore(url: string, sourceName: string, category: string, sourceId: string): Promise<Article[]> {
    const feed = await parser.parseURL(url);
    const articles: Article[] = feed.items.map(item => ({
        title: item.title || "No Title",
        summary: item.contentSnippet || item.content || "",
        content: item.content || "",
        url: item.link || "",
        sourceId: sourceId, // Use the provided Firestore source ID
        source: sourceName, // Standardize to 'source' for frontend compat
        sourceName: sourceName, // Keep 'sourceName' for legacy compat
        publishedAt: item.isoDate || new Date().toISOString(),
        category: category
    }));

    const batch = db.batch();
    articles.forEach(article => {
        // Deduplicate by article URL for consistency
        const articleId = Buffer.from(article.url).toString('base64');
        const ref = db.collection('articles').doc(articleId);
        batch.set(ref, article, { merge: true });
    });
    await batch.commit();
    return articles;
}

export const fetchRSS = onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const sourceUrl = req.query.url as string;
            const category = (req.query.category as string) || "General";
            const sourceName = (req.query.name as string) || "Unknown Source";
            const sourceId = (req.query.sourceId as string) || Buffer.from(sourceUrl || "").toString('base64');

            if (!sourceUrl) {
                res.status(400).send({ error: "Missing 'url' query parameter" });
                return;
            }

            await fetchAndStore(sourceUrl, sourceName, category, sourceId);
            res.json({ success: true });
        } catch (error) {
            logger.error("Error parsing RSS:", error);
            res.status(500).send({ error: "Failed to fetch RSS feed", details: error });
        }
    });
});

export const fetchRSSCallable = onCall(async (request) => {
    const { url, name, category, sourceId } = request.data;
    if (!url) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing URL');
    }
    // Fallback if sourceId missing (legacy calls), though api.ts should send it
    const idToUse = sourceId || Buffer.from(url).toString('base64');

    try {
        const articles = await fetchAndStore(url, name || 'Unknown', category || 'General', idToUse);
        return { success: true, count: articles.length };
    } catch (error: any) {
        logger.error("Error in fetchRSSCallable:", error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch RSS', error.message || error);
    }
});

export const refreshAllFeeds = onSchedule("every 60 minutes", async (event) => {
    const sourcesSnapshot = await db.collection('sources').get();
    const sources = sourcesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Source));

    for (const source of sources) {
        try {
            await fetchAndStore(source.url, source.name, source.category, source.id);
            logger.info(`Refreshed ${source.name} (SourceID: ${source.id})`);
        } catch (error) {
            logger.error(`Failed to refresh ${source.name}:`, error);
        }
    }
});
