import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Post from '@/Components/Post';
import FollowButton from '@/Components/FollowButton';

export default function Show({ auth, profile_user, posts, followings }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{profile_user.name}'s Profile</h2>}
        >
            <Head title={`${profile_user.name}'s Profile`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold">{profile_user.name}</h3>
                                <div className="mt-2 text-sm text-gray-600">
                                    <span>{profile_user.followers_count} Followers</span>
                                    <span className="ml-4">{profile_user.followings_count} Following</span>
                                </div>
                            </div>
                            {auth.user.id !== profile_user.id && (
                                <div className="flex items-center space-x-2">
                                    <FollowButton user={profile_user} followings={followings} />
                                    <Link
                                        href={route('messages.show', profile_user.id)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Message
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        {posts.map(post => (
                            <Post key={post.id} post={post} auth={auth} followings={followings} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
