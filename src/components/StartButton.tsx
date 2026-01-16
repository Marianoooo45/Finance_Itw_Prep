'use client';

import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface StartButtonProps {
    size?: number;
    fillColor?: string;
    strokeColor?: string;
    className?: string;
    onClick?: () => void;
}

/**
 * StartButton - Bouton rond "START" dessiné à la main
 * 
 * Cercle sketchy avec remplissage solide et texte centré.
 */
export const StartButton: React.FC<StartButtonProps> = ({
    size = 140,
    fillColor = '#e2cfa5',
    strokeColor = '#333',
    className = '',
    onClick,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const rc = rough.canvas(canvas);
        const center = size / 2;
        const radius = (size / 2) - 10;

        rc.circle(center, center, radius * 2, {
            fill: fillColor,
            fillStyle: 'solid',
            stroke: strokeColor,
            strokeWidth: 3,
            roughness: 1.5,
            bowing: 1.2,
        });

    }, [size, fillColor, strokeColor]);

    return (
        <div
            className={`relative cursor-pointer group ${className}`}
            onClick={onClick}
            style={{ width: size, height: size }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ width: size, height: size }}
            />
            <span
                className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800 group-hover:scale-105 transition-transform"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
                START
            </span>
        </div>
    );
};

export default StartButton;
