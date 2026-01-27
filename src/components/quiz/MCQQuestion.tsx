'use client';

import React, { useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import type { MCQQuestion as MCQQuestionType } from '@/data/quiz';

interface MCQQuestionProps {
    question: MCQQuestionType;
    onAnswer: (isCorrect: boolean) => void;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({ question, onAnswer }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    // Draw sketchy boxes around options
    useEffect(() => {
        canvasRefs.current.forEach((canvas, index) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const dpr = window.devicePixelRatio || 1;
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            const rc = rough.canvas(canvas);

            let strokeColor = '#e2d1a6';
            let fillColor = 'transparent';

            if (hasAnswered) {
                if (index === question.correctIndex) {
                    strokeColor = '#4ade80';
                    fillColor = 'rgba(74, 222, 128, 0.1)';
                } else if (index === selectedIndex) {
                    strokeColor = '#f87171';
                    fillColor = 'rgba(248, 113, 113, 0.1)';
                }
            } else if (index === selectedIndex) {
                strokeColor = '#fbbf24';
                fillColor = 'rgba(251, 191, 36, 0.1)';
            }

            rc.rectangle(4, 4, width - 8, height - 8, {
                roughness: 2,
                stroke: strokeColor,
                strokeWidth: 2,
                bowing: 1.5,
                fill: fillColor,
                fillStyle: 'solid'
            });
        });
    }, [selectedIndex, hasAnswered, question.correctIndex]);

    const playSound = (path: string) => {
        const audio = new Audio(path);
        audio.volume = 0.5;
        audio.play().catch(() => { });
    };

    const handleSelect = (index: number) => {
        if (hasAnswered) return;
        setSelectedIndex(index);
        playSound('/music/sound effects/ouvrir fiche.wav');
    };

    const handleSubmit = () => {
        if (selectedIndex === null || hasAnswered) return;
        playSound('/music/sound effects/papier froissement.m4a');
        setHasAnswered(true);
        const isCorrect = selectedIndex === question.correctIndex;
        onAnswer(isCorrect);
        if (question.explanation) {
            setShowExplanation(true);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Question */}
            <h2 className="text-2xl md:text-3xl text-[#e2d1a6] font-bold mb-8 text-center font-[family-name:var(--font-chalk)]">
                {question.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-4 mb-8">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(index)}
                        disabled={hasAnswered}
                        className={`relative p-4 text-left transition-all duration-200 ${hasAnswered ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'
                            }`}
                    >
                        <canvas
                            ref={(el) => { canvasRefs.current[index] = el; }}
                            className="absolute inset-0 w-full h-full pointer-events-none"
                        />
                        <div className="relative z-10 flex items-center gap-4">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold text-sm ${hasAnswered && index === question.correctIndex
                                ? 'border-green-400 text-green-400'
                                : hasAnswered && index === selectedIndex
                                    ? 'border-red-400 text-red-400'
                                    : index === selectedIndex
                                        ? 'border-yellow-400 text-yellow-400'
                                        : 'border-[#e2d1a6]/50 text-[#e2d1a6]/70'
                                }`}>
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className={`text-lg font-[family-name:var(--font-hand)] ${hasAnswered && index === question.correctIndex
                                ? 'text-green-400'
                                : hasAnswered && index === selectedIndex
                                    ? 'text-red-400'
                                    : 'text-[#e2d1a6]'
                                }`}>
                                {option}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Submit Button */}
            {!hasAnswered && (
                <button
                    onClick={handleSubmit}
                    disabled={selectedIndex === null}
                    className={`w-full py-4 rounded-lg font-bold text-xl transition-all duration-200 font-[family-name:var(--font-chalk)] ${selectedIndex === null
                        ? 'bg-[#333] text-[#666] cursor-not-allowed'
                        : 'bg-[#e2d1a6] text-[#1a1a1a] hover:bg-[#d4c396] cursor-pointer'
                        }`}
                >
                    VALIDER
                </button>
            )}

            {/* Explanation */}
            {showExplanation && question.explanation && (
                <div className="mt-6 p-4 border-2 border-[#e2d1a6]/30 rounded-lg bg-[#2a2a2a]/50">
                    <h3 className="text-lg font-bold text-[#e2d1a6] mb-2 font-[family-name:var(--font-chalk)]">
                        💡 Explication
                    </h3>
                    <p className="text-[#e2d1a6]/80 font-[family-name:var(--font-hand)]">
                        {question.explanation}
                    </p>
                    {question.explanationImage && (
                        <div className="mt-4 border border-[#e2d1a6]/20 rounded overflow-hidden">
                            <img
                                src={question.explanationImage}
                                alt="Schéma explicatif"
                                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MCQQuestion;
