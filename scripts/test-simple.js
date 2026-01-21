
const pkg = require('yahoo-finance2');
const yahooFinance = pkg.default || pkg;

(async () => {
    try {
        console.log("Start search with", yahooFinance ? "module found" : "module missing");
        const res = await yahooFinance.search("Bund 10Y");
        console.log("Result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
})();
