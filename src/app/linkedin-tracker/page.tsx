'use client';

import { useState, useEffect } from 'react';
import { Check, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface LinkedInPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    posted_in_linkedin: boolean;
}

export default function LinkedInTrackerPage() {
    const [posts, setPosts] = useState<LinkedInPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/linkedin-posts');
            const data = await response.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsPosted = async (slug: string) => {
        setMarking(slug);
        try {
            const response = await fetch('/api/linkedin-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug }),
            });

            if (response.ok) {
                // Remove the post from the list
                setPosts(posts.filter(p => p.slug !== slug));
            }
        } catch (error) {
            console.error('Error marking post:', error);
        } finally {
            setMarking(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    LinkedIn Posting Tracker
                </h1>

                <p className="text-gray-600 mb-8">
                    Oldest 10 posts not yet shared on LinkedIn. Mark them as posted when done.
                </p>

                {posts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-600">All posts have been shared on LinkedIn!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map((post) => (
                                    <tr key={post.slug} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="text-blue-600 hover:underline flex items-center gap-2"
                                                target="_blank"
                                            >
                                                {post.title}
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {post.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => markAsPosted(post.slug)}
                                                disabled={marking === post.slug}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {marking === post.slug ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                Mark Posted
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
