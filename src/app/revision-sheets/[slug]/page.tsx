'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { REVISION_SHEETS } from '@/data/sheets';
import { markSheetAsViewed } from '@/lib/user-stats';

export default function CategoryPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Filtrer les fiches par slug
    const categorySheets = REVISION_SHEETS.filter(sheet => sheet.slug === slug);

    // Track viewed sheet when modal is open or changed
    useEffect(() => {
        if (selectedIndex !== null && categorySheets[selectedIndex]) {
            markSheetAsViewed(categorySheets[selectedIndex].id);
        }
    }, [selectedIndex, categorySheets]);

    // Nom de catégorie
    const categoryName = categorySheets.length > 0
        ? categorySheets[0].category
        : slug.replace(/-/g, ' ').toUpperCase();

    // Navigation handlers
    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev);
    }, []);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex(prev => prev !== null && prev < categorySheets.length - 1 ? prev + 1 : prev);
    }, [categorySheets.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') setSelectedIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, handlePrev, handleNext]);

    if (!categorySheets.length) {
        return (
            <div className="min-h-screen bg-[#1a1918] text-[#e2d1a6] p-10 flex flex-col items-center justify-center font-sketch">
                <h1 className="text-4xl mb-4">Classified Information</h1>
                <p>No sheets found for this category yet.</p>
                <Link href="/revision-sheets" className="mt-8 underline hover:text-white">Back to Library</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-6 md:p-10 relative flex flex-col font-sans text-[#1a1918]"
            style={{
                backgroundColor: '#1a1918',
                backgroundImage: `radial-gradient(ellipse at center top, #2d2b2b 0%, #1f1d1d 40%, #161515 100%)`,
            }}
        >
            {/* HEADER */}
            <div className="max-w-7xl mx-auto w-full mb-12 flex flex-col items-start gap-6">
                <Link href="/revision-sheets">
                    <button className="
            px-4 py-2 font-sketch text-lg border-2 border-[#e2d1a6] bg-transparent text-[#e2d1a6]
            hover:bg-[#e2d1a6] hover:text-black transition-colors rounded-sm
            flex items-center gap-2
          ">
                        <ArrowLeft className="w-5 h-5" />
                        BACK TO LIBRARY
                    </button>
                </Link>

                <div className="w-full text-center">
                    <h1 className="text-4xl md:text-6xl font-sketch text-[#e2d1a6] tracking-wider relative z-10 uppercase">
                        {categoryName}
                    </h1>
                    <p className="text-[#e2d1a6]/60 font-mono mt-2 uppercase tracking-[0.2em] text-sm">
                        Confidential Revision Materials
                    </p>
                </div>
            </div>

            {/* GRID */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
                {categorySheets.map((sheet, index) => (
                    <div key={sheet.id} className="flex flex-col gap-4">
                        {/* Titre de la fiche */}
                        <div className="flex items-center gap-4">
                            <span className="text-[#e2d1a6] font-mono text-xl opacity-50">#{sheet.id.toUpperCase()}</span>
                            <h2 className="text-2xl md:text-3xl font-sketch text-white">{sheet.title}</h2>
                        </div>

                        {/* Cadre Image (Cliquable) */}
                        <div
                            className="relative group w-full aspect-[4/3] bg-[#f8f6f0] p-2 rotate-1 hover:rotate-0 transition-transform duration-300 shadow-2xl rounded-sm cursor-pointer"
                            onClick={() => sheet.imageUrl && setSelectedIndex(index)}
                        >
                            {/* Coin "Scotch" */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/20 backdrop-blur-sm rotate-[-2deg] z-10 border-l border-r border-white/10 pointer-events-none" />

                            <div className="w-full h-full border-2 border-[#1a1918] overflow-hidden bg-white relative">
                                {sheet.imageUrl ? (
                                    <img
                                        src={sheet.imageUrl}
                                        alt={sheet.title}
                                        className="w-full h-full object-contain p-2"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-sketch">
                                        [TOP SECRET IMAGE MISSING]
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer: Metadata & VIEW Button */}
                        <div className="flex items-end justify-between px-2">
                            <div className="flex flex-col text-[#e2d1a6]/80 font-mono text-sm">
                                <span>Difficulty: {sheet.difficulty}</span>
                                <span>Type: {sheet.variant.toUpperCase()}</span>
                            </div>

                            <button
                                onClick={() => sheet.imageUrl && setSelectedIndex(index)}
                                className="
                    px-5 py-1 font-sketch text-lg border-2 border-black bg-[#e2d1a6] text-black 
                    hover:bg-white hover:scale-105 transition-all cursor-pointer
                    shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                  "
                                style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
                            >
                                VIEW
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL LIGHTBOX WITH NAVIGATION */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                    onClick={() => setSelectedIndex(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-[#e2d1a6] transition-colors z-50"
                        onClick={() => setSelectedIndex(null)}
                    >
                        <X className="w-10 h-10" />
                    </button>

                    {/* Prev Button */}
                    {selectedIndex > 0 && (
                        <button
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-[#e2d1a6] transition-colors z-50 bg-black/50 p-2 rounded-full hover:bg-black/80"
                            onClick={handlePrev}
                        >
                            <ChevronLeft className="w-12 h-12" />
                        </button>
                    )}

                    {/* Next Button */}
                    {selectedIndex < categorySheets.length - 1 && (
                        <button
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-[#e2d1a6] transition-colors z-50 bg-black/50 p-2 rounded-full hover:bg-black/80"
                            onClick={handleNext}
                        >
                            <ChevronRight className="w-12 h-12" />
                        </button>
                    )}

                    <div
                        className="relative max-w-full max-h-full overflow-auto rounded-sm shadow-2xl border-4 border-[#1a1918] bg-[#f8f6f0]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={categorySheets[selectedIndex].imageUrl}
                            alt={categorySheets[selectedIndex].title}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                    </div>

                    {/* Title Overlay in Modal */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                        <h3 className="text-[#e2d1a6] font-sketch text-2xl drop-shadow-md bg-black/60 px-4 py-1 rounded">
                            {categorySheets[selectedIndex].title} ({selectedIndex + 1}/{categorySheets.length})
                        </h3>
                    </div>
                </div>
            )}

        </main>
    );
}
