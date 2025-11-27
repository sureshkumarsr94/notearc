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
                    <Link href="/" className="flex items-baseline gap-0.5 group">
                        <span className="text-4xl font-black tracking-tighter text-[#FF5733] group-hover:text-[#E64A2E] transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                            N
                        </span>
                        <span className="text-2xl font-bold tracking-tight text-[#FF5733] group-hover:text-[#E64A2E] transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                            otearc
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
