import { getAllAuthors } from '@/lib/authors';
import Link from 'next/link';
import AuthorAvatar from '@/components/AuthorAvatar';
import FollowButton from '@/components/FollowButton';

export const metadata = {
    title: 'Authors | NoteArc',
    description: 'Browse all authors on NoteArc',
};

export default async function AuthorsPage() {
    const authors = await getAllAuthors();

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 md:px-6 max-w-4xl">
                <div className="mb-8 border-b border-gray-200 pb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Authors</h1>
                    <p className="text-gray-600">Discover amazing content creators</p>
                </div>

                {authors.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {authors.map((author) => (
                            <div key={author.id} className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors bg-white">
                                <Link href={`/author/${author.slug}`}>
                                    <AuthorAvatar
                                        name={author.name}
                                        src={author.avatar}
                                        className="h-16 w-16"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <Link
                                            href={`/author/${author.slug}`}
                                            className="font-semibold text-gray-900 hover:text-gray-700 transition-colors truncate"
                                        >
                                            {author.name}
                                        </Link>
                                        <FollowButton authorId={author.id} />
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2 h-10">
                                        {author.bio || author.role}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="font-medium text-gray-900">{author.postCount}</span> posts
                                        <span>•</span>
                                        <span className="font-medium text-gray-900">{author.totalViews.toLocaleString()}</span> views
                                        <span>•</span>
                                        <span>{author.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500">No authors found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
