'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
    slug: string;
    title: string;
    category: string;
    date: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const search = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data.posts);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query) {
            setShowResults(false);
            router.push(`/blog?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && setShowResults(true)}
                    placeholder="Search articles..."
                    className="w-64 rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setShowResults(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-200 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-3 w-3 text-gray-500" />
                    </button>
                )}
            </div>

            {showResults && query.length >= 2 && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-[#FF5733]" />
                        </div>
                    ) : results.length > 0 ? (
                        <ul className="max-h-96 overflow-y-auto">
                            {results.map((post) => (
                                <li key={post.slug}>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        onClick={() => setShowResults(false)}
                                        className="block rounded-lg p-3 hover:bg-gray-50"
                                    >
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</h4>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                            <span>{post.category}</span>
                                            <span>•</span>
                                            <span>{post.date}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No results found for &quot;{query}&quot;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
