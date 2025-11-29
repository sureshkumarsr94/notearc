"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import AuthorAvatar from "@/components/AuthorAvatar";
import FollowButton from "@/components/FollowButton";

interface Author {
    id: number;
    name: string;
    slug: string;
    avatar: string;
    role: string;
    bio: string;
    postCount: number;
    totalViews?: number;
}

export default function FollowingPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'following' | 'suggestions'>('following');
    const [followedAuthors, setFollowedAuthors] = useState<Author[]>([]);
    const [suggestedAuthors, setSuggestedAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            if (activeTab === 'following') {
                fetchFollowedAuthors();
            } else {
                fetchSuggestedAuthors();
            }
        }
    }, [activeTab, session]);

    const fetchFollowedAuthors = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/following');
            if (response.ok) {
                const data = await response.json();
                setFollowedAuthors(data);
            }
        } catch (error) {
            console.error('Error fetching followed authors:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestedAuthors = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/authors/suggested');
            if (response.ok) {
                const data = await response.json();
                setSuggestedAuthors(data);
            }
        } catch (error) {
            console.error('Error fetching suggested authors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = () => {
        // Refresh the lists after follow/unfollow
        if (activeTab === 'following') {
            fetchFollowedAuthors();
        } else {
            fetchSuggestedAuthors();
        }
    };

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to follow authors</h1>
                <p className="text-gray-600">Sign in to see your followed authors and discover new ones</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 md:px-6 max-w-4xl">
                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'following'
                                ? 'text-gray-900'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <Users className="h-4 w-4 inline mr-2" />
                        Following ({followedAuthors.length})
                        {activeTab === 'following' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('suggestions')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'suggestions'
                                ? 'text-gray-900'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <TrendingUp className="h-4 w-4 inline mr-2" />
                        Suggestions
                        {activeTab === 'suggestions' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                        )}
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {activeTab === 'following' ? 'Authors you follow' : 'Writers to follow'}
                </h2>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                ) : activeTab === 'following' ? (
                    followedAuthors.length > 0 ? (
                        <div className="space-y-6">
                            {followedAuthors.map((author) => (
                                <div key={author.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                    <Link href={`/author/${author.slug}`}>
                                        <AuthorAvatar
                                            name={author.name}
                                            src={author.avatar}
                                            className="h-12 w-12"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Link
                                                href={`/author/${author.slug}`}
                                                className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                                            >
                                                {author.name}
                                            </Link>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                                            {author.bio || author.role}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {author.postCount} posts
                                        </p>
                                    </div>
                                    <div onClick={handleFollowToggle} className="flex-shrink-0">
                                        <FollowButton authorId={author.id} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">You're not following anyone yet</h3>
                            <p className="text-gray-600 mb-6">Discover amazing authors in the suggestions tab!</p>
                            <button
                                onClick={() => setActiveTab('suggestions')}
                                className="rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                            >
                                Browse Suggestions
                            </button>
                        </div>
                    )
                ) : (
                    <>
                        {suggestedAuthors.length > 0 ? (
                            <>
                                <div className="space-y-6">
                                    {suggestedAuthors.map((author) => (
                                        <div key={author.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                            <Link href={`/author/${author.slug}`}>
                                                <AuthorAvatar
                                                    name={author.name}
                                                    src={author.avatar}
                                                    className="h-12 w-12"
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Link
                                                        href={`/author/${author.slug}`}
                                                        className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                                                    >
                                                        {author.name}
                                                    </Link>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                                                    {author.bio || author.role}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {author.postCount} posts · {author.totalViews?.toLocaleString()} views
                                                </p>
                                            </div>
                                            <div onClick={handleFollowToggle} className="flex-shrink-0">
                                                <FollowButton authorId={author.id} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 text-center">
                                    <Link
                                        href="/authors"
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        See more suggestions
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No suggestions available</h3>
                                <p className="text-gray-600">Check back later for author recommendations</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
