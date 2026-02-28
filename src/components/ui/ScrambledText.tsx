import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Note: SplitText and ScrambleTextPlugin may require a GSAP premium membership 
// or specific installation. If unavailable, this component will display text normally.
// Attempting to import safely.
let SplitText: any;
let ScrambleTextPlugin: any;

try {
    // @ts-ignore
    import('gsap/SplitText').then(m => SplitText = m.SplitText);
    // @ts-ignore
    import('gsap/ScrambleTextPlugin').then(m => {
        ScrambleTextPlugin = m.ScrambleTextPlugin;
        gsap.registerPlugin(ScrambleTextPlugin);
    });
} catch (e) {
    console.warn("GSAP Premium plugins (SplitText/ScrambleTextPlugin) not found. Animation will be limited.");
}

import './ScrambledText.css';

interface ScrambledTextProps {
    radius?: number;
    duration?: number;
    speed?: number;
    scrambleChars?: string;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
    radius = 100,
    duration = 1.2,
    speed = 0.5,
    scrambleChars = '.:',
    className = '',
    style = {},
    children
}) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const charsRef = useRef<HTMLElement[]>([]);

    useEffect(() => {
        if (!rootRef.current || !SplitText || !ScrambleTextPlugin) return;

        const pElement = rootRef.current.querySelector('p');
        if (!pElement) return;

        const split = SplitText.create(pElement, {
            type: 'chars',
            charsClass: 'char'
        });
        charsRef.current = split.chars;

        charsRef.current.forEach(c => {
            gsap.set(c, {
                display: 'inline-block',
                attr: { 'data-content': c.innerHTML }
            });
        });

        const handleMove = (e: PointerEvent) => {
            charsRef.current.forEach(c => {
                const { left, top, width, height } = c.getBoundingClientRect();
                const dx = e.clientX - (left + width / 2);
                const dy = e.clientY - (top + height / 2);
                const dist = Math.hypot(dx, dy);

                if (dist < radius) {
                    gsap.to(c, {
                        overwrite: true,
                        duration: duration * (1 - dist / radius),
                        scrambleText: {
                            text: (c as HTMLElement).dataset.content || '',
                            chars: scrambleChars,
                            speed
                        },
                        ease: 'none'
                    });
                }
            });
        };

        const el = rootRef.current;
        el.addEventListener('pointermove', handleMove as any);

        return () => {
            el.removeEventListener('pointermove', handleMove as any);
            if (split) split.revert();
        };
    }, [radius, duration, speed, scrambleChars]);

    return (
        <div ref={rootRef} className={`text-block ${className}`} style={style}>
            <p className="m-0 p-0 leading-tight">{children}</p>
        </div>
    );
};

export default ScrambledText;
