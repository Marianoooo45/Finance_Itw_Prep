'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Newspaper, RefreshCw, AlertCircle } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    guid: string;
}

interface NewsData {
    source: string;
    items: NewsItem[];
}

const WobblyDecoration = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 120 12" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M2 6 Q15 2 30 6 Q45 10 60 6 Q75 2 90 6 Q105 10 118 6" />
    </svg>
);

export default function NewsPage() {
    const [newsData, setNewsData] = useState<NewsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/news');
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setNewsData(data);
            setCurrentPage(1); // Reset to page 1 on refresh
        } catch (err) {
            console.error(err);
            setError("Impossible de récupérer les actus. Le stagiaire a renversé du café sur le serveur.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch {
            return dateString;
        }
    };

    // Pagination Logic
    const totalItems = newsData?.items.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const currentItems = newsData?.items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    ) || [];

    return (
        <main className="min-h-screen relative bg-[#1a1918] text-[#e2d1a6] p-6 md:p-10 font-hand">
            {/* NOISE & BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none"
                style={{
                    background: `
                        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
                        radial-gradient(ellipse at center top, #2d2b2b 0%, #1f1d1d 40%, #161515 100%)
                    `,
                }}
            />

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto relative z-10">
                {/* HEADER */}
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 text-[#e2d1a6]/60 hover:text-[#e2d1a6] transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-sketch text-lg">Retour au QG</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="relative">
                            <h1 className="text-4xl md:text-6xl font-chalk font-bold text-[#e2d1a6] text-shadow-sketch mb-2">
                                MARKET NEWS
                            </h1>
                            <WobblyDecoration className="w-full text-[#e2d1a6] opacity-60" />
                            {newsData && (
                                <p className="text-sm text-[#e2d1a6]/60 font-mono mt-2">
                                    Source: {newsData.source} (Live) • {totalItems} articles
                                </p>
                            )}
                        </div>

                        <button
                            onClick={fetchNews}
                            disabled={loading}
                            className={`
                                flex items-center gap-2 px-4 py-2 
                                border-2 border-[#e2d1a6] rounded-full
                                text-[#1a1918] bg-[#e2d1a6] font-bold font-sketch tracking-wide
                                hover:bg-[#d8c89d] hover:scale-105 active:scale-95 transition-all
                                shadow-[4px_4px_0px_rgba(0,0,0,0.5)]
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'CHARGEMENT...' : 'ACTUALISER'}
                        </button>
                    </div>
                </header>

                {/* NEWS LIST */}
                <div className="grid gap-6 min-h-[600px]">
                    {loading ? (
                        // SKELETONS
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="animate-pulse flex flex-col gap-3 p-6 border-b-2 border-[#e2d1a6]/10">
                                <div className="h-6 bg-[#e2d1a6]/20 w-3/4 rounded-md"></div>
                                <div className="h-4 bg-[#e2d1a6]/10 w-1/2 rounded-md"></div>
                                <div className="h-16 bg-[#e2d1a6]/5 w-full rounded-md mt-2"></div>
                            </div>
                        ))
                    ) : error ? (
                        // ERROR STATE
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#e2d1a6]/30 rounded-2xl">
                            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                            <h3 className="text-2xl font-chalk text-[#e2d1a6] mb-2">Oups !</h3>
                            <p className="opacity-80 max-w-md">{error}</p>
                            <button onClick={fetchNews} className="mt-6 underline decoration-wavy decoration-[#e2d1a6] hover:text-white">
                                Réessayer
                            </button>
                        </div>
                    ) : (
                        // NEWS ITEMS
                        <>
                            {currentItems.map((item, idx) => (
                                <a
                                    key={item.guid || idx}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block relative"
                                >
                                    <div className={`
                                        relative bg-[#1a1918] border-2 border-[#e2d1a6]/30 p-6 rounded-lg
                                        hover:border-[#e2d1a6] hover:bg-[#e2d1a6]/5 transition-all duration-300
                                        ${idx % 2 === 0 ? 'rotate-[0.5deg]' : 'rotate-[-0.5deg]'}
                                        hover:rotate-0 hover:scale-[1.01] hover:shadow-[0px_0px_30px_rgba(226,209,166,0.1)]
                                    `}>
                                        {/* PIN DECORATION */}
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 border-2 border-[#1a1918] shadow-sm z-20"></div>

                                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-[#e2d1a6] text-[#1a1918] text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">
                                                        News
                                                    </span>
                                                    <span className="text-xs font-mono opacity-50">
                                                        {formatDate(item.pubDate)}
                                                    </span>
                                                </div>

                                                <h2 className="text-xl md:text-2xl font-chalk font-bold text-[#e2d1a6] mb-3 group-hover:text-white transition-colors leading-tight">
                                                    {item.title}
                                                </h2>

                                                {item.description && item.description.trim() !== '' && item.description !== 'null' && item.description.length < 300 && (
                                                    <p className="text-sm md:text-base opacity-70 line-clamp-3 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="md:self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                                <ExternalLink className="w-6 h-6 text-[#e2d1a6]" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}

                            {/* PAGINATION CONTROLS (Sketchy Style) */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t-2 border-dashed border-[#e2d1a6]/20">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="
                                            group relative px-6 py-2
                                            font-sketch font-bold text-lg
                                            text-[#e2d1a6] disabled:opacity-40 disabled:cursor-not-allowed
                                            transition-transform active:scale-95 hover:-rotate-2
                                        "
                                    >
                                        <div className="absolute inset-0 border-2 border-[#e2d1a6] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] group-hover:bg-[#e2d1a6]/10 transition-colors"></div>
                                        <span>← Précédent</span>
                                    </button>

                                    <div className="font-sketch text-xl px-4 py-2 bg-[#e2d1a6]/10 rounded-lg transform rotate-1 border border-[#e2d1a6]/30">
                                        Page <span className="text-[#e2d1a6] font-bold text-2xl mx-1">{currentPage}</span> / {totalPages}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="
                                            group relative px-6 py-2
                                            font-sketch font-bold text-lg
                                            text-[#e2d1a6] disabled:opacity-40 disabled:cursor-not-allowed
                                            transition-transform active:scale-95 hover:rotate-2
                                        "
                                    >
                                        <div className="absolute inset-0 border-2 border-[#e2d1a6] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] group-hover:bg-[#e2d1a6]/10 transition-colors"></div>
                                        <span>Suivant →</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* FOOTER MESSAGE */}
                <div className="text-center mt-12 opacity-40 font-sketch text-sm">
                    <p>Information is power, but coffee is fuel.</p>
                </div>
            </div>
        </main>
    );
}
