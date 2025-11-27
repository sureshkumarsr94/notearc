'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AuthorAvatarProps {
    name: string;
    src?: string | null;
    className?: string;
}

export default function AuthorAvatar({ name, src, className = '' }: AuthorAvatarProps) {
    const [imageError, setImageError] = useState(false);

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    };

    const initials = getInitials(name);

    if (!src || imageError) {
        return (
            <div
                className={`flex items-center justify-center bg-primary-100 text-primary-700 font-bold uppercase ${className}`}
                aria-label={name}
            >
                {initials}
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100px, 200px"
        />
    );
}
