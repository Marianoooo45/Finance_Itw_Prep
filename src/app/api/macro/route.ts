
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Récupère ta clé gratuite ici : https://fred.stlouisfed.org/docs/api/api_key.html
const FRED_API_KEY = process.env.FRED_API_KEY;

// --- 1. HELPER YAHOO (Marchés Live) ---
async function fetchYahooData(symbol: string) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 60 } // Mise à jour toutes les minutes
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        const result = json.chart?.result?.[0];

        if (!result || !result.meta) return null;

        return {
            symbol: symbol,
            value: result.meta.regularMarketPrice,
            prevClose: result.meta.chartPreviousClose,
            change: result.meta.regularMarketPrice - result.meta.chartPreviousClose,
            timestamp: result.meta.regularMarketTime
        };
    } catch (e) {
        console.error(`Yahoo Error ${symbol}:`, e);
        return null;
    }
}

// --- 2. HELPER FRED (Données Macro) ---
async function fetchFredData(seriesId: string, units?: string) {
    // A. Essai API Officielle (si Clé présente)
    if (FRED_API_KEY) {
        try {
            let url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`;
            if (units) url += `&units=${units}`;

            const res = await fetch(url, { next: { revalidate: 3600 } });
            if (res.ok) {
                const json = await res.json();
                const value = parseFloat(json.observations?.[0]?.value);
                if (!isNaN(value)) return value;
            }
        } catch (e) {
            console.error(`FRED API Error ${seriesId}:`, e);
        }
    }

    // B. Fallback : Scraping Direct de la page HTML
    try {
        const url = `https://fred.stlouisfed.org/series/${seriesId}`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const html = await res.text();
        const match = html.match(/<span class="series-meta-observation-value">([0-9\.]+)<\/span>/);

        if (match && match[1]) {
            return parseFloat(match[1]);
        }
        return null;
    } catch (e) {
        console.error(`FRED Scraping Error ${seriesId}:`, e);
        return null;
    }
}

// --- 3. HELPER BOURSORAMA (Scraping Spécifique) ---
async function fetchBoursoramaData(url: string) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const html = await res.text();
        const match = html.match(/class="c-instrument c-instrument--last"[^>]*>([0-9,]+)/);

        if (match && match[1]) {
            return parseFloat(match[1].replace(',', '.'));
        }
        return null;
    } catch (e) {
        console.error("Bourso Scraping Error:", e);
        return null;
    }
}

// --- 4. HELPER INVESTING.COM (Ciblé) ---
async function fetchInvestingData(url: string) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const html = await res.text();
        // Cible pour Investing.com (div avec data-test="instrument-price-last")
        const match = html.match(/data-test="instrument-price-last"[^>]*>([0-9,]+)/);

        if (match && match[1]) {
            return parseFloat(match[1].replace(',', '.'));
        }
        return null;
    } catch (e) {
        console.error("Investing Scraping Error:", e);
        return null;
    }
}

// --- 5. HELPER INVESTING.COM (Inflation / Tableaux) ---
async function fetchInvestingInflation(url: string, tableId: string) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const html = await res.text();
        const tableIdx = html.indexOf(`id="${tableId}"`);
        if (tableIdx === -1) return null;

        // On prend un chunk raisonnable pour chercher la première ligne
        const chunk = html.substring(tableIdx, tableIdx + 10000).replace(/\s+/g, ' ');

        // Regex pour trouver la première ligne de données (tr id="historicEvent_...")
        // Regex pour trouver TOUTES les lignes de données
        // Le tableau contient souvent les événements FUTURS en premier (sans valeur "Actuel")
        const rowMatches = chunk.matchAll(/<tr id="historicEvent_[0-9]+"[^>]*>(.*?)<\/tr>/g);

        for (const match of rowMatches) {
            const rowContent = match[1];
            // On extrait les cellules <td>
            const cols = [...rowContent.matchAll(/<td[^>]*>(.*?)<\/td>/g)]
                .map(m => m[1].replace(/<[^>]+>/g, '').trim().replace('&nbsp;', ''));

            // Colonne 2 : "Actuel"
            const actualStr = cols[2];

            if (actualStr && actualStr.length > 0) {
                // On tente de parser
                const clean = actualStr.replace('%', '').replace(',', '.').trim();
                const val = parseFloat(clean);
                if (!isNaN(val)) return val;
            }
        }
        return null;
    } catch (e) {
        console.error(`Investing Inflation Error (${tableId}):`, e);
        return null;
    }
}

