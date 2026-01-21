
async function run() {
    try {
        // Try to fetch the FRED page with units=pc1
        const url = "https://fred.stlouisfed.org/series/CPHPTT01FRM661N?units=pc1";
        console.log("Fetching:", url);

        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const html = await res.text();
        console.log("Length:", html.length);

        // Look for the value
        const match = html.match(/<span class="series-meta-observation-value">([0-9\.]+)<\/span>/);
        if (match) {
            console.log("Found value:", match[1]);
        } else {
            console.log("Value not found via regex.");
        }

    } catch (e) {
        console.error(e);
    }
}
run();
