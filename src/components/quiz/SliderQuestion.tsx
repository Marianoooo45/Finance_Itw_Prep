'use client';

import React, { useState, useRef, useEffect } from 'react';
import rough from 'roughjs';
import type { SliderQuestion as SliderQuestionType } from '@/data/quiz';
import { ArrowLeftRight } from 'lucide-react';

interface SliderQuestionProps {
    question: SliderQuestionType;
    onAnswer: (isCorrect: boolean) => void;
}

export const SliderQuestion: React.FC<SliderQuestionProps> = ({ question, onAnswer }) => {
    const [value, setValue] = useState(0); // Start at minimum
    const [hasAnswered, setHasAnswered] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Calculate Epsilon for display (0.1% to 5.0%)
    // Value 0 -> 0.1
    // Value 100 -> 5.0
    const epsilonValue = (0.1 + (value / 100) * 4.9).toFixed(1);

    // Draw Visualizer
    useEffect(() => {
        const canvas = canvasRef.current;
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
        ctx.clearRect(0, 0, width, height);

        // Grid (Sketchy)
        rc.line(40, 20, 40, height - 20, { stroke: '#e2d1a6', strokeWidth: 1, roughness: 1 }); // Y-axis
        rc.line(20, height - 40, width - 20, height - 40, { stroke: '#e2d1a6', strokeWidth: 1, roughness: 1 }); // X-axis

        // Drawing parameters
        const barrierX = width * 0.4;
        const spreadFactor = (value / 100);
        const epsilonWidth = spreadFactor * (width * 0.4);

        // PDI Logic:
        // We replicate the "Activation" at barrier B.
        // Option is "Digital P" -> Pays if S < B.
        // Visual: High on left, Low on right. Drop around B.
        const yBase = height - 40;
        const yMax = height * 0.3;

        const startX = 40;
        const endX = width - 20;

        // Epsilon Width Logic
        // Value 0 (Sharp): Small epsilon width (min 2px)
        // Value 100 (Smooth): Large epsilon width
        const ePixels = (value / 100) * 80 + 2;

        // Coords
        const xDropStart = barrierX;
        const xDropEnd = barrierX + ePixels;

        // Determine Color
        // Neutral while dragging/not answered.
        // Green/Red only after answer.
        let curveColor = '#e2d1a6'; // Default neutral
        if (hasAnswered) {
            const [min, max] = question.correctRange;
            if (value >= min && value <= max) {
                curveColor = '#4ade80'; // Correct
            } else if (value < min) {
                curveColor = '#ef4444'; // Too sharp
            } else {
                curveColor = '#f87171'; // Too soft
            }
        }

        rc.path(`M ${startX} ${yMax} L ${xDropStart} ${yMax} L ${xDropEnd} ${yBase} L ${endX} ${yBase}`, {
            stroke: curveColor,
            strokeWidth: 3,
            roughness: 1.5
        });

        // Barrier Line
        rc.line(barrierX, yMax, barrierX, yBase, {
            stroke: '#e2d1a6', strokeWidth: 1, roughness: 0,
            strokeLineDash: [5, 5]
        });

        // Labels
        ctx.font = '12px Courier New';
        ctx.fillStyle = '#e2d1a6';
        ctx.fillText('B', barrierX - 10, yBase + 20);

        // Epsilon Label (Show if spread is visible)
        if (value > 10) {
            ctx.fillStyle = hasAnswered ? curveColor : '#e2d1a6';
            ctx.fillText(`ε=${epsilonValue}%`, barrierX + ePixels / 2 - 15, yBase + 35);
        }

    }, [value, hasAnswered, question.correctRange, epsilonValue]);

    const submitAnswer = () => {
        setHasAnswered(true);
        const [min, max] = question.correctRange;
        const isCorrect = value >= min && value <= max;
        onAnswer(isCorrect);
    };

    const handleRetry = () => {
        setHasAnswered(false);
        // Do not reset value, let them adjust from current position
    };

    const getFeedback = () => {
        const [min, max] = question.correctRange;
        if (value < min) return question.feedback.low;
        if (value > max) return question.feedback.high;
        return question.feedback.correct;
    };

    const feedbackData = hasAnswered ? getFeedback() : null;
    const isSuccess = hasAnswered && value >= question.correctRange[0] && value <= question.correctRange[1];

    return (
        <div className="w-full max-w-2xl mx-auto select-none">
            {/* Prompt */}
            <h2 className="text-xl md:text-2xl text-[#e2d1a6] font-bold mb-6 text-center font-[family-name:var(--font-chalk)]">
                {question.prompt}
            </h2>

            {/* Visualizer */}
            <div className="relative h-64 w-full mb-8 bg-[#1a1918] rounded-lg border border-[#e2d1a6]/30 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute top-2 left-4 text-xs text-[#e2d1a6]/50">Payoff Réplication</div>
                <div className="absolute top-2 right-4 text-xl font-bold font-[family-name:var(--font-chalk)] text-[#e2d1a6]">
                    ε = {epsilonValue}%
                </div>
            </div>

            {/* Controls */}
            <div className="mb-8 px-4">
                <div className="flex justify-between text-[#e2d1a6]/70 text-sm mb-2 font-[family-name:var(--font-hand)]">
                    <span>{question.minLabel}</span>
                    <span>{question.maxLabel}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    disabled={hasAnswered && isSuccess} // Lock only if correct? No, "autant de fois qu'il veut" -> Never lock?
                    // User said: "peut essayer autant qu'il veut jusqu'a trouver le bon sweet spot". 
                    // Usually this means retry implies finding the success. Once success, maybe stop?
                    // Let's not lock it at all, or only lock if success?
                    // Let's leave it enabled to allow playing even after success, but usually we move to next question.
                    // Let's disable only if success to "Validate" the win.
                    // Actually, if we disable on success, they can't play anymore.
                    // Let's NEVER disable inputs here to allow full exploration.
                    className={`w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#e2d1a6] hover:accent-[#d4c396] ${hasAnswered ? 'opacity-50' : ''}`}
                />
            </div>

            {/* Feedback */}
            {hasAnswered && feedbackData && (
                <div className={`mb-6 p-4 border-2 rounded-lg animate-in fade-in slide-in-from-bottom-2 ${isSuccess
                    ? 'border-green-400 bg-green-900/10'
                    : 'border-red-400 bg-red-900/10'
                    }`}>
                    <h3 className={`font-bold text-lg mb-1 font-[family-name:var(--font-chalk)] ${isSuccess
                        ? 'text-green-400'
                        : 'text-red-400'
                        }`}>
                        {feedbackData.title}
                    </h3>
                    <p className="text-[#e2d1a6]/90 font-[family-name:var(--font-hand)]">
                        {feedbackData.text}
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                {!hasAnswered ? (
                    <button
                        onClick={submitAnswer}
                        className="w-full py-4 rounded-lg font-bold text-xl bg-[#e2d1a6] text-[#1a1a1a] hover:bg-[#d4c396] transition-all duration-200 font-[family-name:var(--font-chalk)] shadow-lg hover:shadow-xl hover:scale-[1.01]"
                    >
                        VALIDER LA CALIBRATION
                    </button>
                ) : (
                    <button
                        onClick={handleRetry}
                        className={`w-full py-4 rounded-lg font-bold text-xl transition-all duration-200 font-[family-name:var(--font-chalk)] shadow-lg ${isSuccess
                            ? 'bg-green-500 text-black hover:bg-green-400'
                            : 'bg-[#e2d1a6] text-[#1a1a1a] hover:bg-[#d4c396]'
                            }`}
                    >
                        {isSuccess ? 'SUCCÈS ! (Rejouer ?)' : 'RÉESSAYER'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SliderQuestion;
