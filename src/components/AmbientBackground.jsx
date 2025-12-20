import React from 'react';

export const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Top Left Glow */}
            <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>

            {/* Bottom Right Glow */}
            <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>

            {/* Center Depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[80px]"></div>
        </div>
    );
};
