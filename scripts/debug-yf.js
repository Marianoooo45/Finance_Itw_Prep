
const yf = require('yahoo-finance2');
console.log(yf);
console.log("Default:", yf.default);
if (yf.default) {
    try {
        yf.default.suppressNotices(['yahooSurvey']);
        console.log("Suppressed.");
        yf.default.quote('AAPL').then(console.log).catch(console.error);
    } catch (e) { console.error(e); }
}
