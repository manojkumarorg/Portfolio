"use client";
import { useEffect, useState } from 'react';

export default function IframePage() {
    const [iframeHeight, setIframeHeight] = useState('100vh');

    useEffect(() => {
        // Update iframe height on window resize
        const handleResize = () => {
            setIframeHeight(`${window.innerHeight}px`);
        };

        handleResize(); // Set initial height
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <html>
            <body>
            <div>
            <iframe
                src="/index.html"
                title="Full Page Content"
                width="100%"
                height={iframeHeight}
                style={{
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
                allowFullScreen
            />
        </div>
            </body>
        </html>
        
    );
}