"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { UserPlus, UserCheck } from "lucide-react";

interface FollowButtonProps {
    authorId: number;
}

export default function FollowButton({ authorId }: FollowButtonProps) {
    const { data: session } = useSession();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            // Check if already following
            fetch(`/api/follow?authorId=${authorId}`)
                .then(res => res.json())
                .then(data => setIsFollowing(data.following))
                .catch(err => console.error("Error checking follow status:", err));
        }
    }, [session, authorId]);

    const handleFollow = async () => {
        if (!session) {
            signIn("google");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authorId }),
            });

            const data = await response.json();
            setIsFollowing(data.following);
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#FF5733] text-white hover:bg-[#E64A2E]"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {isFollowing ? (
                <>
                    <UserCheck className="h-4 w-4" />
                    <span>Following</span>
                </>
            ) : (
                <>
                    <UserPlus className="h-4 w-4" />
                    <span>Follow</span>
                </>
            )}
        </button>
    );
}
