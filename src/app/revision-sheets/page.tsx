'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { CATEGORIES } from '@/data/sheets';

export default function RevisionSheetsPage() {

    return (
        <main className="min-h-screen p-6 md:p-10 relative flex flex-col font-sans text-[#1a1918]"
            style={{
                backgroundColor: '#1a1918',
                backgroundImage: `
          radial-gradient(ellipse at center top, #2d2b2b 0%, #1f1d1d 40%, #161515 100%)
        `,
            }}
        >
            {/* HEADER: Title */}
            <div className="max-w-7xl mx-auto w-full mb-12 flex flex-col items-center">

                {/* Navigation Back */}
                <div className="self-start mb-4">
                    <Link href="/" className="flex items-center gap-2 text-[#e2d1a6] hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-sketch text-lg">BACK TO DESK</span>
                    </Link>
                </div>

                {/* Title */}
                <div className="relative mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-sketch text-[#e2d1a6] tracking-wider relative z-10 uppercase">
                        Start Revising
                    </h1>
                    <p className="text-[#e2d1a6]/60 font-mono mt-2 uppercase tracking-[0.2em] text-sm">
                        Select a Topic to Open its File
                    </p>
                </div>
            </div>

            {/* GRID OF CATEGORIES */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 content-start">
                {CATEGORIES.map((cat) => (
                    <Link key={cat.id} href={`/revision-sheets/${cat.slug}`} className="block h-full">
                        <div
                            className="
                  relative p-6 flex flex-col h-64 shadow-xl transition-all duration-300 
                  hover:-translate-y-2 hover:rotate-1 group cursor-pointer
                  bg-[#e8dcc0]
                "
                            style={{
                                // Hand-drawn folder shape
                                borderRadius: '10px 25px 10px 10px',
                                border: '3px solid #1a1918',
                                boxShadow: '8px 8px 0px rgba(0,0,0,0.5)'
                            }}
                        >
                            {/* Folder Tab Visual */}
                            <div className="absolute -top-4 left-0 w-1/3 h-6 bg-[#e8dcc0] border-t-3 border-l-3 border-r-3 border-[#1a1918] rounded-t-lg z-0"
                                style={{ borderTop: '3px solid #1a1918', borderLeft: '3px solid #1a1918', borderRight: '3px solid #1a1918' }}
                            />

                            {/* Card Content */}
                            <div className="relative z-10 flex flex-col h-full items-center justify-center text-center">

                                <FolderOpen className="w-12 h-12 mb-4 text-[#1a1918] opacity-80 group-hover:scale-110 transition-transform" strokeWidth={1.5} />

                                <h3 className="font-sketch text-[#1a1918] text-3xl mb-2 uppercase tracking-tight">
                                    {cat.title}
                                </h3>

                                <p className="font-mono text-sm text-[#1a1918]/70 leading-tight max-w-[80%]">
                                    {cat.description}
                                </p>

                                {/* Action Hint */}
                                <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="font-sketch text-lg border-b-2 border-black">OPEN FILE</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </main>
    );
}
