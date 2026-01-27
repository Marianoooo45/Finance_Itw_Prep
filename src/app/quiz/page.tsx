'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import rough from 'roughjs';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { QUIZ_QUESTIONS, Question } from '@/data/quiz';
import { MCQQuestion, PayoffDrawQuestion, FormulaFillQuestion, ProductBuilderQuestion, SequenceQuestion, SliderQuestion } from '@/components/quiz';
import { REVISION_SHEETS } from '@/data/sheets';
import { X, FileText } from 'lucide-react'; // Import icons for modal

export default function QuizPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

    // Cheat Sheet Modal State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const headerCanvasRef = useRef<HTMLCanvasElement>(null);

    const currentQuestion = QUIZ_QUESTIONS[currentIndex];
    const relatedSheet = currentQuestion.relatedSheetId
        ? REVISION_SHEETS.find(s => s.id === currentQuestion.relatedSheetId)
        : null;
    const totalQuestions = QUIZ_QUESTIONS.length;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    // Draw sketchy header underline
    useEffect(() => {
        const canvas = headerCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = 300 * dpr;
        canvas.height = 20 * dpr;
        ctx.scale(dpr, dpr);

        const rc = rough.canvas(canvas);
        rc.line(0, 10, 300, 10, {
            stroke: '#e2d1a6',
            strokeWidth: 2,
            roughness: 2
        });
        rc.line(10, 15, 280, 17, {
            stroke: '#e2d1a6',
            strokeWidth: 1.5,
            roughness: 2
        });
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (answeredQuestions.has(currentQuestion.id)) return;

        setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));
        if (isCorrect) {
            // Logic for correct answer if needed (e.g. keeping track of correct answers count)
        }
    };

    const goToNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const renderQuestion = (question: Question) => {
        switch (question.type) {
            case 'mcq':
                return <MCQQuestion key={question.id} question={question} onAnswer={handleAnswer} />;
            case 'payoff-draw':
                return <PayoffDrawQuestion key={question.id} question={question} onAnswer={handleAnswer} />;
            case 'formula-fill':
                return <FormulaFillQuestion key={question.id} question={question} onAnswer={handleAnswer} />;
            case 'product-builder':
                return <ProductBuilderQuestion key={question.id} question={question} onAnswer={handleAnswer} />;
            case 'sequence':
                return <SequenceQuestion key={question.id} question={question} onAnswer={handleAnswer} />;
            case 'slider':
                return <SliderQuestion key={question.id} question={question} onAnswer={handleAnswer} />;
            default:
                return null;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400';
            case 'Medium': return 'text-yellow-400';
            case 'Hard': return 'text-red-400';
            default: return 'text-[#e2d1a6]';
        }
    };

    return (
        <main
            className="min-h-screen relative overflow-x-hidden select-none"
            style={{
                background: `
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E"),
                    radial-gradient(ellipse at center top, #2d2b2b 0%, #1f1d1d 40%, #161515 100%)
                `,
                backgroundColor: '#1a1918',
            }}
        >
            {/* Header */}
            <header className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-[#e2d1a6]/70 hover:text-[#e2d1a6] transition-colors"
                >
                    <div className="border border-[#e2d1a6]/50 rounded-full p-2 hover:border-[#e2d1a6]">
                        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                </Link>

                <div className="flex flex-col items-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-[#e2d1a6] tracking-widest font-[family-name:var(--font-chalk)]">
                        QUIZ MODE
                    </h1>

                    <canvas ref={headerCanvasRef} className="w-[300px] h-[20px]" />
                </div>

                {/* Spacer for layout balance */}
                <div className="w-[40px]" />
            </header>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl mx-auto px-4 mb-6">
                <div className="flex justify-between text-sm text-[#e2d1a6]/60 mb-2 font-[family-name:var(--font-hand)]">
                    <span>Question {currentIndex + 1} / {totalQuestions}</span>
                    <span className={getDifficultyColor(currentQuestion.difficulty)}>
                        {currentQuestion.difficulty}
                    </span>
                </div>
                <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#e2d1a6] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Info */}
            <div className="w-full max-w-2xl mx-auto px-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#e2d1a6]/50 font-[family-name:var(--font-hand)]">
                    <span className="px-2 py-1 bg-[#e2d1a6]/10 rounded">{currentQuestion.category}</span>
                    <span>•</span>
                    <span>{currentQuestion.title}</span>
                </div>

                {relatedSheet && (
                    <button
                        onClick={() => setIsSheetOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#e2d1a6] hover:bg-[#d4c39b] text-[#1a1918] font-bold text-sm rounded-lg transition-all hover:scale-105 active:scale-95 font-[family-name:var(--font-chalk)] shadow-md"
                        title="Voir la fiche de révision"
                    >
                        <FileText className="w-4 h-4" />
                        <span>Voir Fiche</span>
                    </button>
                )}
            </div>


            {/* Question Content */}
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                {renderQuestion(currentQuestion)}
            </div>

            {/* Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1a1918] to-transparent">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                    <button
                        onClick={goToPrev}
                        disabled={currentIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-[family-name:var(--font-chalk)] transition-colors ${currentIndex === 0
                            ? 'text-[#666] cursor-not-allowed'
                            : 'text-[#e2d1a6] hover:bg-[#e2d1a6]/10'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Précédent
                    </button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {QUIZ_QUESTIONS.map((q, index) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-[#e2d1a6] scale-125'
                                    : answeredQuestions.has(q.id)
                                        ? 'bg-green-400/50'
                                        : 'bg-[#e2d1a6]/30 hover:bg-[#e2d1a6]/50'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={goToNext}
                        disabled={currentIndex === totalQuestions - 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-[family-name:var(--font-chalk)] transition-colors ${currentIndex === totalQuestions - 1
                            ? 'text-[#666] cursor-not-allowed'
                            : 'text-[#e2d1a6] hover:bg-[#e2d1a6]/10'
                            }`}
                    >
                        Suivant
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Cheat Sheet Modal */}
            {isSheetOpen && relatedSheet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1a1918] rounded-xl overflow-hidden border border-[#e2d1a6]/30 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#e2d1a6]/20 bg-[#1a1918]">
                            <h3 className="text-xl font-bold text-[#e2d1a6] font-[family-name:var(--font-chalk)]">
                                {relatedSheet.title}
                            </h3>
                            <button
                                onClick={() => setIsSheetOpen(false)}
                                className="p-2 text-[#e2d1a6]/50 hover:text-red-400 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-auto max-h-[calc(90vh-80px)] p-4 bg-[#e2d1a6]/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={relatedSheet.imageUrl}
                                alt={relatedSheet.title}
                                className="w-full h-auto rounded shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
