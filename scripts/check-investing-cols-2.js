
async function run() {
    const urls = [
        { name: "France CPI YoY", url: "https://fr.investing.com/economic-calendar/french-cpi-yoy-805", tableId: "eventHistoryTable805" },
        { name: "Euro Zone CPI YoY", url: "https://fr.investing.com/economic-calendar/cpi-yoy-68", tableId: "eventHistoryTable68" }
    ];

    for (const item of urls) {
        try {
            console.log(`Fetching ${item.name}...`);
            const res = await fetch(item.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
            });
            const html = await res.text();

            const tableIdx = html.indexOf(`id="${item.tableId}"`);
            if (tableIdx !== -1) {
                const chunk = html.substring(tableIdx, tableIdx + 10000).replace(/\s+/g, ' ');

                // Match all rows
                const rowMatches = [...chunk.matchAll(/<tr id="historicEvent_[0-9]+"[^>]*>(.*?)<\/tr>/g)];

                console.log(`Found ${rowMatches.length} rows.`);

                for (const row of rowMatches) {
                    const rowContent = row[1];
                    const cols = [...rowContent.matchAll(/<td[^>]*>(.*?)<\/td>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim().replace('&nbsp;', ''));

                    // Col 0: Date
                    // Col 2: Actual

                    const date = cols[0];
                    const actual = cols[2];

                    if (actual && actual.length > 0) {
                        console.log(`[FOUND] Date: ${date}, Actual: ${actual}`);
                        break; // Stop after finding the first valid one
                    }
                }
            } else {
                console.log(`Table not found for ${item.name}`);
            }

        } catch (e) {
            console.error(e);
        }
        console.log("---");
    }
}
run();
