"use client";

import Link from 'next/link';
import { Menu, X, LogIn, LogOut, User, Users, Bookmark } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './SearchBar';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
                    <SearchBar />
                </div>
                <div className="flex items-center gap-4">


                    {session ? (
                        <div className="hidden md:flex items-center gap-2 relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-2 hover:bg-gray-50 rounded-full pr-2 transition-colors"
                            >
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
                            </button>

                            {isProfileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {session.user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/saved"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Bookmark className="h-4 w-4" />
                                        <span>Saved Stories</span>
                                    </Link>
                                    <Link
                                        href="/following"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Users className="h-4 w-4" />
                                        <span>Following</span>
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
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
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Menu</span>
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
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
                                        onClick={() => signOut({ callbackUrl: '/' })}
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