// --- 6. HELPER INSEE (Home Page) ---
async function fetchInseeIndicators() {
    try {
        const url = "https://www.insee.fr/fr/accueil";
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const html = await res.text();
        // Normalisation pour simplifier les regex
        const clean = html.replace(/\s+/g, ' ');

        // Fonction d'extraction générique
        // Regex pour capturer le contenu des blocs <div class="chiffre">...</div> (basé sur screenshots utilisateur)
        const regexBlock = /class="chiffre"[^>]*>(.*?)<\/div>/g;

        let croissance = null;
        let chomage = null;
        let inflation = null;

        let match;
        while ((match = regexBlock.exec(clean)) !== null) {
            const content = match[1];
            // Extraction du nombre: peut être "+ 0,8" ou "7,7"
            const numMatch = content.match(/([+\-]?[0-9]+,[0-9]+)/);

            if (numMatch) {
                const val = parseFloat(numMatch[1].replace(',', '.').replace(/\s/g, ''));

                if (content.match(/Croissance/i)) {
                    croissance = val;
                } else if (content.match(/Chômage/i)) {
                    chomage = val;
                } else if (content.match(/Inflation/i) || content.match(/Prix à la consommation/i)) {
                    inflation = val;
                }
            }
        }

        return {
            growth_gdp: croissance,
            unemployment: chomage,
            inflation_fr: inflation
        };

    } catch (e) {
        console.error("INSEE Scraping Error:", e);
        return null;
    }
}


