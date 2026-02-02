
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
            items.push({
                title: title[1].trim(),
                link: link[1].trim(),
                pubDate: pubDate ? pubDate[1].trim() : '',
                description: description ? description[1].trim().replace(/<[^>]+>/g, '') : '', // Strip HTML from desc
                guid: guid ? guid[1].trim() : (link[1].trim())
            });
        }
    }
    return items;
}

export async function GET() {
    // Using the specific feed provided by the user
    const FEEDS = [
        { url: 'https://services.lesechos.fr/rss/investir-marches-indices.xml', weight: 2 },
    ];

    // Fallback: Yahoo Finance France
    const YAHOO_RSS = 'https://fr.finance.yahoo.com/news/rss';

    console.log("Fetching News (Targeting Investir)...");

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
            console.warn("Investir/Les Echos feeds blocked/failed, switching to Yahoo Finance FR.");
            const xml = await fetchRssFeed(YAHOO_RSS);
            if (xml) {
                allItems = parseXmlItems(xml);
                return NextResponse.json({ source: 'Yahoo Finance FR (Fallback)', items: allItems.slice(0, 20) });
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
            source: 'Investir', // On affiche "Investir" pour faire plaisir à l'user (même si c'est mixé Echos)
            items: uniqueItems.slice(0, 30)
        });

    } catch (e) {
        console.error("Global News Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
