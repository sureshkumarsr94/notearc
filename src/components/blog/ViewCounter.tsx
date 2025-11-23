'use client';

import { useEffect } from 'react';

export default function ViewCounter({ slug }: { slug: string }) {
    useEffect(() => {
        const viewedKey = `viewed:${slug}`;
        const hasViewed = sessionStorage.getItem(viewedKey);

        if (!hasViewed) {
            fetch(`/api/views/${slug}`, { method: 'POST' });
            sessionStorage.setItem(viewedKey, 'true');
        }
    }, [slug]);

    return null;
}
