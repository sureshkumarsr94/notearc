"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
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

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Bookmark className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view saved stories</h1>
                <p className="text-gray-600">Sign in to save stories and access them anytime</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 md:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Stories</h1>
                    <p className="text-gray-600">Your bookmarked articles for later reading</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5733]"></div>
                    </div>
                ) : savedPosts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {savedPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-medium text-[#FF5733] uppercase tracking-wide">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">{post.readTime}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FF5733] transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <AuthorAvatar
                                                name={post.author.name}
                                                src={post.author.avatar}
                                                className="h-8 w-8 text-xs"
                                            />
                                            <div>
                                                <p className="text-xs font-medium text-gray-900">
                                                    {post.author.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {post.author.role}
                                                </p>
                                            </div>
                                        </div>
                                        <Bookmark className="h-5 w-5 text-[#FF5733] fill-current" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Bookmark className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved stories yet</h3>
                        <p className="text-gray-600 mb-6">Start saving stories you want to read later!</p>
                        <Link
                            href="/"
                            className="inline-block rounded-full bg-[#FF5733] px-6 py-2 text-sm font-medium text-white hover:bg-[#E64A2E] transition-colors"
                        >
                            Explore Stories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
