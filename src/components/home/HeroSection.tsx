'use client';

import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden py-16 md:py-24">
            {/* Animated gradient background */}
            <div className="absolute inset-0 gradient-mesh animate-gradient opacity-80" />

            {/* Floating decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400/20 rounded-full blur-2xl animate-float" />
            <div className="absolute top-1/3 right-20 w-32 h-32 bg-orange-500/15 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl animate-pulse-glow" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-orange-600 mb-8 shadow-lg">
                        <Sparkles className="h-4 w-4" />
                        <span>Curated stories for curious minds</span>
                        <TrendingUp className="h-4 w-4 ml-1" />
                    </div>

                    {/* Main headline */}
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Discover Ideas That
                        <span className="relative inline-block ml-3">
                            <span className="relative z-10 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                                Ignite
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full h-4 text-orange-300" viewBox="0 0 100 12" preserveAspectRatio="none">
                                <path d="M0 8 Q 25 0, 50 8 T 100 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                        Explore insightful articles on personal development, communication, productivity, and the art of living well.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
                        >
                            Start Reading
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/authors"
                            className="inline-flex items-center gap-2 rounded-full glass px-8 py-4 text-lg font-semibold text-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:bg-white/90"
                        >
                            Meet Our Writers
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900">50+</div>
                            <div className="text-sm text-gray-500 mt-1">Articles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900">10+</div>
                            <div className="text-sm text-gray-500 mt-1">Categories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900">5K+</div>
                            <div className="text-sm text-gray-500 mt-1">Readers</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
