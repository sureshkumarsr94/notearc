'use client';

import {
    Lightbulb,
    MessageCircle,
    Target,
    Wallet,
    Heart,
    Briefcase,
    BookOpen,
    Zap,
    Users,
    Compass
} from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Personal Development', slug: 'personal-development', icon: Lightbulb, color: 'from-violet-500 to-purple-600' },
    { name: 'Communication', slug: 'communication', icon: MessageCircle, color: 'from-blue-500 to-cyan-500' },
    { name: 'Productivity', slug: 'productivity', icon: Target, color: 'from-green-500 to-emerald-600' },
    { name: 'Finance', slug: 'finance', icon: Wallet, color: 'from-amber-500 to-orange-600' },
    { name: 'Lifestyle', slug: 'lifestyle', icon: Heart, color: 'from-pink-500 to-rose-600' },
    { name: 'Career', slug: 'career', icon: Briefcase, color: 'from-slate-600 to-gray-700' },
    { name: 'Learning', slug: 'learning', icon: BookOpen, color: 'from-indigo-500 to-blue-600' },
    { name: 'Motivation', slug: 'motivation', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { name: 'Relationships', slug: 'relationships', icon: Users, color: 'from-red-500 to-pink-600' },
    { name: 'Explore', slug: '', icon: Compass, color: 'from-teal-500 to-cyan-600' },
];

export default function CategoryList() {
    return (
        <section className="py-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                    Browse by Topic
                </h2>
                <p className="text-gray-500 mt-1">Find stories that match your interests</p>
            </div>

            {/* Scrollable container */}
            <div className="relative -mx-4 px-4">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.slug || 'explore'}
                                href={category.slug ? `/topic/${category.slug}` : '/blog'}
                                className="group flex-shrink-0 flex items-center gap-3 rounded-2xl bg-white border border-gray-100 px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-transparent hover:-translate-y-1"
                            >
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-gray-900 whitespace-nowrap">
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Gradient fade on edges */}
                <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-gray-50/80 to-transparent pointer-events-none" />
            </div>
        </section>
    );
}
