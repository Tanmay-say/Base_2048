import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import soundManager from '../utils/soundManager';

// Custom hook for detecting swipe gestures with optimizations
export const useSwipe = (onSwipe) => {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [lastMoveTime, setLastMoveTime] = useState(0);

    // Mouse state tracking (for desktop)
    const [mouseStart, setMouseStart] = useState(null);
    const [mouseEnd, setMouseEnd] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);

    // Minimum distance for a swipe (in pixels)
    const minSwipeDistance = 40; // Reduced from 50 to 40 for better sensitivity
    const moveCooldown = 120; // 120ms cooldown between moves

    const onTouchStart = useCallback((e) => {
        // Prevent pull-to-refresh on mobile
        if (e.touches[0].clientY > 50) {
            e.preventDefault();
        }
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    }, []);

    const onTouchMove = useCallback((e) => {
        // Prevent default to avoid scrolling
        e.preventDefault();
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;

        // Check cooldown
        const now = Date.now();
        if (now - lastMoveTime < moveCooldown) {
            return;
        }

        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;
        const isLeftSwipe = distanceX > minSwipeDistance;
        const isRightSwipe = distanceX < -minSwipeDistance;
        const isUpSwipe = distanceY > minSwipeDistance;
        const isDownSwipe = distanceY < -minSwipeDistance;

        let direction = null;

        // Determine dominant direction
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
            // Horizontal swipe
            if (isLeftSwipe) direction = 3; // Left
            if (isRightSwipe) direction = 1; // Right
        } else {
            // Vertical swipe
            if (isUpSwipe) direction = 0; // Up
            if (isDownSwipe) direction = 2; // Down
        }

        if (direction !== null && onSwipe) {
            const moved = onSwipe(direction);
            if (moved) {
                setLastMoveTime(now);
                soundManager.play('move');
            }
        }
    }, [touchStart, touchEnd, lastMoveTime, onSwipe]);

    // Mouse event handlers (for desktop)
    const onMouseDown = useCallback((e) => {
        setIsMouseDown(true);
        setMouseEnd(null);
        setMouseStart({
            x: e.clientX,
            y: e.clientY
        });
    }, []);

    const onMouseMove = useCallback((e) => {
        if (isMouseDown) {
            e.preventDefault();
            setMouseEnd({
                x: e.clientX,
                y: e.clientY
            });
        }
    }, [isMouseDown]);

    const onMouseUp = useCallback(() => {
        if (!isMouseDown) return;
        setIsMouseDown(false);

        if (!mouseStart || !mouseEnd) return;

        // Check cooldown
        const now = Date.now();
        if (now - lastMoveTime < moveCooldown) {
            return;
        }

        const distanceX = mouseStart.x - mouseEnd.x;
        const distanceY = mouseStart.y - mouseEnd.y;
        const isLeftSwipe = distanceX > minSwipeDistance;
        const isRightSwipe = distanceX < -minSwipeDistance;
        const isUpSwipe = distanceY > minSwipeDistance;
        const isDownSwipe = distanceY < -minSwipeDistance;

        let direction = null;

        // Determine dominant direction
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
            // Horizontal swipe
            if (isLeftSwipe) direction = 3; // Left
            if (isRightSwipe) direction = 1; // Right
        } else {
            // Vertical swipe
            if (isUpSwipe) direction = 0; // Up
            if (isDownSwipe) direction = 2; // Down
        }

        if (direction !== null && onSwipe) {
            const moved = onSwipe(direction);
            if (moved) {
                setLastMoveTime(now);
                soundManager.play('move');
            }
        }
    }, [mouseStart, mouseEnd, isMouseDown, lastMoveTime, onSwipe]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Prevent default for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            // Check cooldown
            const now = Date.now();
            if (now - lastMoveTime < moveCooldown) {
                return;
            }

            let direction = null;
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    direction = 0;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    direction = 1;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    direction = 2;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    direction = 3;
                    break;
                default:
                    return;
            }

            if (direction !== null && onSwipe) {
                const moved = onSwipe(direction);
                if (moved) {
                    setLastMoveTime(now);
                    soundManager.play('move');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSwipe, lastMoveTime]);

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onMouseDown,
        onMouseMove,
        onMouseUp
    };
};
