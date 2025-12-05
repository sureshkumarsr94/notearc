"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Bookmark, BookOpen, Sparkles, Clock, Eye, ArrowRight, BookmarkPlus, Library } from "lucide-react";
import Link from "next/link";
import AuthorAvatar from "@/components/AuthorAvatar";

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    views: number;
    author: {
        id: number;
        name: string;
        slug: string;
        avatar: string;
        role: string;
    };
    savedAt: string;
}

export default function SavedPage() {
    const { data: session } = useSession();
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetchSavedPosts();
        }
    }, [session]);

    const fetchSavedPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/saved');
            if (response.ok) {
                const data = await response.json();
                setSavedPosts(data);
            }
        } catch (error) {
            console.error('Error fetching saved posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate reading time stats
    const totalReadingTime = savedPosts.reduce((acc, post) => {
        const mins = parseInt(post.readTime) || 0;
        return acc + mins;
    }, 0);

    // Not signed in state
    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-amber-100/30 blur-3xl -z-10" />
                <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-orange-100/40 blur-3xl -z-10" />

                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mb-6 shadow-lg">
                        <Bookmark className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Sign in to view saved stories
                    </h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                        Create your personal reading list and access your favorite articles anytime
                    </p>
                    <Link
                        href="/api/auth/signin"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <BookmarkPlus className="h-4 w-4" />
                        Sign In to Get Started
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -right-[15%] h-[600px] w-[600px] rounded-full bg-amber-100/30 blur-3xl -z-10" />
            <div className="absolute top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-orange-100/40 blur-3xl -z-10" />
            <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-yellow-50/50 blur-3xl -z-10" />

            {/* Hero Header */}
            <header className="relative py-12 md:py-16 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-40" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-amber-600 mb-6 shadow-lg">
                            <Library className="h-4 w-4" />
                            <span>Your Reading List</span>
                            <Sparkles className="h-4 w-4" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                            Saved
                            <span className="relative inline-block ml-3">
                                <span className="relative z-10 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                                    Stories
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full h-4 text-amber-300" viewBox="0 0 100 12" preserveAspectRatio="none">
                                    <path d="M0 8 Q 25 0, 50 8 T 100 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
                            Your curated collection of must-read articles, saved for the perfect moment
                        </p>

                        {/* Stats */}
                        {savedPosts.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                                <div className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm px-5 py-3 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100">
                                        <Bookmark className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-2xl font-bold text-gray-900">{savedPosts.length}</p>
                                        <p className="text-sm text-gray-500">Saved</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm px-5 py-3 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-2xl font-bold text-gray-900">{totalReadingTime}</p>
                                        <p className="text-sm text-gray-500">Min to read</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 md:px-6 max-w-6xl">
                {/* Section Title */}
                {savedPosts.length > 0 && (
                    <div className="flex items-center gap-4 mb-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-600">
                            <BookOpen className="h-4 w-4" />
                            <span>Ready to Read</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Bookmark className="h-6 w-6 text-amber-500" />
                            </div>
                        </div>
                        <p className="mt-4 text-gray-500 font-medium">Loading your collection...</p>
                    </div>
                ) : savedPosts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {savedPosts.map((post, index) => (
                            <SavedPostCard key={post.slug} post={post} index={index} />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}

// Saved Post Card Component
function SavedPostCard({ post, index }: { post: Post; index: number }) {
    return (
        <article
            className="group relative animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

            <Link
                href={`/blog/${post.slug}`}
                className="block relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-amber-200 group-hover:-translate-y-1 overflow-hidden"
            >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Category & Reading Time */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-xs font-semibold text-amber-700 uppercase tracking-wide">
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                        {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                                <AuthorAvatar
                                    name={post.author.name}
                                    src={post.author.avatar}
                                    className="relative h-8 w-8 text-xs ring-2 ring-white"
                                />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-900">
                                    {post.author.name}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {post.views?.toLocaleString() || 0} views
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bookmark className="h-5 w-5 text-amber-500 fill-current" />
                        </div>
                    </div>

                    {/* Read More Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white shadow-lg">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}

// Empty State Component
function EmptyState() {
    return (
        <div className="text-center py-20">
            <div className="relative inline-block mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 blur-xl opacity-30" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                    <BookOpen className="h-12 w-12 text-amber-500" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                Your Reading List Awaits
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building your personal library by saving articles that inspire you. Click the bookmark icon on any story to add it here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                    <Sparkles className="h-4 w-4" />
                    Explore Stories
                </Link>
                <Link
                    href="/blog"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-lg border border-gray-200 hover:border-amber-200 hover:text-amber-600 transition-all duration-300"
                >
                    <BookOpen className="h-4 w-4" />
                    Browse All Articles
                </Link>
            </div>
        </div>
    );
}
