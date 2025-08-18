import { router } from '@inertiajs/react';

export default function FollowButton({ user, followings }) {
    const isFollowing = followings.includes(user.id);

    const handleFollow = () => {
        if (isFollowing) {
            router.delete(route('users.unfollow', user.id), { preserveScroll: true });
        } else {
            router.post(route('users.follow', user.id), {}, { preserveScroll: true });
        }
    };

    return (
        <button
            onClick={handleFollow}
            className={`px-4 py-2 text-sm font-bold text-white rounded-full ${isFollowing ? 'bg-red-500' : 'bg-blue-500'}`}>
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    );
}
