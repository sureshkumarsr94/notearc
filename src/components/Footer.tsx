import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 py-6">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <Link href="/" className="flex items-baseline gap-0.5 group" aria-label="NoteArc - Home">
                    <span className="text-4xl font-black tracking-tighter text-[#FF5733] group-hover:text-[#E64A2E] transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                        N
                    </span>
                    <span className="text-2xl font-bold tracking-tight text-[#FF5733] group-hover:text-[#E64A2E] transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                        otearc
                    </span>
                </Link>

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-gray-500 md:order-3">
                    <span>© {new Date().getFullYear()} NoteArc. All rights reserved.</span>
                    <div className="flex gap-4">
                        <Link href="/privacy-policy" className="hover:text-primary-600 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-conditions" className="hover:text-primary-600 transition-colors">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
