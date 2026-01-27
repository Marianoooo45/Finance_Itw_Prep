'use client';

import React, { useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import type { PayoffDrawQuestion as PayoffDrawQuestionType } from '@/data/quiz';

interface PayoffDrawQuestionProps {
    question: PayoffDrawQuestionType;
    onAnswer: (isCorrect: boolean) => void;
}

export const PayoffDrawQuestion: React.FC<PayoffDrawQuestionProps> = ({ question, onAnswer }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [showReference, setShowReference] = useState(false);

    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 300;
    const PADDING = 40;
    const GRID_SIZE = 20;

    // Draw the grid and axes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = CANVAS_WIDTH * dpr;
        canvas.height = CANVAS_HEIGHT * dpr;
        ctx.scale(dpr, dpr);

        const rc = rough.canvas(canvas);

        // Background
        ctx.fillStyle = '#1f1f1f';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Grid lines
        ctx.strokeStyle = 'rgba(226, 209, 166, 0.1)';
        ctx.lineWidth = 1;
        for (let x = PADDING; x < CANVAS_WIDTH - PADDING; x += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, PADDING);
            ctx.lineTo(x, CANVAS_HEIGHT - PADDING);
            ctx.stroke();
        }
        for (let y = PADDING; y < CANVAS_HEIGHT - PADDING; y += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(PADDING, y);
            ctx.lineTo(CANVAS_WIDTH - PADDING, y);
            ctx.stroke();
        }

        // Axes with rough.js
        rc.line(PADDING, CANVAS_HEIGHT - PADDING, CANVAS_WIDTH - PADDING, CANVAS_HEIGHT - PADDING, {
            stroke: '#e2d1a6',
            strokeWidth: 2,
            roughness: 1
        });
        rc.line(PADDING, CANVAS_HEIGHT - PADDING, PADDING, PADDING, {
            stroke: '#e2d1a6',
            strokeWidth: 2,
            roughness: 1
        });

        // Labels
        ctx.fillStyle = '#e2d1a6';
        ctx.font = '14px "Cabin Sketch"';
        ctx.fillText('S (Prix)', CANVAS_WIDTH - PADDING - 40, CANVAS_HEIGHT - PADDING + 25);
        ctx.fillText('Payoff', PADDING - 5, PADDING - 10);

        // Strike line if provided
        if (question.strike) {
            const strikeX = PADDING + (question.strike / 150) * (CANVAS_WIDTH - 2 * PADDING);
            rc.line(strikeX, PADDING, strikeX, CANVAS_HEIGHT - PADDING, {
                stroke: '#fbbf24',
                strokeWidth: 1,
                roughness: 0.5
            });
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(`K=${question.strike}`, strikeX - 15, CANVAS_HEIGHT - PADDING + 15);
        }

        // Barrier line if provided
        if (question.barrier) {
            const barrierX = PADDING + (question.barrier / 150) * (CANVAS_WIDTH - 2 * PADDING);
            rc.line(barrierX, PADDING, barrierX, CANVAS_HEIGHT - PADDING, {
                stroke: '#f87171',
                strokeWidth: 1,
                roughness: 0.5
            });
            ctx.fillStyle = '#f87171';
            ctx.fillText(`B=${question.barrier}`, barrierX - 15, CANVAS_HEIGHT - PADDING + 15);
        }

        // Draw user's line
        if (points.length > 1) {
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }

        // Draw reference payoff if showing
        if (showReference && question.referencePoints.length > 1) {
            const scaleX = (CANVAS_WIDTH - 2 * PADDING) / 150;
            const scaleY = (CANVAS_HEIGHT - 2 * PADDING) / 100;

            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();

            const startX = PADDING + question.referencePoints[0].x * scaleX;
            const startY = CANVAS_HEIGHT - PADDING - question.referencePoints[0].y * scaleY;
            ctx.moveTo(startX, startY);

            for (let i = 1; i < question.referencePoints.length; i++) {
                const x = PADDING + question.referencePoints[i].x * scaleX;
                const y = CANVAS_HEIGHT - PADDING - question.referencePoints[i].y * scaleY;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

    }, [points, showReference, question.strike, question.barrier, question.referencePoints]);

    const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (CANVAS_WIDTH / rect.width),
            y: (clientY - rect.top) * (CANVAS_HEIGHT / rect.height)
        };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (hasAnswered) return;
        setIsDrawing(true);
        const coords = getCanvasCoords(e);
        setPoints([coords]);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || hasAnswered) return;
        const coords = getCanvasCoords(e);
        setPoints(prev => [...prev, coords]);
    };

    const handleEnd = () => {
        setIsDrawing(false);
    };

    const handleClear = () => {
        if (hasAnswered) return;
        setPoints([]);
    };

    const handleSubmit = () => {
        if (points.length < 5 || hasAnswered) return;
        const audio = new Audio('/music/sound effects/papier froissement.m4a');
        audio.volume = 0.5;
        audio.play().catch(() => { });
        setHasAnswered(true);
        setShowReference(true);
        // Simple validation: check if user drew something reasonable
        const isCorrect = points.length > 10;
        onAnswer(isCorrect);
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Prompt */}
            <h2 className="text-xl md:text-2xl text-[#e2d1a6] font-bold mb-6 text-center font-[family-name:var(--font-chalk)]">
                {question.prompt}
            </h2>

            {/* Canvas */}
            <div className="relative border-2 border-[#e2d1a6]/30 rounded-lg overflow-hidden mb-4">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="w-full cursor-crosshair touch-none"
                    style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                />
            </div>

            {/* Legend */}
            {showReference && (
                <div className="flex gap-6 justify-center mb-4 text-sm font-[family-name:var(--font-hand)]">
                    <span className="flex items-center gap-2">
                        <span className="w-6 h-1 bg-green-400 inline-block"></span>
                        <span className="text-green-400">Ton dessin</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-6 h-1 bg-blue-400 inline-block border-dashed border-t-2 border-blue-400"></span>
                        <span className="text-blue-400">Référence</span>
                    </span>
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
                {!hasAnswered && (
                    <>
                        <button
                            onClick={handleClear}
                            className="flex-1 py-3 rounded-lg font-bold text-lg bg-[#333] text-[#e2d1a6] hover:bg-[#444] transition-colors font-[family-name:var(--font-chalk)]"
                        >
                            EFFACER
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={points.length < 5}
                            className={`flex-1 py-3 rounded-lg font-bold text-lg transition-colors font-[family-name:var(--font-chalk)] ${points.length < 5
                                ? 'bg-[#333] text-[#666] cursor-not-allowed'
                                : 'bg-[#e2d1a6] text-[#1a1a1a] hover:bg-[#d4c396]'
                                }`}
                        >
                            VALIDER
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PayoffDrawQuestion;
