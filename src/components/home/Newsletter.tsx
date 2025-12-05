'use client';

import { Mail, Sparkles, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

    useEffect(() => {
        // Fetch subscriber count on mount
        fetch('/api/subscribe')
            .then(res => res.json())
            .then(data => {
                if (data.count) {
                    setSubscriberCount(data.count);
                }
            })
            .catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setEmail('');
                // Update count if successfully subscribed
                if (data.success || data.resubscribed) {
                    setSubscriberCount(prev => (prev || 0) + 1);
                }
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }

        // Reset status after 5 seconds
        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 5000);
    };

    const displayCount = subscriberCount !== null
        ? subscriberCount >= 1000
            ? `${(subscriberCount / 1000).toFixed(1)}K+`
            : `${subscriberCount}+`
        : '5,000+';

    return (
        <section className="py-16 md:py-20">
            <div className="relative rounded-3xl overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative px-6 py-16 md:px-12 md:py-20 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2 text-sm font-medium text-orange-300 mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span>Join {displayCount} readers</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Get insights delivered to your inbox
                    </h2>
                    <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                        Subscribe to our newsletter and never miss an inspiring story. No spam, just quality content.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-2xl border-0 bg-white/10 pl-14 pr-36 py-5 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                                disabled={status === 'loading'}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading' || !email}
                                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Subscribe</span>
                                        <Send className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Status message */}
                        {message && (
                            <div className={`mt-4 flex items-center justify-center gap-2 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {status === 'success' ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <span>{message}</span>
                            </div>
                        )}
                    </form>

                    <p className="text-sm text-gray-500 mt-4">
                        By subscribing, you agree to our Privacy Policy
                    </p>
                </div>
            </div>
        </section>
    );
}
