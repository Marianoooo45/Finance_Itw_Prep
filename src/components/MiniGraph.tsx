'use client';

import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface MiniGraphProps {
    width?: number;
    height?: number;
    barColor?: string;
    className?: string;
}

/**
 * MiniGraph - Petit graphique à barres dessiné à la main
 * 
 * Avec axes, barres hachurées et flèche de tendance.
 */
export const MiniGraph: React.FC<MiniGraphProps> = ({
    width = 80,
    height = 60,
    barColor = '#333',
    className = '',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const rc = rough.canvas(canvas);

        const lineStyle = { stroke: barColor, strokeWidth: 2 };
        const barStyle = { fill: barColor, fillStyle: 'zigzag' as const, stroke: 'none' };

        // Axes
        rc.path(`M 5 ${height - 5} L 5 5`, lineStyle);
        rc.path(`M 5 ${height - 5} L ${width - 5} ${height - 5}`, lineStyle);

        // Barres
        const barWidth = (width - 30) / 4;
        rc.rectangle(10, height - 20, barWidth, 15, barStyle);
        rc.rectangle(15 + barWidth, height - 35, barWidth, 30, barStyle);
        rc.rectangle(20 + barWidth * 2, height - 50, barWidth, 45, barStyle);

        // Flèche montante
        rc.path(`M 8 ${height - 10} L ${width - 15} 10`, { ...lineStyle, strokeWidth: 2.5 });
        rc.path(`M ${width - 25} 15 L ${width - 15} 10 L ${width - 20} 20`, lineStyle);

    }, [width, height, barColor]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width, height }}
        />
    );
};

export default MiniGraph;
