
async function run() {
    try {
        const url = "https://fr.investing.com/economic-calendar/french-cpi-yoy-805";
        console.log("Fetching:", url);

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = await res.text();
        // Look for the table with "Actuel"
        // <td class="..."> 0,9% </td>

        // Find the "eventHistoryTable805"
        const tableIdx = html.indexOf('id="eventHistoryTable805"');
        if (tableIdx !== -1) {
            const part = html.substring(tableIdx, tableIdx + 5000);
            // The structure is roughly: <tr> <td ...> Date </td> <td ...> Time </td> <td ...> Actual </td> ...
            // We want the first "Actual" value.

            // Clean it a bit
            const clean = part.replace(/\s+/g, ' ');

            // Regex to find the first percentage in a td
            // <td class="noWrap"> 0,9% </td>
            const match = clean.match(/>(-?[0-9]+,[0-9]+)%</);
            if (match) {
                console.log("Found value:", match[1]);
            } else {
                console.log("No percentage found in table chunk.");
                console.log(clean.substring(0, 500));
            }
        } else {
            console.log("Table ID not found.");
        }

    } catch (e) {
        console.error(e);
    }
}
run();
