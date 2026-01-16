'use client';

import { useEffect, useRef } from 'react';
import rough from 'roughjs';

export default function LayoutDecorations() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const offset = 50; // Marge supplémentaire pour dessiner hors du cadre strict

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rc = rough.canvas(canvas);

        const draw = () => {
            // Check mobile viewport inside
            if (window.innerWidth < 768) return;

            const parent = canvas.parentElement;
            if (!parent) return;

            // Le parent est le conteneur relatif
            const parentRect = parent.getBoundingClientRect();

            // On ajuste la taille du canvas pour inclure l'offset
            canvas.width = parentRect.width + (offset * 2);
            canvas.height = parentRect.height + (offset * 2); // Un peu de marge verticale aussi

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Récupération des éléments cibles
            const revCard = document.querySelector('.revision-card-wrapper');
            const quizCard = document.querySelector('.sketch-card-wrapper');
            const streakCard = document.querySelector('.streak-card-wrapper');
            const progressCard = document.querySelector('.progress-card-wrapper');

            if (!revCard || !quizCard || !streakCard || !progressCard) {
                // Retry si pas encore chargé
                requestAnimationFrame(draw);
                return;
            }

            // Fonction pour obtenir les coordonnées relatives au canvas (avec offset)
            const getCoords = (el: Element) => {
                const r = el.getBoundingClientRect();
                return {
                    left: (r.left - parentRect.left) + offset,
                    top: (r.top - parentRect.top) + offset,
                    right: (r.right - parentRect.left) + offset,
                    bottom: (r.bottom - parentRect.top) + offset,
                    width: r.width,
                    height: r.height
                };
            };

            const rev = getCoords(revCard);
            const quiz = getCoords(quizCard);
            const streak = getCoords(streakCard);
            const progress = getCoords(progressCard);

            const style = {
                stroke: '#e2d1a6',
                strokeWidth: 2,
                roughness: 2.5,
                bowing: 1.5
            };

            // --- 1. DEUX TRAITS RONDS (HAUT GAUCHE - REVISION) ---
            // Coin haut-gauche de Revision
            // On dessine l'arc comme s'il émanait du coin
            const arcCX = rev.left - 15;
            const arcCY = rev.top + 15;

            // Arc intérieur
            rc.arc(arcCX, arcCY, 30, 30, Math.PI + 0.5, Math.PI * 1.8, false, style);
            // Arc extérieur
            rc.arc(arcCX - 5, arcCY - 5, 50, 50, Math.PI + 0.4, Math.PI * 1.7, false, style);

            // --- 2. TROIS TRAITS ÉCLAT (HAUT DROITE - QUIZ) ---
            // Coin haut-droit de Quiz
            const burstX = quiz.right + 5;
            const burstY = quiz.top - 5;

            // Trait vertical
            rc.line(burstX, burstY - 10, burstX + 5, burstY - 30, style);
            // Trait diagonal
            rc.line(burstX + 10, burstY - 5, burstX + 25, burstY - 20, style);
            // Trait horizontal
            rc.line(burstX + 15, burstY + 5, burstX + 35, burstY + 10, style);

            // --- 3. FLÈCHE GAUCHE (REVISION -> STREAK) ---
            // Part du milieu-gauche de Revision, courbe vers STREAK
            // Point de départ : Tiers inférieur gauche de Rev
            const alStart = { x: rev.left - 10, y: rev.bottom - 80 };
            const alEnd = { x: streak.left - 10, y: streak.top + 20 };

            // Cherche à contourner par la gauche
            // Contrôle point : très à gauche
            rc.curve([
                [alStart.x, alStart.y],
                [alStart.x - 50, (alStart.y + alEnd.y) / 2], // Bombé vers la gauche
                [alEnd.x - 5, alEnd.y]
            ], { ...style, strokeWidth: 1.5 });

            // Pointe
            rc.linearPath([
                [alEnd.x - 15, alEnd.y - 5],
                [alEnd.x - 5, alEnd.y],
                [alEnd.x - 12, alEnd.y + 10]
            ], style);

            // --- 4. FLÈCHE DROITE (QUIZ -> PROGRESS) ---
            const arStart = { x: quiz.right + 10, y: quiz.bottom - 60 };
            const arEnd = { x: progress.right + 10, y: progress.top + 20 };

            rc.curve([
                [arStart.x, arStart.y],
                [arStart.x + 50, (arStart.y + arEnd.y) / 2], // Bombé vers la droite
                [arEnd.x + 5, arEnd.y]
            ], { ...style, strokeWidth: 1.5 });

            // Pointe
            rc.linearPath([
                [arEnd.x + 15, arEnd.y - 10], // haut
                [arEnd.x + 5, arEnd.y], // pointe
                [arEnd.x + 12, arEnd.y + 10] // bas
            ], style);

        };

        // Délai pour s'assurer que le layout est stable
        // Rerender au resize
        const tm = setTimeout(draw, 100);
        window.addEventListener('resize', draw);

        return () => {
            clearTimeout(tm);
            window.removeEventListener('resize', draw);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute pointer-events-none z-0 hidden md:block"
            style={{
                top: -offset,
                left: -offset,
                // Width/Height sont gérés par le JS via attributs width/height
                // Mais pour l'affichage CSS initial
                width: `calc(100% + ${offset * 2}px)`,
                height: `calc(100% + ${offset * 2}px)`
            }}
        />
    );
}
