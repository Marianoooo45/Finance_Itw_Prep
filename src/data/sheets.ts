export type Sheet = {
    id: string;
    title: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    progress: number;
    variant: 'kraft' | 'white';
    imageUrl?: string;
    slug: string;
    section?: string;
};

export const REVISION_SHEETS: Sheet[] = [
    {
        id: 'fi-1',
        title: 'Indices & Curves',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 1 FIC Indices et Courbes.png',
        section: 'CHAPITRE 1 : LE SOCLE TECHNIQUE'
    },
    {
        id: 'fi-2',
        title: 'RFR vs IBOR',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/rates-fixed-income/Fiche 2 FIC RFR vs IBOR.png',
        section: 'CHAPITRE 1 : LE SOCLE TECHNIQUE'
    },
    {
        id: 'fi-3',
        title: 'DELTA (Inclut DV01 et Duration)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/rates-fixed-income/Fiche 3 FIC DELTA.png',
        section: 'CHAPITRE 1 : LE SOCLE TECHNIQUE'
    },
    {
        id: 'fi-4',
        title: 'GAMMA (Inclut Convexité)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 4 FIC Gamma Convexity.png',
        section: 'CHAPITRE 1 : LE SOCLE TECHNIQUE'
    },
    {
        id: 'fi-5',
        title: 'VEGA (La Volatilité)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 5 FIC VEGA.png',
        section: 'CHAPITRE 1 : LE SOCLE TECHNIQUE'
    },
    {
        id: 'fi-6',
        title: 'THETA (Le Temps)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/rates-fixed-income/Fiche 6 FIC THETA.png',
        section: 'CHAPITRE 1 : LE SOCLE TECHNIQUE'
    },
    {
        id: 'fi-7',
        title: 'RHO (Taux)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 7 FIC RHO.png',
        section: 'CHAPITRE 1 : LE SOCLE TECHNIQUE'
    },
    {
        id: 'fi-8',
        title: 'GREEKS (Tableau Recap)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/rates-fixed-income/Fiche 8 FIC Recap Greeks.png',
        section: 'CHAPITRE 1 : LE SOCLE TECHNIQUE'
    },
    {
        id: 'fi-9',
        title: 'Interest Rate Swaps (IRS)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/rates-fixed-income/Fiche 9 FIC IRS.png',
        section: 'CHAPITRE 2 : L\'ARSENAL PRODUITS'
    },
    {
        id: 'fi-10',
        title: 'Swap Rates (Technical)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Hard',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 10 FIC Swap Rates.png',
        section: 'CHAPITRE 2 : L\'ARSENAL PRODUITS'
    },
    {
        id: 'fi-11',
        title: 'Cap & Floor Mechanics',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 11 FIC Cap Floor Mechanics.png',
        section: 'CHAPITRE 2 : L\'ARSENAL PRODUITS'
    },
    {
        id: 'fi-12',
        title: 'Cap & Floor (Technical)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Hard',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/rates-fixed-income/Fiche 12 FIC Cap Floor Technical.png',
        section: 'CHAPITRE 2 : L\'ARSENAL PRODUITS'
    },
    {
        id: 'fi-13',
        title: 'Swaptions & FRA',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/rates-fixed-income/Fiche 13 FIC Swaptions FRA.png',
        section: 'CHAPITRE 2 : L\'ARSENAL PRODUITS'
    },
    {
        id: 'fi-14',
        title: 'Swaptions',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 14 FIC Swaptions Deep Dive.png',
        section: 'CHAPITRE 2 : L\'ARSENAL PRODUITS'
    },
    {
        id: 'fi-15',
        title: 'Pricing Sales',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 15 FIC Pricing Sales.png',
        section: 'CHAPITRE 3 : LE CLOSING SALES & VALO'
    },
    {
        id: 'fi-16',
        title: 'Spread & Valo',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/rates-fixed-income/Fiche 16 FIC Spread Valo.png',
        section: 'CHAPITRE 3 : LE CLOSING SALES & VALO'
    },
    {
        id: 'fi-17',
        title: 'Inflation Derivatives',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/rates-fixed-income/Fiche 17 FIC Inflation.png',
        section: 'CHAPITRE 3 : LE CLOSING SALES & VALO'
    },

    // --- EQUITY DERIVATIVES SHEETS ---
    {
        id: 'eq-1',
        title: 'Call & Put Basics',
        category: 'Equity Derivatives',
        slug: 'equity-derivatives',
        difficulty: 'Easy',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/equity-derivatives/Fiche 1 Equity Call & Put.png'
    },
    {
        id: 'eq-2',
        title: 'Call Spread & Butterfly',
        category: 'Equity Derivatives',
        slug: 'equity-derivatives',
        difficulty: 'Medium',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/equity-derivatives/Fiche 2 Equity stratégies call spread et buttefly.png'
    },
    {
        id: 'eq-3',
        title: 'Put Down-and-In',
        category: 'Equity Derivatives',
        slug: 'equity-derivatives',
        difficulty: 'Easy',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/equity-derivatives/Fiche 3 Equity Put down-and-in.png'
    },
    {
        id: 'eq-4',
        title: 'The Greeks (Equity)',
        category: 'Equity Derivatives',
        slug: 'equity-derivatives',
        difficulty: 'Hard',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/equity-derivatives/Fiche 4 Equity Les Grecs sensibilités aux facteurs de risque.png'
    },
    {
        id: 'eq-5',
        title: 'Straddle vs Strangle',
        category: 'Equity Derivatives',
        slug: 'equity-derivatives',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/equity-derivatives/Fiche 5 Equity stratégies straddle vs strangle.png'
    },
    {
        id: 'eq-6',
        title: 'Risk Reversal & Skew',
        category: 'Equity Derivatives',
        slug: 'equity-derivatives',
        difficulty: 'Hard',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/equity-derivatives/Fiche 6 Equity Risk reversal le skew.png'
    },
    {
        id: 'eq-7',
        title: 'Option Binaire (Digit)',
        category: 'Equity Derivatives',
        slug: 'equity-derivatives',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/equity-derivatives/Fiche 7 Equity Option Binaire (Digit).png'
    },
    {
        id: 'eq-8',
        title: 'Option Price Breakdown',
        category: 'Equity Derivatives',
        slug: 'equity-derivatives',
        difficulty: 'Easy',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/equity-derivatives/Fiche 8 Equity Décomposition du prix d\'une option (prime).png'
    },

    // --- STRUCTURED PRODUCTS SHEETS ---
    {
        id: 'sp-1',
        title: 'Phoenix Autocall',
        category: 'Structured Products',
        slug: 'structured-products',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/structured-products/Fiche 1 Produits Structurés décomposition phoenix autocall.png'
    },
    {
        id: 'sp-2',
        title: 'Correlation & Dispersion',
        category: 'Structured Products',
        slug: 'structured-products',
        difficulty: 'Hard',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/structured-products/Fiche 2 Produits Structurés Corrélation & Dispersion.png'
    },
    {
        id: 'sp-3',
        title: 'Coupon Anatomy',
        category: 'Structured Products',
        slug: 'structured-products',
        difficulty: 'Easy',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/structured-products/Fiche 3 Produits Structurés Anatomie du Coupon.png'
    },
    {
        id: 'sp-4',
        title: 'CMS Steepener',
        category: 'Structured Products',
        slug: 'structured-products',
        difficulty: 'Hard',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/structured-products/Fiche 4 Produits Structurés CMS Steepener.png'
    },
    {
        id: 'sp-5',
        title: 'Range Accrual',
        category: 'Structured Products',
        slug: 'structured-products',
        difficulty: 'Medium',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/structured-products/Fiche 5 Produits Structurés Range Accrual.png'
    },
    {
        id: 'sp-6',
        title: 'Phoenix Bearish CMS',
        category: 'Structured Products',
        slug: 'structured-products',
        difficulty: 'Hard',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/structured-products/Fiche 6 Produits Structurés Phoenix Bearish CMS.png'
    },
    {
        id: 'sp-7',
        title: 'Phoenix vs Athena',
        category: 'Structured Products',
        slug: 'structured-products',
        difficulty: 'Medium',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/structured-products/Fiche 7 Produits Structurés Phoenix vs Athena.png'
    },
    {
        id: 'sp-8',
        title: 'Hybrid Range Accrual',
        category: 'Structured Products',
        slug: 'structured-products',
        difficulty: 'Hard',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/structured-products/Fiche 8 Produits Structurés Hybride Range Accrual.png'
    },

    // --- MOCK DATA (Other Categories) ---
    { id: '7', title: 'Macroeconomics 101', category: 'Macroeconomics', slug: 'macroeconomics', difficulty: 'Easy', progress: 90, variant: 'kraft' },
    { id: '8', title: 'CDS Mechanics', category: 'Credit Derivatives', slug: 'credit-derivatives', difficulty: 'Medium', progress: 0, variant: 'white' },
];

export type Category = {
    id: string;
    title: string;
    slug: string; // URL path
    description: string;
    count?: number;
};

export const CATEGORIES: Category[] = [
    { id: 'cat-1', title: 'Rates & Fixed Income', slug: 'rates-fixed-income', description: 'Bonds, Yields, Swaps & Inflation' },
    { id: 'cat-2', title: 'Equity Derivatives', slug: 'equity-derivatives', description: 'Options, Futures, Volatility & Exotics' },
    { id: 'cat-3', title: 'Structured Products', slug: 'structured-products', description: 'Autocalls, Capital Guarantee & Payoffs' },
    { id: 'cat-4', title: 'Macroeconomics', slug: 'macroeconomics', description: 'Central Banks, GDP, FX & Geopolitics' },
    { id: 'cat-5', title: 'Credit Derivatives', slug: 'credit-derivatives', description: 'CDS, CDO, CVA & Default Risk' },
    { id: 'cat-6', title: 'FX & Commodities', slug: 'fx-commodities', description: 'Forex Pairs, Gold, Oil & Hedging' },
];
