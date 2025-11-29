"use client";

import Link from 'next/link';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './SearchBar';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();

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

                    {session ? (
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-8 w-8 rounded-full border border-gray-200"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-700">
                                    {session.user?.name?.split(' ')[0]}
                                </span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="hidden md:flex items-center gap-2 rounded-full bg-[#FF5733] px-4 py-2 text-sm font-medium text-white hover:bg-[#E64A2E] transition-colors shadow-sm hover:shadow-md"
                        >
                            <LogIn className="h-4 w-4" />
                            <span>Sign In</span>
                        </button>
                    )}

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
                        <div className="pt-4 border-t border-gray-100">
                            {session ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {session.user?.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                className="h-8 w-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-gray-600" />
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-900">{session.user?.name}</span>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn('google')}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF5733] px-4 py-2 text-sm font-medium text-white hover:bg-[#E64A2E]"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Sign In</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
