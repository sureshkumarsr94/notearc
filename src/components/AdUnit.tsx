'use client';

import { useEffect } from 'react';

interface AdUnitProps {
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    fullWidth?: boolean;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function AdUnit({
    adSlot,
    adFormat = 'auto',
    fullWidth = true,
    className = ''
}: AdUnitProps) {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`ad-container my-8 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3921845751221806"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidth ? 'true' : 'false'}
            />
        </div>
    );
}
