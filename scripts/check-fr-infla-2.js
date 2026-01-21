
// Using native fetch if available (Node 20)
async function run() {
    try {
        const url = "https://france-inflation.com/";
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body length:", text.length);

        // Search for specific markers
        // Often these sites have a big "DERNIER TAUX : X.X %"

        const idx = text.indexOf("Dernier taux");
        if (idx !== -1) {
            console.log("Found 'Dernier taux'. Context:");
            console.log(text.substring(idx, idx + 100));
        }

        // Look for any large font percentage?
        // text-size: ...

        // Dumb regex for decimal percent
        const matches = text.match(/[0-9]+,[0-9]+ ?%/g);
        if (matches) {
            console.log("Found percentages:", matches.slice(0, 5));
        }

    } catch (e) {
        console.error(e);
    }
}
run();
