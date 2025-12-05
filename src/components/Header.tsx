"use client";

import Link from 'next/link';
import { Menu, X, LogIn, LogOut, User, Users, Bookmark, ChevronDown, Sparkles, BookOpen, PenTool } from 'lucide-react';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { useSession, signIn, signOut } from "next-auth/react";

const navLinks = [
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Authors', href: '/authors', icon: PenTool },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { data: session } = useSession();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setIsProfileMenuOpen(false);
        };
        if (isProfileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isProfileMenuOpen]);

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
                : 'bg-white/60 backdrop-blur-md'
            }`}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-baseline gap-0.5 group" aria-label="NoteArc Home">
                        <span className="text-4xl font-black tracking-tighter bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-amber-500 transition-all duration-300" style={{ fontFamily: 'var(--font-outfit)' }}>
                            N
                        </span>
                        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-amber-500 transition-all duration-300" style={{ fontFamily: 'var(--font-outfit)' }}>
                            otearc
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200"
                            >
                                <link.icon className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="hidden sm:block">
                        <SearchBar />
                    </div>

                    {/* Auth Section */}
                    {session ? (
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-all duration-200 ${isProfileMenuOpen
                                        ? 'bg-orange-50 ring-2 ring-orange-200'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-8 w-8 rounded-full ring-2 ring-white shadow-sm"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                )}
                                <span className="hidden md:block text-sm font-medium text-gray-700">
                                    {session.user?.name?.split(' ')[0]}
                                </span>
                                <ChevronDown className={`hidden md:block h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200/50">
                                        {/* User Info */}
                                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {session.user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {session.user?.email}
                                            </p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            <Link
                                                href="/saved"
                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
                                                    <Bookmark className="h-4 w-4 text-orange-600" />
                                                </div>
                                                <span>Saved Stories</span>
                                            </Link>
                                            <Link
                                                href="/following"
                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                                                    <Users className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span>Following</span>
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="p-2 border-t border-gray-100">
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                                                    <LogOut className="h-4 w-4" />
                                                </div>
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="hidden md:flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>Get Started</span>
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="container mx-auto px-4 py-4">
                        {/* Mobile Search */}
                        <div className="mb-4 sm:hidden">
                            <SearchBar />
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="space-y-1 mb-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100">
                                        <link.icon className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Auth Section */}
                        <div className="pt-4 border-t border-gray-100">
                            {session ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        {session.user?.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                className="h-10 w-10 rounded-full ring-2 ring-orange-200"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900">{session.user?.name}</p>
                                            <p className="text-sm text-gray-500">{session.user?.email}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href="/saved"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Bookmark className="h-5 w-5 text-orange-500" />
                                        <span>Saved Stories</span>
                                    </Link>

                                    <Link
                                        href="/following"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Users className="h-5 w-5 text-blue-500" />
                                        <span>Following</span>
                                    </Link>

                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn('google')}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/25"
                                >
                                    <Sparkles className="h-5 w-5" />
                                    <span>Get Started</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
