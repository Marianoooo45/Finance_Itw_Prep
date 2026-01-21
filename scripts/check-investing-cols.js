
async function run() {
    const urls = [
        { name: "France CPI YoY", url: "https://fr.investing.com/economic-calendar/french-cpi-yoy-805", tableId: "eventHistoryTable805" },
        { name: "Euro Zone CPI YoY", url: "https://fr.investing.com/economic-calendar/cpi-yoy-68", tableId: "eventHistoryTable68" }
    ];

    for (const item of urls) {
        try {
            console.log(`Fetching ${item.name}: ${item.url}`);
            const res = await fetch(item.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            const html = await res.text();

            // Find table
            const tableIdx = html.indexOf(`id="${item.tableId}"`);
            if (tableIdx !== -1) {
                // Get a chunk of the table
                const chunk = html.substring(tableIdx, tableIdx + 3000).replace(/\s+/g, ' ');

                // Try to identify rows. 
                // Rows start with <tr id="historicEvent_...">
                // Cells are <td ...>...</td>

                // Let's find the first row with data
                const rowRegex = /<tr id="historicEvent_[0-9]+"[^>]*>(.*?)<\/tr>/;
                const rowMatch = chunk.match(rowRegex);

                if (rowMatch) {
                    const rowContent = rowMatch[1];
                    console.log(`First Row Content for ${item.name}:`);

                    // Extract cell values
                    const cellMatches = [...rowContent.matchAll(/<td[^>]*>(.*?)<\/td>/g)];
                    cellMatches.forEach((m, i) => {
                        // Clean tags
                        const text = m[1].replace(/<[^>]+>/g, '').trim();
                        console.log(`  Col ${i}: ${text}`);
                    });

                    // Col 0: Date
                    // Col 1: Time
                    // Col 2: Actual (Actuel)
                    // Col 3: Forecast (Prévision)
                    // Col 4: Previous (Précédent)

                    const actual = cellMatches[2] ? cellMatches[2][1].replace(/<[^>]+>/g, '').trim() : "N/A";
                    console.log(`>>> Extracted ACTUAL: ${actual}`);
                } else {
                    console.log("No data row found.");
                }

            } else {
                console.log(`Table ${item.tableId} not found.`);
            }

        } catch (e) {
            console.error(e);
        }
        console.log("---");
    }
}
run();
