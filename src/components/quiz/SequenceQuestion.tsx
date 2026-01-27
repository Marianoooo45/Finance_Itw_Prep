'use client';

import React, { useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import { SequenceQuestion as SequenceQuestionType } from '@/data/quiz';
import { GripVertical } from 'lucide-react';

interface SequenceQuestionProps {
    question: SequenceQuestionType;
    onAnswer: (isCorrect: boolean) => void;
}

export const SequenceQuestion: React.FC<SequenceQuestionProps> = ({ question, onAnswer }) => {
    // Initialize with randomized order
    const [currentOrder, setCurrentOrder] = useState<string[]>([]);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Canvas refs for styling
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    useEffect(() => {
        // Shuffle functionality
        const shuffled = [...question.items]
            .map(x => x.id)
            .sort(() => Math.random() - 0.5);
        setCurrentOrder(shuffled);
    }, [question.items]);

    // Draw sketchy boxes
    useEffect(() => {
        canvasRefs.current.forEach((canvas, index) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const dpr = window.devicePixelRatio || 1;
            // Get parent size
            const rect = canvas.getBoundingClientRect();
            // Use CSS dimensions if possible, or fallback
            // We need to re-query dimensions or assume layout stable
            if (rect.width === 0) return;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            const rc = rough.canvas(canvas);

            // Clear previous
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const isCorrectPosition = hasAnswered && currentOrder[index] === question.correctOrder[index];
            const isWrongPosition = hasAnswered && !isCorrectPosition;

            let strokeColor = '#e2d1a6';
            let fillColor = 'transparent';

            if (isCorrectPosition) {
                strokeColor = '#4ade80';
                fillColor = 'rgba(74, 222, 128, 0.1)';
            } else if (isWrongPosition) {
                strokeColor = '#f87171';
                fillColor = 'rgba(248, 113, 113, 0.1)';
            }

            rc.rectangle(2, 2, rect.width - 4, rect.height - 4, {
                roughness: 2.5,
                stroke: strokeColor,
                strokeWidth: 2,
                bowing: 1.5,
                fill: fillColor,
                fillStyle: 'solid'
            });
        });
    }, [currentOrder, hasAnswered, question.correctOrder]);

    const handleMove = (fromIndex: number, direction: 'up' | 'down') => {
        if (hasAnswered) return;

        const newOrder = [...currentOrder];
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

        if (toIndex < 0 || toIndex >= newOrder.length) return;

        [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
        setCurrentOrder(newOrder);

        const audio = new Audio('/music/sound effects/ouvrir fiche.wav');
        audio.volume = 0.3;
        audio.play().catch(() => { });
    };

    const handleSubmit = () => {
        if (hasAnswered) return;

        const isCorrectOrder = JSON.stringify(currentOrder) === JSON.stringify(question.correctOrder);
        setIsCorrect(isCorrectOrder);
        setHasAnswered(true);
        onAnswer(isCorrectOrder);

        const audio = new Audio('/music/sound effects/papier froissement.m4a');
        audio.volume = 0.5;
        audio.play().catch(() => { });
    };

    const getItemById = (id: string) => question.items.find(item => item.id === id);

    return (
        <div className="w-full max-w-xl mx-auto">
            <h2 className="text-xl md:text-2xl text-[#e2d1a6] font-bold mb-8 text-center font-[family-name:var(--font-chalk)]">
                {question.prompt}
            </h2>

            <div className="flex flex-col gap-3 mb-8">
                {currentOrder.map((itemId, index) => {
                    const item = getItemById(itemId);
                    if (!item) return null;

                    return (
                        <div key={itemId} className="relative group min-h-[60px] flex items-center">
                            <canvas
                                ref={el => { canvasRefs.current[index] = el; }}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                            />

                            <div className="relative z-10 w-full flex items-center p-3 sm:p-4 gap-4">
                                {/* Number */}
                                <span className="font-[family-name:var(--font-chalk)] text-[#e2d1a6]/50 text-xl font-bold w-6">
                                    {index + 1}.
                                </span>

                                {/* Content */}
                                <span className="flex-1 font-[family-name:var(--font-hand)] text-[#e2d1a6] text-lg select-none">
                                    {item.label}
                                </span>

                                {/* Controls */}
                                {!hasAnswered && (
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleMove(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:bg-[#e2d1a6]/10 rounded disabled:opacity-30"
                                        >
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#e2d1a6]" />
                                        </button>
                                        <button
                                            onClick={() => handleMove(index, 'down')}
                                            disabled={index === currentOrder.length - 1}
                                            className="p-1 hover:bg-[#e2d1a6]/10 rounded disabled:opacity-30"
                                        >
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#e2d1a6]" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Validation Message */}
            {hasAnswered && (
                <div className={`mb-6 p-4 rounded-lg text-center font-[family-name:var(--font-hand)] ${isCorrect ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'
                    }`}>
                    {isCorrect
                        ? 'Ordre correct ! Bien joué.'
                        : 'Ordre incorrect.'}
                </div>
            )}

            {/* Submit Button */}
            {!hasAnswered && (
                <button
                    onClick={handleSubmit}
                    className="w-full py-4 rounded-lg font-bold text-xl transition-all duration-200 font-[family-name:var(--font-chalk)] bg-[#e2d1a6] text-[#1a1a1a] hover:bg-[#d4c396] cursor-pointer"
                >
                    VALIDER L'ORDRE
                </button>
            )}
        </div>
    );
};
