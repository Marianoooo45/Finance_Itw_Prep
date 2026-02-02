
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function fetchRssFeed(url: string) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
            },
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!res.ok) {
            console.error(`Failed to fetch RSS from ${url}: Status ${res.status}`);
            return null;
        }

        const xml = await res.text();
        return xml;
    } catch (e) {
        console.error(`Error fetching RSS from ${url}:`, e);
        return null;
    }
}

function decodeHtmlEntities(text: string) {
    if (!text) return '';
    return text
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#8217;/g, '’')
        .replace(/&#8220;/g, '“')
        .replace(/&#8221;/g, '”')
        .replace(/&#8211;/g, '–')
        .replace(/&nbsp;/g, ' ');
}

function parseXmlItems(xml: string) {
    const items: any[] = [];
    // Regex for basic RSS <item> parsing (Simple & Robust enough for standard feeds)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;

    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1];

        const title = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
        const link = itemContent.match(/<link>(.*?)<\/link>/);
        const pubDate = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
        const description = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || itemContent.match(/<description>(.*?)<\/description>/);
        const guid = itemContent.match(/<guid isPermaLink=".*?">(.*?)<\/guid>/) || itemContent.match(/<guid>(.*?)<\/guid>/);

        if (title && link) {
            const rawDesc = description ? description[1].trim().replace(/<[^>]+>/g, '') : '';
            items.push({
                title: decodeHtmlEntities(title[1].trim()),
                link: link[1].trim(),
                pubDate: pubDate ? pubDate[1].trim() : '',
                description: decodeHtmlEntities(rawDesc), // Strip HTML from desc then decode
                guid: guid ? guid[1].trim() : (link[1].trim())
            });
        }
    }
    return items;
}

export async function GET() {
    // Aggregating multiple Yahoo Finance FR feeds to get more volume (> 5 items)
    const FEEDS = [
        { url: 'https://fr.finance.yahoo.com/news/rss', weight: 1 },       // Top News
        { url: 'https://fr.finance.yahoo.com/rss/actualites', weight: 1 }, // General News
        { url: 'https://fr.finance.yahoo.com/rss/economie', weight: 1 },   // Economy
    ];

    // Fallback URL (if others fail completely)
    const FALLBACK_RSS = 'https://fr.finance.yahoo.com/rss/start';

    console.log("Fetching News (Yahoo Finance FR)...");

    try {
        const feedPromises = FEEDS.map(f => fetchRssFeed(f.url));
        const results = await Promise.all(feedPromises);

        let allItems: any[] = [];
        let successCount = 0;

        results.forEach((xml, index) => {
            if (xml) {
                const items = parseXmlItems(xml);
                // Si on a réussi à choper le feed Investir (weight 2), on le privilégie
                // Mais on garde tout pour l'instant
                allItems = [...allItems, ...items];
                if (items.length > 0) successCount++;
            }
        });

        // Fallback global
        if (successCount === 0) {
            console.warn("Main Yahoo feed failed, trying fallback URL.");
            const xml = await fetchRssFeed(FALLBACK_RSS);
            if (xml) {
                allItems = parseXmlItems(xml);
                return NextResponse.json({ source: 'Yahoo Finance FR', items: allItems.slice(0, 20) });
            }
            return NextResponse.json({ error: "Failed to fetch news from all sources" }, { status: 500 });
        }

        // Deduplication
        const uniqueItems = Array.from(new Map(allItems.map(item => [item.title, item])).values());

        // Sort by Date
        uniqueItems.sort((a, b) => {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });

        return NextResponse.json({
            source: 'Yahoo Finance FR',
            items: uniqueItems.slice(0, 30)
        });

    } catch (e) {
        console.error("Global News Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
