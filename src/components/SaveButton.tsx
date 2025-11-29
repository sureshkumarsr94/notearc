"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

interface SaveButtonProps {
    postSlug: string;
}

export default function SaveButton({ postSlug }: SaveButtonProps) {
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

    return (
        <button
            onClick={handleToggleSave}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${isSaved
                    ? 'bg-[#FF5733] text-white hover:bg-[#E64A2E]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            aria-label={isSaved ? 'Unsave post' : 'Save post'}
        >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
    );
}
