import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-100 text-gray-800">
                {/* Header */}
                <header className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="text-2xl font-bold text-blue-600">
                                <Link href="/">SocialApp</Link>
                            </div>
                            <nav>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-semibold text-gray-600 hover:text-gray-900 mr-4"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
                        <span className="block">Connect with friends and</span>
                        <span className="block text-blue-600">share your moments.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                        Join our community and start sharing your life with the world. Follow people who inspire you, and get inspired by others.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex rounded-md shadow">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Get started
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex">
                            <Link
                                href="#features"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                            >
                                Learn more
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Features Section */}
                <section id="features" className="bg-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900">Features</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                                Everything you need to connect and share with your community.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                            <div className="text-center">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                                    {/* Icon placeholder */}
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m11.4-3.397a4 4 0 110-5.292" /></svg>
                                </div>
                                <h3 className="mt-6 text-lg font-medium text-gray-900">Community</h3>
                                <p className="mt-2 text-base text-gray-500">Build and grow your community with powerful tools.</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                                    {/* Icon placeholder */}
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H17z" /></svg>
                                </div>
                                <h3 className="mt-6 text-lg font-medium text-gray-900">Real-time Chat</h3>
                                <p className="mt-2 text-base text-gray-500">Engage with your friends and followers with one-on-one messaging.</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                                    {/* Icon placeholder */}
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="mt-6 text-lg font-medium text-gray-900">Media Sharing</h3>
                                <p className="mt-2 text-base text-gray-500">Share your favorite moments with photos and videos.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-800 text-white">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p>&copy; 2025 SocialApp. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}