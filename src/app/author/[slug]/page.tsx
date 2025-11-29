import { getAuthorBySlug } from '@/lib/authors';
import { getPaginatedPostsByAuthor } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Twitter, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import AuthorAvatar from '@/components/AuthorAvatar';
import FollowButton from '@/components/FollowButton';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

// ... generateMetadata remains same

export default async function AuthorPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const limit = 9;

    const author = await getAuthorBySlug(slug);
    console.log('AuthorPage debug:', { slug, authorFound: !!author, authorName: author?.name });

    if (!author) {
        notFound();
    }

    const { posts: authorPosts, total } = await getPaginatedPostsByAuthor(slug, currentPage, limit);
    const totalPages = Math.ceil(total / limit);

    if (!author) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div>
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-8">
                    <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg md:mb-0 md:h-40 md:w-40">
                        <AuthorAvatar
                            name={author.name}
                            src={author.avatar}
                            className="h-full w-full text-4xl"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                            {author.name}
                        </h1>
                        <p className="mb-4 text-lg font-medium text-primary-600">
                            {author.role}
                        </p>
                        <p className="mb-6 max-w-2xl text-gray-600">
                            {author.bio}
                        </p>
                        <div className="mb-4">
                            <FollowButton authorId={author.id} />
                        </div>
                        <div className="flex items-center justify-center gap-4 md:justify-start">
                            {author.social_twitter && (
                                <a
                                    href={author.social_twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-[#1DA1F2]"
                                >
                                    <Twitter className="h-5 w-5" />
                                    <span className="sr-only">Twitter</span>
                                </a>
                            )}
                            {author.social_linkedin && (
                                <a
                                    href={author.social_linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-[#0A66C2]"
                                >
                                    <Linkedin className="h-5 w-5" />
                                    <span className="sr-only">LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <h2 className="mb-8 text-2xl font-bold text-gray-900">
                    Articles by {author.name}
                </h2>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    {authorPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="p-6">
                                <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-medium text-primary-600">
                                        {post.category}
                                    </span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-primary-600">
                                    {post.title}
                                </h3>
                                <p className="line-clamp-3 text-sm text-gray-600">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        {currentPage > 1 && (
                            <Link
                                href={`/author/${slug}?page=${currentPage - 1}`}
                                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Link>
                        )}
                        <span className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        {currentPage < totalPages && (
                            <Link
                                href={`/author/${slug}?page=${currentPage + 1}`}
                                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
