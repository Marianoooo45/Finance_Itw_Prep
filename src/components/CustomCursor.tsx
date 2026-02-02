"use client";

import React, { useEffect, useRef, useState } from "react";
import rough from "roughjs";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const arrowContainerRef = useRef<HTMLDivElement>(null);
    const hoverContainerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        // 0. Only enable on non-touch devices
        const isTouchDevice =
            typeof window !== "undefined" &&
            ("ontouchstart" in window || navigator.maxTouchPoints > 0);
        if (isTouchDevice) return;

        // --- 1. Generate Arrow SVG ---
        if (arrowContainerRef.current && !arrowContainerRef.current.hasChildNodes()) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "50");
            svg.setAttribute("height", "50");
            svg.setAttribute("viewBox", "0 0 50 50");
            svg.style.overflow = "visible";
            arrowContainerRef.current.appendChild(svg);

            const rc = rough.svg(svg);

            // Tip at 10,10
            const startX = 10;
            const startY = 10;
            const arrowPath = `
        M ${startX} ${startY} 
        L ${startX} ${startY + 26} 
        L ${startX + 7} ${startY + 20} 
        L ${startX + 14} ${startY + 34} 
        L ${startX + 18} ${startY + 32} 
        L ${startX + 11} ${startY + 18} 
        L ${startX + 20} ${startY + 18} 
        Z
      `;

            const node = rc.path(arrowPath, {
                stroke: '#e2d1a6',
                strokeWidth: 2,
                fill: '#2a2a2a',
                fillStyle: 'solid',
                roughness: 0,
                bowing: 0,
            });
            svg.appendChild(node);
        }

        // --- 2. Generate Hover SVG (Classic OS Hand - Dark/Gold Theme) ---
        if (hoverContainerRef.current && !hoverContainerRef.current.hasChildNodes()) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "50");
            svg.setAttribute("height", "50");
            svg.setAttribute("viewBox", "0 0 50 50");
            svg.style.overflow = "visible";
            hoverContainerRef.current.appendChild(svg);

            const rc = rough.svg(svg);

            // Style Constants matching the "Base Mouse" (Arrow)
            const mainStyle = {
                stroke: '#e2d1a6',   // Gold Stroke
                strokeWidth: 2,
                fill: '#2a2a2a',     // Dark Fill
                fillStyle: 'solid',
                roughness: 0,
                bowing: 0,
            };

            // Hover Pointer - Same arrow shape as base cursor
            // Visual difference handled via CSS transforms (slight rotation on hover)

            const startX = 10;
            const startY = 10;
            const arrowPath = `
              M ${startX} ${startY} 
              L ${startX} ${startY + 26} 
              L ${startX + 7} ${startY + 20} 
              L ${startX + 14} ${startY + 34} 
              L ${startX + 18} ${startY + 32} 
              L ${startX + 11} ${startY + 18} 
              L ${startX + 20} ${startY + 18} 
              Z
            `;

            svg.appendChild(rc.path(arrowPath, mainStyle));
        }

        // --- 3. Event Listeners ---
        const onMouseMove = (e: MouseEvent) => {
            if (cursorRef.current) {
                // Direct translate is more performant than state for coordinates
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }

            const target = e.target as HTMLElement;
            // Check if element is interactive
            const isClickable =
                window.getComputedStyle(target).cursor === "pointer" ||
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("a") ||
                target.closest("button") ||
                target.getAttribute("role") === "button" ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT";

            setIsHovering(!!isClickable);
        };

        const onMouseDown = () => setIsMouseDown(true);
        const onMouseUp = () => setIsMouseDown(false);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    return (
        <>
            {/* Hide default cursor globally on fine-pointer devices */}
            <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

            {/* Main Cursor Wrapper */}
            <div
                ref={cursorRef}
                className="pointer-events-none fixed top-0 left-0 z-[9999] opacity-0 md:opacity-100 will-change-transform"
            >
                {/* ARROW STATE */}
                <div
                    ref={arrowContainerRef}
                    className={`
            absolute top-0 left-0
            transition-all duration-150 ease-out origin-[10px_10px]
            ${isHovering ? "opacity-0 scale-75" : "opacity-100 scale-100"}
            ${isMouseDown && !isHovering ? "scale-90" : ""}
          `}
                    // Center the tip (10,10) to the mouse coordinates
                    style={{ marginLeft: "-10px", marginTop: "-10px" }}
                />

                {/* HOVER STATE (Arrow with slight rotation) */}
                <div
                    ref={hoverContainerRef}
                    className={`
            absolute top-0 left-0
            transition-all duration-150 ease-out origin-[10px_10px]
            ${isHovering ? "opacity-100 scale-100 rotate-[-8deg]" : "opacity-0 scale-75"}
            ${isMouseDown && isHovering ? "scale-90" : ""}
          `}
                    style={{ marginLeft: "-10px", marginTop: "-10px" }}
                />
            </div>
        </>
    );
}