"use client";

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './SearchBar';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold">
                            N
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            NoteArc
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {/* Navigation links removed as per request */}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <SearchBar />
                    <button
                        className="md:hidden p-2 text-gray-500 hover:text-primary-600 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Menu</span>
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {/* Mobile links removed as per request */}
                    </div>
                </div>
            )}
        </header>
    );
}
