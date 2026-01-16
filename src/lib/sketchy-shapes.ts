/**
 * Sketchy Shapes - Rough.js Drawing Functions
 * 
 * Ce fichier contient toutes les fonctions de dessin pour les formes "croquis"
 * utilisées dans l'application. Chaque fonction peut être utilisée avec
 * rough.canvas() ou rough.svg().
 */

import { RoughCanvas } from 'roughjs/bin/canvas';

// === TYPES ===
export interface SketchyStyle {
    roughness?: number;
    bowing?: number;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    fillStyle?: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots';
    fillWeight?: number;
    hachureAngle?: number;
    hachureGap?: number;
}

// === STYLES PAR DÉFAUT ===
export const defaultSketchStyle: SketchyStyle = {
    roughness: 2,
    bowing: 1.5,
    stroke: '#333',
    strokeWidth: 2,
};

export const filledSketchStyle: SketchyStyle = {
    ...defaultSketchStyle,
    fill: '#333',
    fillStyle: 'hachure',
    hachureAngle: 65,
    hachureGap: 5,
};

// === POINT D'INTERROGATION ===
export const questionMarkPaths = {
    // Version grande (pour canvas 500x600)
    large: {
        body: `
      M 130 200 
      C 130 110, 170 70, 250 70 
      C 320 70, 350 110, 350 170 
      C 350 230, 290 250, 270 280 
      L 270 340 
      L 220 340 
      L 220 280 
      C 240 250, 290 230, 290 180 
      C 290 150, 270 120, 240 120 
      C 210 120, 190 150, 190 200 
      Z
    `,
        dot: `
      M 220 380
      L 270 380
      L 270 430
      L 220 430
      Z
    `,
    },
    // Version small (pour utilisation dans les cartes)
    small: {
        body: `M 15 35 C 15 20, 25 10, 40 10 C 55 10, 65 20, 65 35 C 65 50, 50 55, 45 65 L 45 80 L 35 80 L 35 65 C 40 55, 55 50, 55 40 C 55 30, 50 22, 40 22 C 30 22, 25 30, 25 40 Z`,
        dot: `M 35 90 L 45 90 L 45 100 L 35 100 Z`,
    },
};

export function drawQuestionMark(
    rc: RoughCanvas,
    x: number,
    y: number,
    scale: number = 1,
    style: SketchyStyle = filledSketchStyle
) {
    const ctx = (rc as any).ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    rc.path(questionMarkPaths.large.body, style);
    rc.path(questionMarkPaths.large.dot, style);

    ctx.restore();
}

// Version simplifiée pour petits points d'interrogation
export function drawSmallQuestionMark(
    rc: RoughCanvas,
    x: number,
    y: number,
    style: SketchyStyle = { stroke: '#333', strokeWidth: 2.5, roughness: 2 }
) {
    const ctx = (rc as any).ctx;
    ctx.save();
    ctx.translate(x, y);

    rc.path(questionMarkPaths.small.body, style);
    rc.path(questionMarkPaths.small.dot, { ...style, fill: '#333', fillStyle: 'solid' });

    ctx.restore();
}

// === BOUTON START (Cercle) ===
export function drawStartCircle(
    rc: RoughCanvas,
    centerX: number,
    centerY: number,
    radius: number = 55,
    style: SketchyStyle = {
        fill: '#e2cfa5',
        fillStyle: 'solid',
        stroke: '#333',
        strokeWidth: 3,
        roughness: 1.5,
        bowing: 1.2,
    }
) {
    rc.circle(centerX, centerY, radius * 2, style);
}

// === MINI GRAPHIQUE ===
export function drawMiniGraph(
    rc: RoughCanvas,
    x: number,
    y: number,
    style: SketchyStyle = { stroke: '#333', strokeWidth: 2 }
) {
    const ctx = (rc as any).ctx;
    ctx.save();
    ctx.translate(x, y);

    // Axes
    rc.path(`M 0 50 L 0 0`, style);
    rc.path(`M 0 50 L 60 50`, style);

    // Barres avec hachures
    const barStyle = { ...style, fill: '#333', fillStyle: 'zigzag' as const };
    rc.rectangle(10, 35, 10, 15, barStyle);
    rc.rectangle(25, 20, 10, 30, barStyle);
    rc.rectangle(40, 10, 10, 40, barStyle);

    // Flèche
    rc.path(`M 55 45 L 65 50 L 55 55`, style);

    ctx.restore();
}

// === CARTE ARRONDIE ===
export function drawRoundedCard(
    rc: RoughCanvas,
    width: number,
    height: number,
    cornerRadius: number = 30,
    style: SketchyStyle = {
        fill: '#fffbf0',
        fillStyle: 'solid',
        roughness: 1.2,
        stroke: '#333',
        strokeWidth: 2,
        bowing: 1.5,
    }
) {
    const r = cornerRadius;
    const cardPath = `
    M ${5 + r} 5 
    L ${width - 5 - r} 5 
    Q ${width - 5} 5 ${width - 5} ${5 + r} 
    L ${width - 5} ${height - 5 - r} 
    Q ${width - 5} ${height - 5} ${width - 5 - r} ${height - 5} 
    L ${5 + r} ${height - 5} 
    Q 5 ${height - 5} 5 ${height - 5 - r} 
    L 5 ${5 + r} 
    Q 5 5 ${5 + r} 5 
    Z
  `;

    rc.path(cardPath, style);
}

// === LIGNES DE CAHIER ===
export function drawNotebookLines(
    rc: RoughCanvas,
    width: number,
    height: number,
    lineHeight: number = 35,
    startY: number = 80,
    style: SketchyStyle = {
        stroke: '#d1d1d1',
        strokeWidth: 1,
        roughness: 0.5,
        bowing: 1,
    }
) {
    for (let y = startY; y < height - 20; y += lineHeight) {
        rc.line(15, y, width - 15, y, style);
    }
}

// === SOULIGNEMENT SKETCHY ===
export function drawSketchyUnderline(
    rc: RoughCanvas,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    style: SketchyStyle = { stroke: '#333', roughness: 2, strokeWidth: 1.5 }
) {
    rc.line(x1, y1, x2, y2, style);
    // Deuxième ligne légèrement décalée pour effet double
    rc.line(x1 + 10, y1 + 7, x2 - 10, y2 + 5, style);
}

// === LIVRE OUVERT ===
export function drawOpenBook(
    rc: RoughCanvas,
    x: number,
    y: number,
    style: SketchyStyle = { stroke: '#3a3530', strokeWidth: 2.5, roughness: 1.5 }
) {
    const ctx = (rc as any).ctx;
    ctx.save();
    ctx.translate(x, y);

    rc.path("M 0 0 Q 15 -2 30 2 L 30 35 Q 15 32 0 34 Z", style);
    rc.path("M 30 2 Q 45 -2 60 0 L 60 34 Q 45 32 30 35 Z", style);
    rc.line(30, 2, 30, 35, style);

    ctx.restore();
}
