'use client';

import React from 'react';

export function RevisionCard() {
    return (
        <div className="relative w-full h-full min-h-[300px] md:min-h-[350px] cursor-pointer group transition-transform duration-300 hover:scale-[1.02] hover:-rotate-1 revision-card-wrapper p-2">
            {/* Background Container stylisé - sans bordure dure pour laisser l'image respirer */}
            <div
                className="relative w-full h-full overflow-hidden shadow-xl"
                style={{
                    borderRadius: '4px', // Coins à peine arrondis pour style carnet
                    boxShadow: '8px 8px 12px rgba(0,0,0,0.25)',
                    transform: 'rotate(-0.5deg)'
                }}
            >
                {/* Image HD Finale - Style Manille */}
                <img
                    src="/images/revision-card-final.png"
                    alt="Revision Sheets"
                    className="w-full h-full object-cover"
                />

                {/* Effet de lueur au survol */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none mix-blend-overlay" />
            </div>
        </div>
    );
}
