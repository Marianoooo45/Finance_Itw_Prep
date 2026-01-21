
const yahooFinance = require('yahoo-finance2').default;

async function checkTickers() {
    try {
        console.log("--- Searching for Bond Yields ---");
        const bundResults = await yahooFinance.search('Bund 10Y');
        console.log("Bund Search:", bundResults.quotes.slice(0, 3).map(q => ({ symbol: q.symbol, name: q.shortname })));

        const oatResults = await yahooFinance.search('OAT 10Y');
        console.log("OAT Search:", oatResults.quotes.slice(0, 3).map(q => ({ symbol: q.symbol, name: q.shortname })));

        console.log("\n--- Searching for Rates ---");
        const euriborResults = await yahooFinance.search('Euribor 3 Month');
        console.log("Euribor 3M:", euriborResults.quotes.slice(0, 3).map(q => ({ symbol: q.symbol, name: q.shortname })));

        console.log("\n--- Fetching Known Tickers ---");
        const result = await yahooFinance.quote(['^TNX', '^FCHI', 'BZ=F', 'EURUSD=X']);
        console.log("Successfully fetched:", result.map(q => `${q.symbol}: ${q.regularMarketPrice}`));

    } catch (e) {
        console.error(e);
    }
}

checkTickers();
