'use client';

import React, { useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import type { ProductBuilderQuestion as ProductBuilderQuestionType, ProductBrick } from '@/data/quiz';

interface ProductBuilderQuestionProps {
    question: ProductBuilderQuestionType;
    onAnswer: (isCorrect: boolean) => void;
}

export const ProductBuilderQuestion: React.FC<ProductBuilderQuestionProps> = ({ question, onAnswer }) => {
    const [selectedBricks, setSelectedBricks] = useState<string[]>([]);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Draw sketchy drop zone
    useEffect(() => {
        const canvas = canvasRef.current;
        const zone = dropZoneRef.current;
        if (!canvas || !zone) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = zone.offsetWidth;
        const height = zone.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const rc = rough.canvas(canvas);

        rc.rectangle(4, 4, width - 8, height - 8, {
            roughness: 2,
            stroke: hasAnswered
                ? isCorrect ? '#4ade80' : '#f87171'
                : '#e2d1a6',
            strokeWidth: 2,
            bowing: 1.5,
            fill: 'rgba(30, 30, 30, 0.5)',
            fillStyle: 'solid'
        });
    }, [hasAnswered, isCorrect]);

    const handleBrickClick = (brickId: string) => {
        if (hasAnswered) return;

        const audio = new Audio('/music/sound effects/ouvrir fiche.wav');
        audio.volume = 0.5;
        audio.play().catch(() => { });

        if (selectedBricks.includes(brickId)) {
            setSelectedBricks(prev => prev.filter(id => id !== brickId));
        } else {
            setSelectedBricks(prev => [...prev, brickId]);
        }
    };

    const handleSubmit = () => {
        if (hasAnswered || selectedBricks.length === 0) return;

        // Check if selected bricks match correct combination (order doesn't matter)
        const sortedSelected = [...selectedBricks].sort();
        const sortedCorrect = [...question.correctCombination].sort();
        const correct = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);

        const audio = new Audio('/music/sound effects/papier froissement.m4a');
        audio.volume = 0.5;
        audio.play().catch(() => { });

        setIsCorrect(correct);
        setHasAnswered(true);
        onAnswer(correct);
    };

    const getBrickById = (id: string): ProductBrick | undefined => {
        return question.availableBricks.find(b => b.id === id);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Prompt */}
            <h2 className="text-xl md:text-2xl text-[#e2d1a6] font-bold mb-6 text-center font-[family-name:var(--font-chalk)]">
                {question.prompt}
            </h2>

            {/* Available Bricks */}
            <div className="mb-6">
                <h3 className="text-sm text-[#e2d1a6]/60 uppercase tracking-wider mb-3 font-[family-name:var(--font-chalk)]">
                    Briques disponibles
                </h3>
                <div className="flex flex-wrap gap-3">
                    {question.availableBricks.map(brick => {
                        const isSelected = selectedBricks.includes(brick.id);
                        const isCorrectBrick = hasAnswered && question.correctCombination.includes(brick.id);

                        return (
                            <button
                                key={brick.id}
                                onClick={() => handleBrickClick(brick.id)}
                                disabled={hasAnswered}
                                className={`px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 border-2 font-[family-name:var(--font-hand)] ${hasAnswered
                                    ? isCorrectBrick
                                        ? 'border-green-400 bg-green-400/20 text-green-400'
                                        : isSelected
                                            ? 'border-red-400 bg-red-400/20 text-red-400'
                                            : 'border-[#333] text-[#666] opacity-50'
                                    : isSelected
                                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400 scale-105'
                                        : 'border-[#e2d1a6]/50 text-[#e2d1a6] hover:border-[#e2d1a6] hover:scale-105'
                                    }`}
                                style={{
                                    boxShadow: isSelected && !hasAnswered ? `0 0 20px ${brick.color}40` : 'none'
                                }}
                            >
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${brick.type === 'long' ? 'bg-green-400' : 'bg-red-400'
                                    }`}></span>
                                {brick.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Drop Zone */}
            <div ref={dropZoneRef} className="relative p-6 mb-6 min-h-[120px]">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />
                <div className="relative z-10">
                    <h3 className="text-sm text-[#e2d1a6]/60 uppercase tracking-wider mb-3 font-[family-name:var(--font-chalk)]">
                        Ta construction
                    </h3>
                    {selectedBricks.length === 0 ? (
                        <p className="text-[#e2d1a6]/40 italic font-[family-name:var(--font-hand)]">
                            Clique sur les briques pour construire...
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {selectedBricks.map((brickId, index) => {
                                const brick = getBrickById(brickId);
                                if (!brick) return null;
                                return (
                                    <span
                                        key={`${brickId}-${index}`}
                                        className="px-3 py-2 rounded bg-[#e2d1a6]/20 text-[#e2d1a6] font-bold text-sm font-[family-name:var(--font-hand)]"
                                    >
                                        {brick.label}
                                        {index < selectedBricks.length - 1 && (
                                            <span className="ml-2 text-[#e2d1a6]/50">+</span>
                                        )}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Hint */}
            {question.hint && !hasAnswered && (
                <p className="text-sm text-[#e2d1a6]/50 italic mb-4 text-center font-[family-name:var(--font-hand)]">
                    💡 {question.hint}
                </p>
            )}

            {/* Result Message */}
            {hasAnswered && (
                <div className={`mb-4 p-4 rounded-lg border-2 ${isCorrect
                    ? 'border-green-400 bg-green-900/10'
                    : 'border-red-400 bg-red-900/10'
                    }`}>
                    <p className={`text-lg font-bold font-[family-name:var(--font-chalk)] ${isCorrect ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {isCorrect ? '✅ Correct !' : '❌ Pas tout à fait...'}
                    </p>
                    {!isCorrect && (
                        <p className="text-[#e2d1a6]/70 mt-2 font-[family-name:var(--font-hand)]">
                            La bonne combinaison était : {question.correctCombination.map(id => getBrickById(id)?.label).join(' + ')}
                        </p>
                    )}
                    {question.explanationImage && (
                        <div className="mt-4 border border-[#e2d1a6]/20 rounded overflow-hidden">
                            <img
                                src={question.explanationImage}
                                alt="Explication visuelle"
                                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Submit Button */}
            {!hasAnswered && (
                <button
                    onClick={handleSubmit}
                    disabled={selectedBricks.length === 0}
                    className={`w-full py-4 rounded-lg font-bold text-xl transition-all duration-200 font-[family-name:var(--font-chalk)] ${selectedBricks.length === 0
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

export default ProductBuilderQuestion;