export async function GET() {
    console.log("Fetching Market Data (Yahoo + FRED + Bourso + Investing)...");

    // A. Lancement des requêtes en parallèle (Performance)
    const yahooPromises = [
        fetchYahooData('^FCHI'),    // CAC 40
        fetchYahooData('BZ=F'),     // Pétrole Brent
        fetchYahooData('EURUSD=X'), // Euro / Dollar
        fetchYahooData('^TNX'),     // US 10Y Yield 
    ];

    const fredPromises = [
        fetchFredData('ECBDFR'),          // BCE Deposit Rate
        fetchFredData('FEDFUNDS'),        // FED Funds Rate
        fetchFredData('IRLTLT01FRM156N'), // OAT 10Y (Fred Fallback)
        fetchFredData('IRLTLT01DEM156N'), // Bund 10Y (Fred Fallback)
        fetchFredData('CPHPTT01EZM661N', 'pc1'), // Inflation Euro (HICP YoY)
        fetchFredData('CPHPTT01FRM661N', 'pc1'), // Inflation France (HICP YoY)
        // Yield Curve Points
        fetchFredData('DGS3MO'), // 3 Mois
        fetchFredData('DGS2'),   // 2 Ans
        fetchFredData('DGS5'),   // 5 Ans
        fetchFredData('DGS10'),  // 10 Ans
        fetchFredData('DGS30'),  // 30 Ans
    ];

    const boursoEuriborPromise = fetchBoursoramaData('https://www.boursorama.com/bourse/taux/cours/1xEUR83/');
    const boursoOatPromise = fetchBoursoramaData('https://www.boursorama.com/bourse/taux/cours/2xFRABM10A/');
    const investingCmsPromise = fetchInvestingData('https://fr.investing.com/rates-bonds/eur-10-years-irs-interest-rate-swap-historical-data');
    const investingBundPromise = fetchInvestingData('https://fr.investing.com/rates-bonds/germany-10-year-bond-yield');

    // Nouveaux Scrapers Inflation
    const investingInflaFrPromise = fetchInvestingInflation('https://fr.investing.com/economic-calendar/french-cpi-yoy-805', 'eventHistoryTable805');
    const investingInflaEuPromise = fetchInvestingInflation('https://fr.investing.com/economic-calendar/cpi-yoy-68', 'eventHistoryTable68');

    // Scrapers Courbe France (Investing.com)
    const fr3mPromise = fetchInvestingData('https://fr.investing.com/rates-bonds/france-3-month-bond-yield');
    const fr2yPromise = fetchInvestingData('https://fr.investing.com/rates-bonds/france-2-year-bond-yield');
    const fr5yPromise = fetchInvestingData('https://fr.investing.com/rates-bonds/france-5-year-bond-yield');
    const fr10yPromise = fetchInvestingData('https://fr.investing.com/rates-bonds/france-10-year-bond-yield');
    const fr30yPromise = fetchInvestingData('https://fr.investing.com/rates-bonds/france-30-year-bond-yield');

    const [cac, brent, eurusd, us10yRaw] = await Promise.all(yahooPromises);
    const [ecbRate, fedRate, oat10yFred, bund10yFred, inflationEuFred, inflationFrFred, us3m, us2y, us5y, us10yFred, us30y] = await Promise.all(fredPromises);

    const eur3mScraped = await boursoEuriborPromise;
    const oat10yScraped = await boursoOatPromise;
    const cms10yScraped = await investingCmsPromise;
    const bund10yScraped = await investingBundPromise;

    const fr3m = await fr3mPromise;
    const fr2y = await fr2yPromise;
    const fr5y = await fr5yPromise;
    const fr10y = await fr10yPromise; // Prefer Investing 10Y for consistency in curve
    const fr30y = await fr30yPromise;

    const inflationFrScraped = await investingInflaFrPromise;
    const inflationEuScraped = await investingInflaEuPromise;
    const inseeData = await fetchInseeIndicators();


    // B. Logique Financière & Reconstruction des données OTC

    // 1. Correction du Taux US Yahoo
    const raw10y = us10yRaw?.value;
    const finalUs10y = (raw10y && raw10y > 20) ? raw10y / 10 : raw10y;
    const us10y = us10yRaw ? { ...us10yRaw, value: finalUs10y } : null;

    // 2. Gestion Euribor 3M (Priorité: Bourso Scraped > Fallback Calculé)
    const ecbDefault = 2.00;
    const eur3m = eur3mScraped ?? ((ecbRate || ecbDefault) + 0.15);

    // 3. Gestion Bund 10Y (Priorité: Investing Scraped > Fred Scraped)
    const bund10y = bund10yScraped ?? bund10yFred;

    // 4. CMS 10Y (Priorité: Investing Scraped > Fallback Calculé)
    const swapSpread = 0.52;
    const bundDefault = 2.35;
    const cms10yCalc = (bund10y || bundDefault) + swapSpread;
    const cms10y = cms10yScraped ?? cms10yCalc;

    // 5. Spread OAT-Bund (Values from Scrapers)
    const oat10yFinal = oat10yScraped ?? (fr10y ?? oat10yFred); // Fallbacks updated
    const spreadOatBundVal = (oat10yFinal && bund10y) ? (oat10yFinal - bund10y) : null;
    const spreadBps = spreadOatBundVal ? Math.round(spreadOatBundVal * 100) : "N/A";


    // C. Réponse JSON
    return NextResponse.json({
        timestamp: new Date().toISOString(),

        centralBanks: {
            ecb_deposit: ecbRate ?? 2.00,
            fed_funds: fedRate ?? 4.50,
            euribor_3m: eur3m.toFixed(2),
        },

        rates: {
            bund_10y: bund10y ?? 2.35,
            oat_10y: oat10yFinal ?? 2.85,
            cms_10y: cms10y.toFixed(2),
            us_10y: us10y?.value ? us10y.value.toFixed(2) : 4.10,
            spread_oat_bund_bps: spreadBps,
        },

        macro: {
            inflation_eu: inflationEuScraped ?? (inflationEuFred ?? 2.0),
            // Priorité : INSEE > Investing > FRED
            inflation_fr: inseeData?.inflation_fr ?? (inflationFrScraped ?? (inflationFrFred ?? 1.5)),
            unemployment_fr: inseeData?.unemployment ?? 7.3,
            growth_fr: inseeData?.growth_gdp ?? 0.4,
            yield_curve_us: {
                value: (us10yFred && us2y) ? (us10yFred - us2y) : -0.30,
                is_inverted: (us10yFred && us2y) ? (us10yFred - us2y < 0) : true,
                points: {
                    m3: us3m ?? null,
                    y2: us2y ?? null,
                    y5: us5y ?? null,
                    y10: us10yFred ?? null,
                    y30: us30y ?? null
                }
            },
            yield_curve_fr: {
                value: (fr10y && fr2y) ? (fr10y - fr2y) : 0,
                is_inverted: (fr10y && fr2y) ? (fr10y - fr2y < 0) : false,
                points: {
                    m3: fr3m ?? null,
                    y2: fr2y ?? null,
                    y5: fr5y ?? null,
                    y10: fr10y ?? null,
                    y30: fr30y ?? null
                }
            }
        },

        market: {
            cac40: cac,
            brent: brent,
            eurusd: eurusd
        }
    });
}