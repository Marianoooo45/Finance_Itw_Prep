'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import rough from 'roughjs';

// --- CONSTANTS & CONFIG ---
const COLORS = {
    blackboard: '#1e1e1e',
    paper: '#fcfcf7',
    tape: 'rgba(235, 225, 190, 0.9)',
    tapeStroke: '#d6cba0',
    ink: '#2d2d2d',
    hatching: '#333333',
};

// --- ROUGHJS COMPONENTS ---

// 1. DYNAMIC GAUGE (Jauge Rayée)
// 1. DYNAMIC GAUGE (Jauge Rayée - Arch Style)
const RoughGauge = ({
    value,
    min = 0,
    max = 6,
    title,
    subtitle,
    label
}: {
    value: number,
    min?: number,
    max?: number,
    title: string,
    subtitle?: string,
    label?: string
}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const svg = svgRef.current;
        const rc = rough.svg(svg);

        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        const width = 160;
        const height = 100;
        const cx = 80;
        const cy = 80;
        const rOuter = 65;
        const rInner = 40;

        // 1. Full Track Outline (Semi-circle Top Arch: PI to 2PI)
        const trackPath = `
            M ${cx - rInner} ${cy}
            L ${cx - rOuter} ${cy}
            A ${rOuter} ${rOuter} 0 1 1 ${cx + rOuter} ${cy}
            L ${cx + rInner} ${cy}
            A ${rInner} ${rInner} 0 0 0 ${cx - rInner} ${cy}
            Z
        `;

        svg.appendChild(rc.path(trackPath, {
            stroke: COLORS.ink, strokeWidth: 1.5, roughness: 0.5,
            fill: 'rgba(0,0,0,0.02)', fillStyle: 'solid'
        }));

        // 2. Filled Section (Yellow)
        // Range: PI(Left) -> 2PI(Right)
        const pct = Math.max(0, Math.min((value - min) / (max - min), 1));
        const valAngle = Math.PI + (pct * Math.PI);

        const getP = (r: number, a: number) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });

        const pOuterStart = getP(rOuter, Math.PI);
        const pOuterEnd = getP(rOuter, valAngle);
        const pInnerEnd = getP(rInner, valAngle);
        const pInnerStart = getP(rInner, Math.PI);

        const largeArc = 0; // Since percentages < 100% (within 180 deg)

        const fillPath = `
            M ${pOuterStart.x} ${pOuterStart.y}
            A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${pOuterEnd.x} ${pOuterEnd.y}
            L ${pInnerEnd.x} ${pInnerEnd.y}
            A ${rInner} ${rInner} 0 ${largeArc} 0 ${pInnerStart.x} ${pInnerStart.y}
            Z
        `;

        svg.appendChild(rc.path(fillPath, {
            fill: '#eac100', // Yellow/Gold
            fillStyle: 'zigzag',
            hachureGap: 3,
            hachureAngle: -20,
            stroke: '#bfa000',
            strokeWidth: 1,
            roughness: 1.5
        }));

        // 3. Needle
        const tip = getP(rOuter - 2, valAngle);
        const baseAng1 = valAngle + Math.PI / 2;
        const baseAng2 = valAngle - Math.PI / 2;
        const baseR = 6;
        const b1 = getP(baseR, baseAng1);
        const b2 = getP(baseR, baseAng2);

        svg.appendChild(rc.path(`M ${tip.x} ${tip.y} L ${b1.x} ${b1.y} L ${b2.x} ${b2.y} Z`, {
            fill: COLORS.ink, fillStyle: 'solid', roughness: 0.5, stroke: 'none'
        }));

        // Pivot
        svg.appendChild(rc.circle(cx, cy, 6, { fill: COLORS.ink, fillStyle: 'solid', stroke: 'none' }));

    }, [value, max, min]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 flex flex-col items-center justify-center">

                {/* Tape */}
                <RoughTape className="-top-2 left-1/2 -translate-x-1/2 w-16 opacity-90 z-20" rotate={-2} />

                {/* Paper Circle */}
                <div className="absolute inset-0 bg-[#fbfaf6] rounded-full shadow-md z-0 border border-gray-200 transform rotate-1" style={{
                    boxShadow: '2px 4px 8px rgba(0,0,0,0.3)',
                    clipPath: 'circle(49% at 50% 50%)'
                }}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center h-full w-full pt-8 pb-4">
                    <div className="font-bold text-lg font-sans leading-tight text-center px-4 text-[#2d2d2d]">{title}</div>

                    {/* Gauge */}
                    <div className="relative flex-1 w-full flex items-center justify-center -my-2">
                        <svg ref={svgRef} width="160" height="90" className="overflow-visible" style={{ transform: 'translateY(10px)' }} />
                    </div>

                    <div className="text-2xl font-bold font-mono text-[#2d2d2d] tracking-tighter -mt-2">{label || `${value.toFixed(2)}%`}</div>

                    {subtitle && <div className="text-xs text-[#555] font-bold uppercase tracking-wide mt-1 pb-2 font-sans">{subtitle}</div>}
                </div>
            </div>
        </div>
    );
};

