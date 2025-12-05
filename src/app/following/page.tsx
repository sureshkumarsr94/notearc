"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Users, TrendingUp, Sparkles, Heart, UserPlus, ArrowRight, Eye, FileText, UserCheck } from "lucide-react";
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

    // Not signed in state
    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-purple-100/30 blur-3xl -z-10" />
                <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-pink-100/40 blur-3xl -z-10" />

                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg">
                        <Users className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Sign in to follow authors
                    </h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                        Join our community to follow your favorite writers and discover amazing content creators
                    </p>
                    <Link
                        href="/api/auth/signin"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <UserPlus className="h-4 w-4" />
                        Sign In to Get Started
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-purple-100/30 blur-3xl -z-10" />
            <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-pink-100/40 blur-3xl -z-10" />
            <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-50/50 blur-3xl -z-10" />

            {/* Hero Header */}
            <header className="relative py-12 md:py-16 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-40" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-purple-600 mb-6 shadow-lg">
                            <Heart className="h-4 w-4" />
                            <span>Your Writing Community</span>
                            <Sparkles className="h-4 w-4" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                            Writers You
                            <span className="relative inline-block ml-3">
                                <span className="relative z-10 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                    Love
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full h-4 text-purple-300" viewBox="0 0 100 12" preserveAspectRatio="none">
                                    <path d="M0 8 Q 25 0, 50 8 T 100 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            Stay connected with the authors who inspire you and discover new voices
                        </p>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 md:px-6 max-w-6xl">
                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex rounded-2xl bg-white p-1.5 shadow-lg border border-gray-100">
                        <button
                            onClick={() => setActiveTab('following')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'following'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <UserCheck className="h-4 w-4" />
                            Following
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === 'following'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {followedAuthors.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('suggestions')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'suggestions'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <TrendingUp className="h-4 w-4" />
                            Discover
                        </button>
                    </div>
                </div>

                {/* Section Title */}
                <div className="flex items-center gap-4 mb-8">
                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${activeTab === 'following'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-pink-100 text-pink-600'
                        }`}>
                        {activeTab === 'following' ? (
                            <>
                                <UserCheck className="h-4 w-4" />
                                <span>Your Favorites</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                <span>Recommended for You</span>
                            </>
                        )}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-500 font-medium">Loading authors...</p>
                    </div>
                ) : activeTab === 'following' ? (
                    followedAuthors.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {followedAuthors.map((author, index) => (
                                <AuthorCard
                                    key={author.id}
                                    author={author}
                                    index={index}
                                    onFollowToggle={handleFollowToggle}
                                    variant="following"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            type="following"
                            onBrowseSuggestions={() => setActiveTab('suggestions')}
                        />
                    )
                ) : (
                    <>
                        {suggestedAuthors.length > 0 ? (
                            <>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {suggestedAuthors.map((author, index) => (
                                        <AuthorCard
                                            key={author.id}
                                            author={author}
                                            index={index}
                                            onFollowToggle={handleFollowToggle}
                                            variant="suggested"
                                        />
                                    ))}
                                </div>
                                <div className="mt-12 text-center">
                                    <Link
                                        href="/authors"
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-lg border border-gray-100 hover:shadow-xl hover:border-purple-200 hover:text-purple-600 transition-all duration-300"
                                    >
                                        <Users className="h-4 w-4" />
                                        Browse All Authors
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <EmptyState type="suggestions" />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Author Card Component
function AuthorCard({
    author,
    index,
    onFollowToggle,
    variant
}: {
    author: Author;
    index: number;
    onFollowToggle: () => void;
    variant: 'following' | 'suggested';
}) {
    const gradientClass = variant === 'following'
        ? 'from-purple-200 via-pink-100 to-purple-200'
        : 'from-pink-200 via-purple-100 to-pink-200';

    return (
        <article
            className="group relative animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Glow effect on hover */}
            <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

            <div className="relative flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-purple-200 group-hover:-translate-y-1 overflow-hidden">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                    {/* Author Header */}
                    <div className="flex items-start gap-4 mb-4">
                        <Link href={`/author/${author.slug}`} className="relative">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                            <AuthorAvatar
                                name={author.name}
                                src={author.avatar}
                                className="relative h-14 w-14 ring-2 ring-white shadow-md"
                            />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/author/${author.slug}`}
                                className="block font-bold text-gray-900 group-hover:text-purple-600 transition-colors truncate"
                            >
                                {author.name}
                            </Link>
                            <p className="text-sm text-purple-600 font-medium">
                                {author.role}
                            </p>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
                        {author.bio || `${author.name} is a passionate writer sharing insights and stories on NoteArc.`}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-gray-700">{author.postCount}</span>
                            <span>posts</span>
                        </div>
                        {author.totalViews !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4 text-gray-400" />
                                <span className="font-semibold text-gray-700">{author.totalViews.toLocaleString()}</span>
                                <span>views</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <Link
                            href={`/author/${author.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors"
                        >
                            View Profile
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <div onClick={onFollowToggle}>
                            <FollowButton authorId={author.id} />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

// Empty State Component
function EmptyState({
    type,
    onBrowseSuggestions
}: {
    type: 'following' | 'suggestions';
    onBrowseSuggestions?: () => void;
}) {
    if (type === 'following') {
        return (
            <div className="text-center py-20">
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-30" />
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                        <Heart className="h-10 w-10 text-purple-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                    Start Building Your Feed
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Follow authors whose writing resonates with you, and their latest articles will appear here
                </p>
                <button
                    onClick={onBrowseSuggestions}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                    <Sparkles className="h-4 w-4" />
                    Discover Writers
                </button>
            </div>
        );
    }

    return (
        <div className="text-center py-20">
            <div className="relative inline-block mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-xl opacity-30" />
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100">
                    <TrendingUp className="h-10 w-10 text-pink-500" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                No Suggestions Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
                We're working on finding the perfect authors for you. Check back soon!
            </p>
        </div>
    );
}
