"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface SaveButtonProps {
    postSlug: string;
    variant?: 'default' | 'minimal';
}

export default function SaveButton({ postSlug, variant = 'default' }: SaveButtonProps) {
    const { data: session } = useSession();
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            checkSavedStatus();
        }
    }, [session, postSlug]);

    const checkSavedStatus = async () => {
        try {
            const response = await fetch(`/api/saved?postSlug=${postSlug}`);
            const data = await response.json();
            setIsSaved(data.saved);
        } catch (error) {
            console.error('Error checking saved status:', error);
        }
    };

    const handleToggleSave = async () => {
        if (!session) {
            alert('Please sign in to save posts');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/saved', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postSlug }),
            });

            const data = await response.json();
            setIsSaved(data.saved);
        } catch (error) {
            console.error('Error toggling save:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Minimal variant - just icon with tooltip-like feel
    if (variant === 'minimal') {
        return (
            <button
                onClick={handleToggleSave}
                disabled={isLoading}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isSaved
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-white/80 backdrop-blur-sm text-gray-500 shadow-md border border-gray-100 hover:border-orange-200 hover:text-orange-500 hover:shadow-lg'
                    }`}
                aria-label={isSaved ? 'Unsave post' : 'Save post'}
            >
                {isSaved ? (
                    <BookmarkCheck className="h-5 w-5" />
                ) : (
                    <Bookmark className="h-5 w-5" />
                )}
            </button>
        );
    }

    // Default variant - button with text
    return (
        <button
            onClick={handleToggleSave}
            disabled={isLoading}
            className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${isSaved
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 shadow-md border border-gray-100 hover:border-orange-200 hover:text-orange-600 hover:shadow-lg'
                }`}
            aria-label={isSaved ? 'Unsave post' : 'Save post'}
        >
            {isSaved ? (
                <BookmarkCheck className="h-4 w-4" />
            ) : (
                <Bookmark className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            )}
            <span>{isSaved ? 'Saved' : 'Save Story'}</span>
        </button>
    );
}
