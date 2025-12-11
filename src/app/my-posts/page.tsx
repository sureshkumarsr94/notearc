'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import {
    PenLine,
    FileText,
    Eye,
    Clock,
    Edit3,
    Trash2,
    Loader2,
    Sparkles,
    Plus
} from 'lucide-react';

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    views: number;
    image: string;
    status?: string;
}

export default function MyPostsPage() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('google', { callbackUrl: '/my-posts' });
        }
    }, [status]);

    useEffect(() => {
        async function fetchPosts() {
            if (status !== 'authenticated') return;

            try {
                const response = await fetch('/api/posts');
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.posts || []);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPosts();
    }, [status]);

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        setDeletingSlug(slug);
        try {
            const response = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
            if (response.ok) {
                setPosts(posts.filter(p => p.slug !== slug));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setDeletingSlug(null);
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    <p className="text-gray-600">Loading your posts...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="p-4 bg-orange-100 rounded-full">
                        <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Sign in Required</h1>
                    <p className="text-gray-600">Sign in to view and manage your posts.</p>
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/my-posts' })}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Sparkles className="h-5 w-5" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
                        <p className="text-gray-600 mt-1">Manage your published and draft posts</p>
                    </div>
                    <Link
                        href="/write"
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all w-fit"
                    >
                        <Plus className="h-5 w-5" />
                        New Story
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                        <p className="text-sm text-gray-500">Total Posts</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-2xl font-bold text-green-600">
                            {posts.filter(p => p.status === 'published' || !p.status).length}
                        </p>
                        <p className="text-sm text-gray-500">Published</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-2xl font-bold text-yellow-600">
                            {posts.filter(p => p.status === 'draft').length}
                        </p>
                        <p className="text-sm text-gray-500">Drafts</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-2xl font-bold text-blue-600">
                            {posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Total Views</p>
                    </div>
                </div>

                {/* Posts List */}
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                            <PenLine className="h-8 w-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h2>
                        <p className="text-gray-600 mb-6">Start writing your first story!</p>
                        <Link
                            href="/write"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            <PenLine className="h-5 w-5" />
                            Write Your First Story
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.slug}
                                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex gap-4">
                                    {/* Thumbnail */}
                                    {post.image && (
                                        <div className="hidden sm:block flex-shrink-0">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-24 h-24 object-cover rounded-xl"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'draft'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {post.status === 'draft' ? 'Draft' : 'Published'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{post.category}</span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                                                    {post.excerpt}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Link
                                                    href={`/write/${post.slug}`}
                                                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.slug)}
                                                    disabled={deletingSlug === post.slug}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deletingSlug === post.slug ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {post.date}
                                            </span>
                                            <span>{post.readTime}</span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-3.5 w-3.5" />
                                                {post.views || 0} views
                                            </span>
                                            {post.status !== 'draft' && (
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="text-orange-600 hover:underline"
                                                >
                                                    View post →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
