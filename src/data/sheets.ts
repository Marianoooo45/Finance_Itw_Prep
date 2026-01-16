export type Sheet = {
    id: string;
    title: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    progress: number;
    variant: 'kraft' | 'white';
    imageUrl?: string;
    slug: string;
};

export const REVISION_SHEETS: Sheet[] = [
    // --- RATES & FIXED INCOME SHEETS ---
    {
        id: 'fi-1',
        title: 'Cap & Floor Mechanics',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/Fiche 1 FIC cap floor.png'
    },
    {
        id: 'fi-2',
        title: 'Swaptions & FRA',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/Fiche 2 FIC swaption FRA.png'
    },
    {
        id: 'fi-3',
        title: 'Indices & Curves',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/Fiche 3 FIC indices et courbes.png'
    },
    {
        id: 'fi-4',
        title: 'Bond Math (Sensis)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/Fiche 4 FIC bond math (sensis).png'
    },
    {
        id: 'fi-5',
        title: 'Spread & Valo',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Easy',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/Fiche 5 FIC spread & valo.png'
    },
    {
        id: 'fi-6',
        title: 'Inflation Derivatives',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/Fiche 6 FIC infla.png'
    },
    {
        id: 'fi-7',
        title: 'The Greeks (Risk)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Hard',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/Fiche 7 FIC greeks.png'
    },
    {
        id: 'fi-8',
        title: 'RFR vs IBOR',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Medium',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/Fiche 8 RFR vs IBOR .png'
    },
    {
        id: 'fi-9',
        title: 'Swaptions',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Hard',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/Fiche 9 Swaptions.png'
    },
    {
        id: 'fi-10',
        title: 'Cap & Floor (Technical)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Hard',
        progress: 0,
        variant: 'white',
        imageUrl: '/images/Fiche 10 FIC Fiche Technique Cap & Floor.png'
    },
    {
        id: 'fi-11',
        title: 'Swap Rates (Technical)',
        category: 'Rates & Fixed Income',
        slug: 'rates-fixed-income',
        difficulty: 'Hard',
        progress: 0,
        variant: 'kraft',
        imageUrl: '/images/Fiche 11 FIC Fiche Technique Le Taux de Swap (Par Swap Rate).png'
    },

    // --- MOCK DATA (Other Categories) ---
    { id: '1', title: 'Derivatives Basics', category: 'Equity Derivatives', slug: 'equity-derivatives', difficulty: 'Hard', progress: 30, variant: 'kraft' },
    { id: '3', title: 'Equity Markets', category: 'Equity Derivatives', slug: 'equity-derivatives', difficulty: 'Easy', progress: 80, variant: 'kraft' },
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
