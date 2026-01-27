'use client';

import React, { useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import type { FormulaFillQuestion as FormulaFillQuestionType } from '@/data/quiz';

interface FormulaFillQuestionProps {
    question: FormulaFillQuestionType;
    onAnswer: (isCorrect: boolean) => void;
}

export const FormulaFillQuestion: React.FC<FormulaFillQuestionProps> = ({ question, onAnswer }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [hasAnswered, setHasAnswered] = useState(false);
    const [results, setResults] = useState<Record<string, boolean>>({});
    const boxRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Draw sketchy box around formula
    useEffect(() => {
        const canvas = canvasRef.current;
        const box = boxRef.current;
        if (!canvas || !box) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = box.offsetWidth;
        const height = box.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const rc = rough.canvas(canvas);

        rc.rectangle(4, 4, width - 8, height - 8, {
            roughness: 2,
            stroke: '#e2d1a6',
            strokeWidth: 2,
            bowing: 1.5,
            fill: 'rgba(30, 30, 30, 0.8)',
            fillStyle: 'solid'
        });
    }, []);

    const handleInputChange = (blankId: string, value: string) => {
        if (hasAnswered) return;
        setAnswers(prev => ({ ...prev, [blankId]: value }));
    };

    const handleSubmit = () => {
        if (hasAnswered) return;

        const newResults: Record<string, boolean> = {};
        let allCorrect = true;

        question.blanks.forEach(blank => {
            const userAnswer = (answers[blank.id] || '').toLowerCase().trim();
            const correctAnswer = blank.answer.toLowerCase().trim();
            const isCorrect = userAnswer === correctAnswer;
            newResults[blank.id] = isCorrect;
            if (!isCorrect) allCorrect = false;
        });

        const audio = new Audio('/music/sound effects/papier froissement.m4a');
        audio.volume = 0.5;
        audio.play().catch(() => { });

        setResults(newResults);
        setHasAnswered(true);
        onAnswer(allCorrect);
    };

    // Parse formula and replace ___ with inputs
    const renderFormula = () => {
        const parts = question.formula.split('___');
        const elements: React.ReactNode[] = [];

        parts.forEach((part, index) => {
            elements.push(
                <span key={`part-${index}`} className="text-2xl md:text-3xl">
                    {part}
                </span>
            );

            if (index < question.blanks.length) {
                const blank = question.blanks[index];
                const isCorrect = results[blank.id];

                elements.push(
                    <input
                        key={`input-${blank.id}`}
                        type="text"
                        value={answers[blank.id] || ''}
                        onChange={(e) => handleInputChange(blank.id, e.target.value)}
                        disabled={hasAnswered}
                        placeholder={blank.hint || '?'}
                        className={`w-16 md:w-20 mx-1 px-2 py-1 text-center text-xl md:text-2xl font-bold border-b-2 bg-transparent outline-none transition-colors ${hasAnswered
                            ? isCorrect
                                ? 'border-green-400 text-green-400'
                                : 'border-red-400 text-red-400'
                            : 'border-[#e2d1a6] text-[#e2d1a6] focus:border-yellow-400'
                            }`}
                    />
                );
            }
        });

        return elements;
    };

    const allFilled = question.blanks.every(blank => answers[blank.id]?.trim());

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Context */}
            {question.context && (
                <p className="text-lg text-[#e2d1a6]/80 mb-6 text-center font-[family-name:var(--font-hand)]">
                    {question.context}
                </p>
            )}

            {/* Formula Box */}
            <div ref={boxRef} className="relative p-8 mb-8">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />
                <div className="relative z-10 flex items-center justify-center flex-wrap gap-1 font-[family-name:var(--font-chalk)] text-[#e2d1a6]">
                    {renderFormula()}
                </div>
            </div>

            {/* Correct answers after submission */}
            {hasAnswered && (
                <div className="mb-6 p-4 border border-[#e2d1a6]/30 rounded-lg bg-[#2a2a2a]/50">
                    <h3 className="text-lg font-bold text-[#e2d1a6] mb-2 font-[family-name:var(--font-chalk)]">
                        ✅ Réponses correctes
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {question.blanks.map(blank => (
                            <span key={blank.id} className="text-green-400 font-bold font-[family-name:var(--font-hand)]">
                                {blank.answer}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Submit Button */}
            {!hasAnswered && (
                <button
                    onClick={handleSubmit}
                    disabled={!allFilled}
                    className={`w-full py-4 rounded-lg font-bold text-xl transition-all duration-200 font-[family-name:var(--font-chalk)] ${!allFilled
                        ? 'bg-[#333] text-[#666] cursor-not-allowed'
                        : 'bg-[#e2d1a6] text-[#1a1a1a] hover:bg-[#d4c396] cursor-pointer'
                        }`}
                >
                    VALIDER
                </button>
            )}
        </div>
    );
};

export default FormulaFillQuestion;