// 2. ROUGH TAPE
const RoughTape = ({ className = "", rotate = 0 }: { className?: string, rotate?: number }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const rc = rough.svg(svgRef.current);
        const svg = svgRef.current;
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        // Simple tape rect
        svg.appendChild(rc.rectangle(2, 2, 96, 26, {
            fill: COLORS.tape,
            fillStyle: 'solid',
            stroke: COLORS.tapeStroke,
            strokeWidth: 0.5,
            roughness: 2,
            bowing: 2,
        }));
    }, []);

    return (
        <div className={`absolute w-24 h-8 flex justify-center items-center pointer-events-none z-50 ${className}`}
            style={{ transform: `rotate(${rotate}deg)` }}>
            <svg ref={svgRef} width="100" height="30" className="overflow-visible opacity-90" />
        </div>
    );
};

// 3. ROUGH PAPER (Note)
const RoughPaper = ({
    children,
    className = "",
    title,
    rotate = 0,
    bgColor = COLORS.paper
}: {
    children: React.ReactNode,
    className?: string,
    title?: string,
    rotate?: number,
    bgColor?: string
}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        const rc = rough.svg(svgRef.current);
        const svg = svgRef.current;
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        // We can't easily auto-size the svg to content height in roughjs without resize observer.
        // For strict visual compliance without complex layout logic, we'll draw a border rect *around* the size.
        // Or simpler: Just render the border on a 100% 100% svg.
        const w = svg.clientWidth;
        const h = svg.clientHeight;

        svg.appendChild(rc.rectangle(2, 2, w - 4, h - 4, {
            stroke: 'rgba(0,0,0,0.15)',
            strokeWidth: 1,
            roughness: 3,
            bowing: 1, // Subtle wavy edge
            fill: bgColor,
            fillStyle: 'solid'
        }));
    }, [bgColor]); // Re-render if color changes

    return (
        <div className={`relative p-1 ${className}`} style={{ transform: `rotate(${rotate}deg)`, transition: 'transform 0.3s' }}>
            {/* Background SVG Layer */}
            <div className="absolute inset-0 z-0 shadow-xl">
                <svg ref={svgRef} className="w-full h-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-5 h-full flex flex-col">
                <RoughTape className="-top-3 left-1/2 -translate-x-1/2" rotate={Math.random() * 4 - 2} />

                {title && (
                    <div className="border-b-2 border-transparent mb-3 pb-1">
                        <h3 className="text-center font-bold text-xl uppercase tracking-wider text-black/90" style={{ fontFamily: '"Patrick Hand", cursive' }}>{title}</h3>
                    </div>
                )}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

// 4. DYNAMIC YIELD CURVE & COMPARATOR
const DynamicYieldCurve = ({ points }: { points: any }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !points) return;
        const rc = rough.svg(svgRef.current);
        const svg = svgRef.current;
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        const orderedKeys = ['m3', 'y2', 'y5', 'y10', 'y30'];
        const labels = ['3M', '2Y', '5Y', '10Y', '30Y'];

        // Extract values
        const valuesRaw = orderedKeys.map(k => points[k]);
        // Filter valid nums for scaling
        const validNums = valuesRaw.filter(v => typeof v === 'number');
        if (validNums.length === 0) return;

        // Scale
        const minVal = Math.min(...validNums) * 0.95;
        const maxVal = Math.max(...validNums) * 1.05;
        const range = maxVal - minVal || 1;

        const width = 280;
        const height = 150;
        const padding = 25;
        const graphW = width - 2 * padding;
        const graphH = height - 2 * padding;

        const getX = (i: number) => padding + (i / (orderedKeys.length - 1)) * graphW;
        const getY = (v: number) => height - padding - ((v - minVal) / range) * graphH;

        // Axes
        svg.appendChild(rc.line(padding, height - padding, width - padding, height - padding, { stroke: COLORS.ink, strokeWidth: 1 })); // X
        svg.appendChild(rc.line(padding, height - padding, padding, padding / 2, { stroke: COLORS.ink, strokeWidth: 1 }));  // Y

        // Curve Points
        const curvePoints: [number, number][] = valuesRaw.map((v, i) => {
            if (typeof v !== 'number') return [0, 0]; // Should not happen if data valid
            return [getX(i), getY(v)];
        });

        // Safe check
        if (curvePoints.length > 1) {
            svg.appendChild(rc.curve(curvePoints, {
                stroke: '#d35400', strokeWidth: 2.5, roughness: 1
            }));
        }

        // Dots & Labels
        valuesRaw.forEach((v, i) => {
            if (typeof v !== 'number') return;
            const x = getX(i);
            const y = getY(v);
            svg.appendChild(rc.circle(x, y, 6, { fill: COLORS.ink, fillStyle: 'solid', stroke: 'none' }));

            // Text Label
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x.toString());
            text.setAttribute("y", (height - 5).toString());
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("font-size", "10");
            text.setAttribute("font-family", "monospace");
            text.setAttribute("fill", "#333");
            text.textContent = labels[i];
            svg.appendChild(text);

            // Value Label (Small above point)
            const valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            valText.setAttribute("x", x.toString());
            valText.setAttribute("y", (y - 8).toString());
            valText.setAttribute("text-anchor", "middle");
            valText.setAttribute("font-size", "9");
            valText.setAttribute("font-weight", "bold");
            valText.setAttribute("fill", "#d35400");
            valText.textContent = v.toFixed(2);
            svg.appendChild(valText);
        });

    }, [points]);

    return <svg ref={svgRef} viewBox="0 0 280 150" className="w-full h-auto" />;
};

