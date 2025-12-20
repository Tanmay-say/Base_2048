import { useState, useEffect, useCallback } from 'react';

// Custom hook for detecting swipe gestures
export const useSwipe = (onSwipe) => {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum distance for a swipe (in pixels)
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const onTouchMove = (e) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;
        const isLeftSwipe = distanceX > minSwipeDistance;
        const isRightSwipe = distanceX < -minSwipeDistance;
        const isUpSwipe = distanceY > minSwipeDistance;
        const isDownSwipe = distanceY < -minSwipeDistance;

        let direction = null;

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
            onSwipe(direction);
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
};
