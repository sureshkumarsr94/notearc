export const metadata = {
    title: 'Terms & Conditions | NoteArc',
    description: 'Terms and Conditions for NoteArc',
};

export default function TermsAndConditions() {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6 max-w-4xl">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Terms & Conditions
            </h1>
            <div className="prose prose-lg prose-orange max-w-none text-gray-600">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Agreement to Terms</h2>
                <p>
                    These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and NoteArc ("we," "us" or "our"), concerning your access to and use of the NoteArc website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>

                <h2>2. Intellectual Property Rights</h2>
                <p>
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
                </p>

                <h2>3. User Representations</h2>
                <p>
                    By using the Site, you represent and warrant that:
                </p>
                <ul>
                    <li>All registration information you submit will be true, accurate, current, and complete.</li>
                    <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                    <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
                    <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                </ul>

                <h2>4. Prohibited Activities</h2>
                <p>
                    You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                </p>

                <h2>5. Site Management</h2>
                <p>
                    We reserve the right, but not the obligation, to:
                </p>
                <ul>
                    <li>Monitor the Site for violations of these Terms and Conditions.</li>
                    <li>Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms and Conditions.</li>
                    <li>In our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof.</li>
                </ul>

                <h2>6. Modifications and Interruptions</h2>
                <p>
                    We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
                </p>

                <h2>7. Governing Law</h2>
                <p>
                    These Terms shall be governed by and defined following the laws of India. NoteArc and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                </p>

                <h2>8. Contact Us</h2>
                <p>
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: contact@notearc.info
                </p>
            </div>
        </div>
    );
}
