
const pkg = require('yahoo-finance2');
const yahooFinance = pkg.default || pkg;

(async () => {
    try {
        const searches = [
            'Fed Funds',
            'Euribor 3 Month',
            'US 2 Year',
            '10 Year Swap',
            'CMS 10'
        ];

        for (const s of searches) {
            console.log(`\nSearching for: ${s}`);
            const res = await yahooFinance.search(s);
            res.quotes.slice(0, 3).forEach(q => console.log(` - ${q.symbol} (${q.shortname}): ${q.quoteType}`));
        }
    } catch (e) {
        console.error(e);
    }
})();
