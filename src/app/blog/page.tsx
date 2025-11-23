import { getPaginatedPosts } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata = {
    title: 'Blog | NoteArc',
    description: 'Explore all our articles on technology, design, and lifestyle.',
};

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = 9; // Show 9 posts per page
    const { posts, total } = await getPaginatedPosts(page, limit);
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <header className="mb-12 text-center">
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    All Articles
                </h1>
                <p className="mx-auto max-w-2xl text-xl text-gray-600">
                    Browse through our complete collection of stories and insights.
                </p>
            </header>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                {posts.map((post) => (
                    <PostCard key={post.slug} {...post} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {page > 1 ? (
                        <Link
                            href={`/blog?page=${page - 1}`}
                            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                    )}

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Link
                                key={p}
                                href={`/blog?page=${p}`}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium ${p === page
                                        ? 'border-orange-500 bg-orange-500 text-white'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>

                    {page < totalPages ? (
                        <Link
                            href={`/blog?page=${page + 1}`}
                            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
