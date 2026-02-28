/**
 * Quiz Data Types and Questions
 */

// === Question Types ===
// === Question Types ===
export type QuestionType = 'mcq' | 'payoff-draw' | 'formula-fill' | 'product-builder' | 'sequence' | 'slider';

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    title: string;
    relatedSheetId?: string;
    explanationImage?: string;
}

export interface SequenceQuestion extends BaseQuestion {
    type: 'sequence';
    prompt: string;
    items: { id: string; label: string }[];
    correctOrder: string[]; // array of item IDs
}

export interface SliderQuestion extends BaseQuestion {
    type: 'slider';
    prompt: string;
    minLabel: string;
    maxLabel: string;
    correctRange: [number, number]; // [min, max] typically 0-100
    feedback: {
        low: { title: string; text: string };
        high: { title: string; text: string };
        correct: { title: string; text: string };
    };
}

export interface MCQQuestion extends BaseQuestion {
    type: 'mcq';
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

export interface PayoffDrawQuestion extends BaseQuestion {
    type: 'payoff-draw';
    prompt: string;
    referencePoints: { x: number; y: number }[];
    strike?: number;
    barrier?: number;
    tolerance: number;
}

export interface FormulaFillQuestion extends BaseQuestion {
    type: 'formula-fill';
    formula: string;
    blanks: { id: string; answer: string; hint?: string }[];
    context?: string;
}

export interface ProductBrick {
    id: string;
    label: string;
    type: 'long' | 'short';
    instrument: 'call' | 'put' | 'stock' | 'bond';
    color: string;
}

export interface ProductBuilderQuestion extends BaseQuestion {
    type: 'product-builder';
    prompt: string;
    availableBricks: ProductBrick[];
    correctCombination: string[];
    hint?: string;
}

export type Question = MCQQuestion | PayoffDrawQuestion | FormulaFillQuestion | ProductBuilderQuestion | SequenceQuestion | SliderQuestion;

// === Demo Questions ===
export const QUIZ_QUESTIONS: Question[] = [
    // Question 1: MCQ - Delta
    {
        id: 'q1',
        type: 'mcq',
        category: 'Equity Derivatives',
        difficulty: 'Easy',
        title: 'Le Delta',
        relatedSheetId: 'eq-4', // The Greeks (Equity)
        question: 'Que représente le Delta (Δ) d\'une option ?',
        options: [
            'La sensibilité du prix de l\'option au temps',
            'La sensibilité du prix de l\'option au prix du sous-jacent',
            'La sensibilité du prix de l\'option à la volatilité',
            'La sensibilité du prix de l\'option aux taux d\'intérêt'
        ],
        correctIndex: 1,
        explanation: 'Le Delta mesure la variation du prix de l\'option pour une variation de 1€ du sous-jacent. Un Delta de 0.5 signifie que si le sous-jacent monte de 1€, l\'option monte de 0.50€.'
    },

    // Question 2: Payoff Draw - Put Down-and-In
    {
        id: 'q2',
        type: 'payoff-draw',
        category: 'Equity Derivatives',
        difficulty: 'Medium',
        title: 'Payoff PDI',
        relatedSheetId: 'eq-3', // Put Down-and-In
        prompt: 'Dessine le payoff à maturité d\'un Put Down-and-In (Strike = 100, Barrière = 80)',
        strike: 100,
        barrier: 80,
        referencePoints: [
            { x: 0, y: 100 },   // S=0, payoff=100
            { x: 80, y: 20 },   // S=80, payoff=20
            { x: 80, y: 0 },    // S>80 (step), payoff=0 
            { x: 150, y: 0 }    // S>80, payoff=0
        ],
        tolerance: 15
    },

    // Question 3: Formula Fill - Black-Scholes
    {
        id: 'q3',
        type: 'formula-fill',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Formule Black-Scholes',
        relatedSheetId: 'eq-11', // Black Scholes Formula
        context: 'Complète la formule de Black-Scholes pour un Call européen :',
        formula: 'C = S₀ × N(d₁) - K × e^(-rT) × N(___)',
        blanks: [
            { id: 'b1', answer: 'd2', hint: 'd₁ ou d₂ ?' }
        ]
    },

    // Question 4: MCQ - Phoenix Autocall Risk
    {
        id: 'q4',
        type: 'mcq',
        category: 'Structured Products',
        difficulty: 'Medium',
        title: 'Risque Phoenix',
        relatedSheetId: 'sp-1', // Phoenix Autocall
        question: 'Quel est le principal risque pour un investisseur dans un Phoenix Autocall ?',
        options: [
            'Le risque de rappel anticipé (autocall)',
            'Le risque de perte en capital si la barrière est franchie',
            'Le risque de ne pas recevoir de coupons',
            'Le risque de taux d\'intérêt'
        ],
        correctIndex: 1,
        explanation: 'Le principal risque est la perte en capital si le sous-jacent franchit la barrière à la baisse. L\'investisseur peut alors perdre une partie significative de son capital.'
    },

    // Question 5: Product Builder - Call Spread
    {
        id: 'q5',
        type: 'product-builder',
        category: 'Equity Derivatives',
        difficulty: 'Medium',
        title: 'Construire un Call Spread',
        relatedSheetId: 'eq-2', // Call Spread & Butterfly
        prompt: 'Construis un Bull Call Spread (Call Spread haussier)',
        availableBricks: [
            { id: 'long-call-low', label: 'Long Call K₁', type: 'long', instrument: 'call', color: '#4ade80' },
            { id: 'short-call-high', label: 'Short Call K₂', type: 'short', instrument: 'call', color: '#f87171' },
            { id: 'long-put', label: 'Long Put', type: 'long', instrument: 'put', color: '#4ade80' },
            { id: 'short-put', label: 'Short Put', type: 'short', instrument: 'put', color: '#f87171' },
            { id: 'long-stock', label: 'Long Stock', type: 'long', instrument: 'stock', color: '#60a5fa' }
        ],
        correctCombination: ['long-call-low', 'short-call-high'],
        hint: 'Un Call Spread combine deux Calls avec des strikes différents...'
    },

    // --- NEW QUESTIONS ---

    // Question 6: Sequence - Trade Lifecycle
    {
        id: 'q6',
        type: 'sequence',
        category: 'Rates & Fixed Income',
        difficulty: 'Easy',
        title: 'Cycle de vie d\'un Trade',
        prompt: 'Remets dans l\'ordre les étapes du cycle de vie d\'un trade',
        relatedSheetId: 'fi-15', // Pricing Sales
        items: [
            { id: '1', label: 'Pricing & Negotiation' },
            { id: '2', label: 'Booking (FO)' },
            { id: '3', label: 'Validation (MO)' },
            { id: '4', label: 'Confirmation & Settlement (BO)' }
        ],
        correctOrder: ['1', '2', '3', '4']
    },

    // Question 7: MCQ - Gamma
    {
        id: 'q7',
        type: 'mcq',
        category: 'Rates & Fixed Income',
        difficulty: 'Medium',
        title: 'Gamma & Convexity',
        relatedSheetId: 'fi-4', // Gamma Convexity
        question: 'Quelle est la relation entre le Gamma et le Thêta pour un portefeuille Delta-Neutre ?',
        options: [
            'Ils sont généralement de signes opposés',
            'Ils sont toujours positifs tous les deux',
            'Ils sont inversement proportionnels à la volatilité',
            'Il n\'y a aucune relation mathématique'
        ],
        correctIndex: 0,
        explanation: 'Pour un portefeuille Delta-Neutre, le Gamma et le Thêta sont généralement opposés. Si vous êtes Long Gamma (positif), vous payez du Thêta (négatif, perte de valeur temps).'
    },

    // Question 8: Payoff Draw - Straddle
    {
        id: 'q8',
        type: 'payoff-draw',
        category: 'Equity Derivatives',
        difficulty: 'Medium',
        title: 'Payoff Straddle',
        relatedSheetId: 'eq-5', // Straddle vs Strangle
        prompt: 'Dessine le payoff à maturité d\'un Long Straddle (Strike = 100)',
        strike: 100,
        referencePoints: [
            { x: 50, y: 50 },   // S=50, Put gains 50
            { x: 100, y: 0 },   // S=100, Both 0
            { x: 150, y: 50 }   // S=150, Call gains 50
        ],
        tolerance: 15
    },

    // Question 9: Product Builder - Collar (Rates)
    {
        id: 'q9',
        type: 'product-builder',
        category: 'Rates & Fixed Income',
        difficulty: 'Medium',
        title: 'Collar (Emprunteur)',
        relatedSheetId: 'fi-11', // Cap & Floor Mechanics
        prompt: 'Construis un Collar pour un emprunteur à taux variable (protection contre la hausse, financement par la baisse)',
        hint: 'L\'emprunteur craint la hausse des taux (Achète Cap) et accepte de limiter son gain à la baisse (Vend Floor).',
        availableBricks: [
            { id: 'long-cap', label: 'Achat Cap', type: 'long', instrument: 'call', color: '#4ade80' },
            { id: 'short-cap', label: 'Vente Cap', type: 'short', instrument: 'call', color: '#f87171' },
            { id: 'long-floor', label: 'Achat Floor', type: 'long', instrument: 'put', color: '#4ade80' },
            { id: 'short-floor', label: 'Vente Floor', type: 'short', instrument: 'put', color: '#f87171' }
        ],
        correctCombination: ['long-cap', 'short-floor'],
        explanationImage: '/images/quiz/collar-payoff.png' // Keep existing or update if available
    },

    // Question 10: MCQ - Autocall Barrier
    {
        id: 'q10',
        type: 'mcq',
        category: 'Structured Products',
        difficulty: 'Hard',
        title: 'Barrière Déactivante',
        relatedSheetId: 'sp-1', // Phoenix Autocall
        question: 'Dans un Phoenix, si la barrière de protection du capital est "américaine", quand est-elle observée ?',
        options: [
            'Uniquement à maturité',
            'Aux dates de constatation des coupons',
            'En continu pendant toute la durée de vie',
            'Uniquement si le produit est rappelé'
        ],
        correctIndex: 2,
        explanation: 'Une barrière américaine est observée en continu. Si le sous-jacent touche la barrière à n\'importe quel moment (intraday ou clôture selon contrat), la protection saute.'
    },

    // Question 11: Sequence - Structuring Process
    {
        id: 'q11',
        type: 'sequence',
        category: 'Structured Products',
        difficulty: 'Medium',
        title: 'Structuration d\'un produit',
        prompt: 'Remets dans l\'ordre les étapes de création d\'un produit structuré',
        items: [
            { id: '1', label: 'Idée / Demande Client' },
            { id: '2', label: 'Back-testing & Pricing' },
            { id: '3', label: 'Termsheet & Marketing' },
            { id: '4', label: 'Emission (EMT)' }
        ],
        correctOrder: ['1', '2', '3', '4']
    },

    // Question 12: MCQ - Digital Option
    {
        id: 'q12',
        type: 'mcq',
        category: 'Equity Derivatives',
        difficulty: 'Easy',
        title: 'Option Digitale',
        relatedSheetId: 'eq-7', // Option Binaire
        question: 'Quel est le payoff d\'un Call Digital (Cash-or-Nothing) ?',
        options: [
            'Max(S - K, 0)',
            'Montant fixe si S > K, sinon 0',
            'Montant fixe si S < K, sinon 0',
            'S - K'
        ],
        correctIndex: 1,
        explanation: 'Un Call Digital verse un montant fixe pré-déterminé si le sous-jacent finit au-dessus du strike. Sinon, il ne verse rien.'
    },

    // Question 13: Product Builder - Protective Put
    {
        id: 'q13',
        type: 'product-builder',
        category: 'Equity Derivatives',
        difficulty: 'Easy',
        title: 'Protective Put',
        relatedSheetId: 'eq-1', // Call & Put Basics (covers payoffs)
        prompt: 'Construis une stratégie pour protéger ton portefeuille actions',
        availableBricks: [
            { id: 'long-stock', label: 'Long Stock', type: 'long', instrument: 'stock', color: '#60a5fa' },
            { id: 'short-stock', label: 'Short Stock', type: 'short', instrument: 'stock', color: '#f87171' },
            { id: 'long-put', label: 'Long Put', type: 'long', instrument: 'put', color: '#4ade80' },
            { id: 'short-call', label: 'Short Call', type: 'short', instrument: 'call', color: '#f87171' }
        ],
        correctCombination: ['long-stock', 'long-put'],
        hint: 'Tu as les actions et tu achètes une assurance.'
    },

    // Question 14: Payoff Draw - Long Call
    {
        id: 'q14',
        type: 'payoff-draw',
        category: 'Equity Derivatives',
        difficulty: 'Easy',
        title: 'Payoff Call',
        relatedSheetId: 'eq-1', // Call & Put Basics
        prompt: 'Dessine le payoff à maturité d\'un Long Call (Strike = 100)',
        strike: 100,
        referencePoints: [
            { x: 0, y: 0 },     // S < K, Payoff = 0
            { x: 100, y: 0 },   // S = K, Payoff = 0
            { x: 150, y: 50 }   // S > K, Payoff = S - K
        ],
        tolerance: 15
    },

    // Question 15: Payoff Draw - Long Put
    {
        id: 'q15',
        type: 'payoff-draw',
        category: 'Equity Derivatives',
        difficulty: 'Easy',
        title: 'Payoff Put',
        relatedSheetId: 'eq-1', // Call & Put Basics
        prompt: 'Dessine le payoff à maturité d\'un Long Put (Strike = 100)',
        strike: 100,
        referencePoints: [
            { x: 0, y: 100 },   // S = 0, Payoff = K
            { x: 100, y: 0 },   // S = K, Payoff = 0
            { x: 150, y: 0 }    // S > K, Payoff = 0
        ],
        tolerance: 15
    },

    // Question 16: Formula Fill - Call-Put Parity
    {
        id: 'q16',
        type: 'formula-fill',
        category: 'Equity Derivatives',
        difficulty: 'Medium',
        title: 'Parité Call-Put',
        relatedSheetId: 'eq-10', // Call-Put Parity
        context: 'Complète la formule fondamentale de la Parité Call-Put (sans dividendes) :',
        formula: 'C_t - P_t = S_t - K * ___',
        blanks: [
            { id: 'b1', answer: 'e^(-rT)', hint: '?' }
        ]
    },

    // Question 17: MCQ - Dividends Impact
    {
        id: 'q17',
        type: 'mcq',
        category: 'Equity Derivatives',
        difficulty: 'Medium',
        title: 'Dividendes & Call',
        relatedSheetId: 'eq-10', // Call-Put Parity
        question: 'Selon la parité Call-Put, si les dividendes anticipés augmentent, comment réagit le prix du Call ?',
        options: [
            'Il augmente',
            'Il baisse',
            'Il reste inchangé',
            'Cela dépend du strike'
        ],
        correctIndex: 1,
        explanation: 'Si les dividendes augmentent, le Forward baisse (F = S - PV(Div)). Comme le Call est une exposition à la hausse du Forward, son prix diminue.'
    },

    // Question 18: Payoff Draw - Digital Call
    {
        id: 'q18',
        type: 'payoff-draw',
        category: 'Equity Derivatives',
        difficulty: 'Medium',
        title: 'Payoff Digitale',
        relatedSheetId: 'eq-7', // Option Binaire
        prompt: 'Dessine le payoff à maturité d\'un Call Digital (Strike = 100, Nominal = 50)',
        strike: 100,
        referencePoints: [
            { x: 0, y: 0 },     // S < 100, Payoff = 0
            { x: 100, y: 0 },   // Step start
            { x: 100, y: 50 },  // Step vertical up
            { x: 150, y: 50 }   // S > 100, Payoff = 50
        ],
        tolerance: 15
    },

    // Question 19: Formula Fill - Binary Call Pricing
    {
        id: 'q19',
        type: 'formula-fill',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Pricing Binaire',
        relatedSheetId: 'eq-7', // Option Binaire
        context: 'Formule du prix d\'un Call Binaire (Strike K, Nominal 1) :',
        formula: 'Price = e^{-rT} * N(___)',
        blanks: [
            { id: 'b1', answer: 'd2', hint: 'd₁ ou d₂ ?' }
        ]
    },

    // Question 20: MCQ - Binary Option Greeks
    {
        id: 'q20',
        type: 'mcq',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Grecques Digitale',
        relatedSheetId: 'eq-7', // Option Binaire
        question: 'Quelle est la particularité du Delta d\'une option binaire autour du strike (ATM) ?',
        options: [
            'Il est proche de 1',
            'Il atteint son maximum (forme de cloche)',
            'Il est toujours égal à 0.5',
            'Il est nul'
        ],
        correctIndex: 1,
        explanation: 'Le Delta d\'une binaire ressemble à une densité de probabilité (cloche de Gauss). Il est maximal autour du strike car c\'est là que l\'incertitude est la plus grande (tout ou rien).'
    },

    // Question 21: Product Builder - Digital Replication
    {
        id: 'q21',
        type: 'product-builder',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Réplication Digitale',
        relatedSheetId: 'eq-7', // Option Binaire
        prompt: 'Réplique une Option Binaire (Call Digital) via un Call Spread très serré',
        hint: 'Tu veux créer une pente presque verticale au strike K.',
        availableBricks: [
            { id: 'long-call', label: 'Long Call K', type: 'long', instrument: 'call', color: '#4ade80' },
            { id: 'short-call', label: 'Short Call K+ε', type: 'short', instrument: 'call', color: '#f87171' },
            { id: 'long-put', label: 'Long Put K', type: 'long', instrument: 'put', color: '#4ade80' },
            { id: 'short-put', label: 'Short Put K-ε', type: 'short', instrument: 'put', color: '#f87171' }
        ],
        correctCombination: ['long-call', 'short-call']
    },

    // Question 22: MCQ - Put Down-and-In Definition
    {
        id: 'q22',
        type: 'mcq',
        category: 'Equity Derivatives',
        difficulty: 'Easy',
        title: 'Définition PDI',
        relatedSheetId: 'eq-3', // Put Down-and-In
        question: 'Qu\'est-ce qu\'un Put Down-and-In ?',
        options: [
            'Un Put qui existe dès le départ',
            'Un Put qui s\'active uniquement si le cours touche une barrière basse',
            'Un Put qui disparait si le cours touche une barrière basse',
            'Un Put avec un strike par paliers'
        ],
        correctIndex: 1,
        explanation: 'Le Put Down-and-In (PDI) "n\'existe pas" au début. Il faut que le sous-jacent descende (Down) pour entrer (In) et activer l\'option.'
    },

    // Question 23: MCQ - Scenario PDI
    {
        id: 'q23',
        type: 'mcq',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Scénario PDI',
        relatedSheetId: 'eq-3', // Put Down-and-In
        question: 'Situation : PDI Strike 100, Barrière 80. Le sous-jacent descend à 75 (Touché !), puis remonte et finit à 90. Quel est le Payoff ?',
        options: [
            '0 (L\'option est désactivée)',
            '10 (100 - 90)',
            '25 (100 - 75)',
            '90 (Prix final)'
        ],
        correctIndex: 1,
        explanation: 'La barrière a été touchée (75 < 80) -> Le Put est ACTIVÉ (Knock-In). À maturité, S=90 < K=100, donc le Put paie K - S = 10.'
    },

    // Question 24: MCQ - PDI Replication Theory
    {
        id: 'q24',
        type: 'mcq',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Réplication Théorique vs Pratique',
        relatedSheetId: 'eq-9', // Replication & Hedging PDI
        question: 'En théorie, PDI = Put Vanille - Put Down-and-Out (PDO). Pourquoi les traders n\'utilisent pas cette formule pour le hedging ?',
        options: [
            'Car le PDO est trop cher',
            'Car le PDO est illiquide et impossible à acheter pour se couvrir',
            'Car la formule est mathématiquement fausse',
            'Car le Delta est nul'
        ],
        correctIndex: 1,
        explanation: 'Le PDO (Put qui disparaît à la baisse) est un cauchemar de gestion (Gamma inversé, Discontinuité). Personne ne vend de PDO "vanille" sur le marché, donc le trader ne peut pas l\'acheter pour se couvrir.'
    },

    // Question 25: Product Builder - PDI Spread
    {
        id: 'q25',
        type: 'product-builder',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Le "Saut" du PDI',
        relatedSheetId: 'eq-9', // Replication & Hedging PDI
        prompt: 'Comment le trader réplique-t-il l\'activation brutale (Digital) à la barrière B ? (Spread très serré)',
        hint: 'On veut créer une pente raide juste au-dessus de la barrière B.',
        availableBricks: [
            { id: 'long-put-high', label: 'Long Put B+ε', type: 'long', instrument: 'put', color: '#4ade80' },
            { id: 'short-put-low', label: 'Short Put B', type: 'short', instrument: 'put', color: '#f87171' },
            { id: 'long-call', label: 'Long Call B', type: 'long', instrument: 'call', color: '#4ade80' },
            { id: 'short-bond', label: 'Emprunt', type: 'short', instrument: 'bond', color: '#f87171' }
        ],
        correctCombination: ['long-put-high', 'short-put-low']
    },

    // Question 26: Slider - Sweet Spot
    {
        id: 'q26',
        type: 'slider',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Calibrer le "Sweet Spot"',
        relatedSheetId: 'eq-9', // Replication & Hedging PDI
        prompt: 'Trouve le bon Epsilon (ε) pour le Put Spread.',
        minLabel: 'ε Petit (0.1%)',
        maxLabel: 'ε Grand (5%)',
        correctRange: [20, 40],
        feedback: {
            low: {
                title: '🛑 STOP ! Le Trader refuse.',
                text: 'Le profil est trop vertical. Le Gamma est infini à la barrière. Impossible à couvrir !'
            },
            high: {
                title: '🛑 STOP ! Le Sales refuse.',
                text: 'Le profil est trop mou. Le spread coûte trop cher à acheter. Le coupon du client devient ridicule.'
            },
            correct: {
                title: '✅ BRAVO ! Arbitrage réussi.',
                text: 'Risque gérable pour le desk (Gamma fini) et prix correct pour structurer un bon coupon.'
            }
        }
    },

    // Question 27: MCQ - Indépendance Banque Centrale
    {
        id: 'q27',
        type: 'mcq',
        category: 'Macro & Rates',
        difficulty: 'Medium',
        title: 'Indépendance de la Banque Centrale',
        question: 'Pourquoi une banque centrale doit-elle être indépendante ?',
        options: [
            'Pour éviter que le gouvernement n\'imprime de la monnaie pour financer ses déficits (monétisation de la dette)',
            'Pour pouvoir augmenter les impôts sans l\'accord du parlement',
            'Pour réaliser un profit maximum sur ses réserves de change',
            'Pour être cotée en bourse'
        ],
        correctIndex: 0,
        explanation: 'L\'indépendance permet d\'éviter les cycles politiques et la monétisation de la dette publique, garantissant ainsi son objectif principal : la stabilité des prix.'
    },

    // Question 28: MCQ - Produit Long Brent
    {
        id: 'q28',
        type: 'mcq',
        category: 'Commodities',
        difficulty: 'Medium',
        title: 'Exposition au Brent',
        question: 'Pour être "Long" sur le Brent (pétrole), quel produit pouvez-vous acheter ?',
        options: [
            'Un contrat Future ou un Call sur le Brent',
            'Un Put sur le Brent',
            'Une obligation d\'Etat',
            'Vendre à découvert des actions d\'entreprises énergétiques'
        ],
        correctIndex: 0,
        explanation: 'Pour être long (parier sur la hausse), on peut acheter des contrats Futures sur le Brent ou des options d\'achat (Call).'
    },

    // Question 29: MCQ - Politique Monétaire Expansionniste
    {
        id: 'q29',
        type: 'mcq',
        category: 'Macro & Rates',
        difficulty: 'Easy',
        title: 'Politique Monétaire Expansionniste',
        question: 'Qu\'est-ce qu\'une politique monétaire expansionniste ?',
        options: [
            'Une politique visant à augmenter les taux d\'intérêt et réduire la masse monétaire',
            'Une politique visant à baisser les taux directeurs et injecter de la liquidité pour stimuler l\'économie',
            'Une réduction drastique des dépenses publiques',
            'Une politique purement fiscale d\'augmentation des impôts'
        ],
        correctIndex: 1,
        explanation: 'Une politique expansionniste (ex: baisse des taux, quantitative easing) vise à relancer la croissance économique en facilitant le crédit bancaire.'
    },

    // Question 30: MCQ - Le Funding
    {
        id: 'q30',
        type: 'mcq',
        category: 'Trading Desk',
        difficulty: 'Medium',
        title: 'Le Funding (Financement)',
        question: 'Dans une salle de marché, qu\'est-ce que le "funding" ?',
        options: [
            'Le coût d\'acquisition marketing des clients',
            'Le coût d\'emprunt ou de placement de liquidités pour financer les positions du desk',
            'Les primes versées aux dirigeants',
            'Les frais de courtage'
        ],
        correctIndex: 1,
        explanation: 'Le funding est le coût de financement. Un desk doit emprunter ou prêter du cash pour maintenir ses positions, et ce taux d\'intérêt impacte directement son P&L global.'
    },

    // Question 31: MCQ - L'inflation
    {
        id: 'q31',
        type: 'mcq',
        category: 'Macro & Rates',
        difficulty: 'Easy',
        title: 'L\'Inflation : Bien ou Mal ?',
        question: 'L\'inflation est-elle bénéfique ou néfaste pour l\'économie ?',
        options: [
            'Toujours bénéfique, car elle fait monter la valeur nominale des actifs',
            'Toujours néfaste car elle détruit le pouvoir d\'achat de l\'épargne quoiqu\'il arrive',
            'Une inflation modérée (autour de 2%) est considérée comme saine, mais des extrêmes (hyper-inflation ou déflation) sont néfastes',
            'L\'inflation n\'a aucun impact réel car les salaires s\'ajustent instantanément'
        ],
        correctIndex: 2,
        explanation: 'Les banques centrales visent généralement une inflation modérée (environ 2%) pour encourager la consommation et l\'investissement, évitant ainsi un dangereux cycle de déflation.'
    },

    // Question 32: MCQ - Varswap
    {
        id: 'q32',
        type: 'mcq',
        category: 'Equity Derivatives',
        difficulty: 'Hard',
        title: 'Intérêt du Variance Swap (Varswap)',
        question: 'Quel est le principal intérêt de traiter un Variance Swap (Varswap) ?',
        options: [
            'S\'exposer purement à la volatilité réalisée sans le risque directionnel lié au spot et sans besoin de couverture dynamique continue (delta-hedging)',
            'Se couvrir directement contre le risque de crédit d\'un client',
            'Parier de manière pure directionnelle sur la hausse d\'une action sans verser la prime',
            'Recevoir un taux d\'intérêt fixe'
        ],
        correctIndex: 0,
        explanation: 'Le Varswap offre une exposition pure à la variance d\'un sous-jacent. Il permet d\'éviter la gestion fastidieuse du delta hedging requise par un portefeuille d\'options classique.'
    }
];

// === Helper Functions ===
export function getQuestionsByCategory(category: string): Question[] {
    return QUIZ_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Question[] {
    return QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
}