const YieldComparator = ({ points }: { points: any }) => {
    const [a, setA] = useState('y10');
    const [b, setB] = useState('y2');
    const labels: Record<string, string> = { m3: '3M', y2: '2Y', y5: '5Y', y10: '10Y', y30: '30Y' };

    const valA = points?.[a] ?? 0;
    const valB = points?.[b] ?? 0;
    const spreadBps = Math.round((valA - valB) * 100);

    return (
        <div className="mt-2 pt-2 border-t border-dashed border-gray-400">
            <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 text-center">Calculateur de Spread</div>
            <div className="flex justify-between items-center bg-white/50 p-1 rounded px-2">
                <select value={a} onChange={e => setA(e.target.value)} className="bg-transparent font-bold border-b border-black/20 outline-none cursor-pointer text-sm">
                    {Object.entries(labels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
                <div className="flex flex-col items-center mx-2">
                    <span className="text-xs font-bold text-gray-400">VS</span>
                </div>
                <select value={b} onChange={e => setB(e.target.value)} className="bg-transparent font-bold border-b border-black/20 outline-none cursor-pointer text-sm">
                    {Object.entries(labels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
            </div>
            <div className="text-center mt-1">
                <span className={`text-xl font-bold font-mono ${spreadBps < 0 ? 'text-red-600' : 'text-green-700'}`}>
                    {spreadBps > 0 ? '+' : ''}{spreadBps}
                </span> <span className="text-xs text-gray-600">bps</span>
            </div>
        </div>
    );
}


export default function MacroDashboard() {
    const [data, setData] = useState<any>(null);
    const [curveType, setCurveType] = useState<'US' | 'FR'>('US');

    useEffect(() => {
        fetch('/api/macro')
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error("Failed to fetch macro data", err));
    }, []);

    const fmt = (val: number | string | undefined | null, fallback: string) =>
        (val !== undefined && val !== null) ? Number(val).toFixed(2) : fallback;

    const currentCurve = curveType === 'US' ? data?.macro?.yield_curve_us : data?.macro?.yield_curve_fr;

    return (
        <main className="min-h-screen w-full bg-[#1e1e1e] p-4 font-sans text-[#2d2d2d] overflow-x-hidden"
            style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", "Patrick Hand", sans-serif',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%231e1e1e'/%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`
            }}
        >
            {/* Header */}
            <div className="w-full flex justify-center py-6 relative">
                <Link href="/revision-sheets/macroeconomics" className="absolute left-4 top-6 text-[#fcfcf7]/60 hover:text-[#fcfcf7] transition-colors">
                    <ArrowLeft className="w-8 h-8" />
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold text-center tracking-widest text-[#fcfcf7] opacity-90"
                    style={{
                        textShadow: '2px 2px 0px #000',
                        fontFamily: '"Cabin Sketch", cursive'
                    }}>
                    MACRO MARKET SNAPSHOT
                </h1>
            </div>

            {/* Content Grid */}
            <div className="max-w-6xl mx-auto space-y-12">

                {/* ROW 1: GAUGES & YIELD CURVE */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">

                    {/* BCE */}
                    <RoughGauge
                        title="BCE"
                        value={data?.centralBanks?.ecb_deposit ?? 4.00}
                        max={6}
                        label={fmt(data?.centralBanks?.ecb_deposit, '4.00%') + '%'}
                    />

                    {/* FED */}
                    <RoughGauge
                        title="FED Funds"
                        value={data?.centralBanks?.fed_funds ?? 5.50}
                        max={6}
                        label={fmt(data?.centralBanks?.fed_funds, '5.50%') + '%'}
                    />

                    {/* YIELD CURVE */}
                    <div className="w-full max-w-sm mt-4 md:mt-0 transform rotate-1">
                        <RoughPaper bgColor="#e8e0c5" rotate={1}>
                            {/* Custom Header with Toggle */}
                            <div className="flex flex-col items-center mb-4 border-b-2 border-transparent pb-1">
                                <h3 className="font-bold text-xl uppercase tracking-wider text-black/90 mb-2" style={{ fontFamily: '"Patrick Hand", cursive' }}>
                                    YIELD CURVE
                                </h3>
                                <div className="flex items-center gap-3 text-sm font-bold font-mono">
                                    <button
                                        onClick={() => setCurveType('US')}
                                        className={`px-2 py-0.5 rounded transition-all ${curveType === 'US' ? 'bg-blue-800 text-white shadow-md transform -rotate-1' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        US
                                    </button>
                                    <div className="w-px h-4 bg-gray-400/50"></div>
                                    <button
                                        onClick={() => setCurveType('FR')}
                                        className={`px-2 py-0.5 rounded transition-all ${curveType === 'FR' ? 'bg-blue-800 text-white shadow-md transform rotate-1' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        FRANCE
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <DynamicYieldCurve points={currentCurve?.points} />
                                <YieldComparator points={currentCurve?.points} />
                            </div>
                        </RoughPaper>
                    </div>
                </div>

                {/* ROW 2: NOTES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

                    {/* BENCHMARKS */}
                    <RoughPaper title="BENCHMARKS (10Y)" rotate={-1}>
                        <div className="flex flex-col h-full justify-between text-lg font-medium px-2">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-black/5 p-1 px-2 rounded-sm border-b border-black/10">
                                    <span>DE BUND</span>
                                    <span className="font-bold">{fmt(data?.rates?.bund_10y, '2.35')} %</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/5 p-1 px-2 rounded-sm border-b border-black/10">
                                    <span>FR OAT</span>
                                    <span className="font-bold">{fmt(data?.rates?.oat_10y, '2.85')} %</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/5 p-1 px-2 rounded-sm border-b border-black/10">
                                    <span>US T-NOTE</span>
                                    <span className="font-bold">{fmt(data?.rates?.us_10y, '4.10')} %</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/5 p-1 px-2 rounded-sm border-b border-black/10">
                                    <span>CMS 10Y</span>
                                    <span className="font-bold text-blue-800">{fmt(data?.rates?.cms_10y, '2.87')} %</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/5 p-1 px-2 rounded-sm border-b border-black/10">
                                    <span>EUR3M</span>
                                    <span className="font-bold text-blue-800">{fmt(data?.centralBanks?.euribor_3m, '3.92')} %</span>
                                </div>
                            </div>

                            {/* Taped Spread Note */}
                            <div className="mt-6 relative bg-[#eebb99] p-2 shadow-md text-center transform rotate-2 text-sm font-bold border border-black/20">
                                <RoughTape className="-top-3 left-1/2 -translate-x-1/2 w-12 scale-75" rotate={90} />
                                <div className="uppercase">SPREAD OAT-BUND {data?.rates?.spread_oat_bund_bps ?? 50} bps</div>
                                <div className="text-red-800 text-xs mt-1 uppercase">Stress Politique (Paris)</div>
                            </div>
                        </div>
                    </RoughPaper>

                    {/* ECONOMY */}
                    <RoughPaper title="ECONOMY" rotate={1}>
                        <div className="space-y-8 px-2 py-2">
                            {/* EU INFLATION */}
                            <div className="flex justify-between items-end border-b-2 border-dashed border-gray-300 pb-2">
                                <div>
                                    <div className="font-extrabold text-lg">INFLA ZONE EURO</div>
                                    <div className="text-xs text-gray-500 font-bold">TARGET: 2.0%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-black">{fmt(data?.macro?.inflation_eu, '2.0')}%</div>
                                    <div className="text-[10px] uppercase font-bold text-green-600">
                                        {(data?.macro?.inflation_eu ?? 2.0) <= 2.2 ? "Target Reached" : "Above Target"}
                                    </div>
                                </div>
                            </div>

                            {/* FRANCE INFLATION */}
                            <div className="flex justify-between items-end border-b-2 border-dashed border-gray-300 pb-2">
                                <div>
                                    <div className="font-extrabold text-lg">INFLA FRANCE</div>
                                    <div className="text-xs text-gray-500 font-bold">SOURCE: INSEE</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-black">{fmt(data?.macro?.inflation_fr, '1.5')}%</div>
                                    <div className="text-[10px] uppercase font-bold text-blue-600">
                                        GLISSEMENT ANNUEL
                                    </div>
                                </div>
                            </div>

                            {/* FRANCE MACRO (CHOMAGE & PIB) */}
                            <div className="flex justify-between items-end border-b-2 border-dashed border-gray-300 pb-2">
                                <div>
                                    <div className="font-extrabold text-lg">CHOMAGE</div>
                                    <div className="text-xs text-gray-500 font-bold">SOURCE: INSEE</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-black">{fmt(data?.macro?.unemployment_fr, '7.3')}%</div>
                                    <div className="text-[10px] uppercase font-bold text-gray-500">
                                        TAUX
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-1">
                                <div>
                                    <div className="font-extrabold text-lg">CROISSANCE</div>
                                    <div className="text-xs text-gray-500 font-bold">SOURCE: INSEE</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-black">{fmt(data?.macro?.growth_fr, '0.4')}%</div>
                                    <div className="text-[10px] uppercase font-bold text-gray-500">
                                        PIB TRIM.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RoughPaper>

                    {/* SENTIMENT */}
                    <RoughPaper title="SENTIMENT" rotate={-1}>
                        <div className="flex flex-col h-full justify-between text-lg font-medium px-2">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-black/5 p-1 px-2 rounded-sm border-b border-black/10">
                                    <span>FR CAC 40</span>
                                    <span className="font-bold">{fmt(data?.market?.cac40?.value, '7600.00')}</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/5 p-1 px-2 rounded-sm border-b border-black/10">
                                    <span>BRENT</span>
                                    <span className="font-bold">{fmt(data?.market?.brent?.value, '80.00')}</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/5 p-1 px-2 rounded-sm border-b border-black/10">
                                    <span>EUR/USD</span>
                                    <span className="font-bold">{fmt(data?.market?.eurusd?.value, '1.0900')}</span>
                                </div>
                            </div>

                            {/* Euphoria Stamp */}
                            <div className="mt-auto pt-4 relative">
                                <div className="bg-white border-2 border-black p-3 text-center transform -rotate-2 shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-green-100 opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] block text-gray-500 mb-1">Market Vibe</span>
                                    <span className="text-2xl font-black block tracking-tighter text-green-700">EUPHORIA</span>
                                </div>
                                <RoughTape className="-top-3 -left-2 w-12 rotate-45 opacity-80" />
                                <RoughTape className="-top-3 -right-2 w-12 -rotate-45 opacity-80" />
                            </div>
                        </div>
                    </RoughPaper>

                </div>
            </div>
            {/* Footer Timestamp */}
            <div className="fixed bottom-2 right-4 text-[10px] text-[#fcfcf7]/30 font-mono tracking-widest pointer-events-none z-50">
                LAST UPDATE: {data?.timestamp ? new Date(data.timestamp).toLocaleString('fr-FR') : 'LOADING...'}
            </div>
        </main>
    );
}
