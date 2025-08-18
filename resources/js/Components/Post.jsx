import { useForm, router, Link } from '@inertiajs/react';
import FollowButton from './FollowButton';

export default function Post({ post, auth, followings }) {
    const { data, setData, post: commentPost, processing, errors, reset } = useForm({
        content: '',
    });

    const submitComment = (e) => {
        e.preventDefault();
        commentPost(route('comments.store', post.id), {
            data,
            onSuccess: () => reset('content'),
            preserveScroll: true,
        });
    };

    const handleLike = () => {
        const isLiked = post.likes.some(like => like.user_id === auth.user.id);

        if (isLiked) {
            router.delete(route('likes.destroy', post.id), { preserveScroll: true });
        } else {
            router.post(route('likes.store', post.id), {}, { preserveScroll: true });
        }
    };

    const isLiked = post.likes.some(like => like.user_id === auth.user.id);

    return (
        <div className="p-6 mt-6 bg-white shadow-sm sm:rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="font-bold">
                        <Link href={route('profile.show', post.user.id)}>{post.user.name}</Link>
                    </div>
                    <div className="ml-2 text-sm text-gray-600">{new Date(post.created_at).toLocaleString()}</div>
                </div>
                {post.user.id !== auth.user.id && (
                    <FollowButton user={post.user} followings={followings} />
                )}
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold">{post.title}</h3>
                {post.image_path && <img src={`/storage/${post.image_path}`} alt={post.title} className="object-cover w-full mt-4 rounded-lg" />}
                <p className="mt-4">{post.body}</p>
            </div>

            <div className="flex items-center mt-4">
                <button onClick={handleLike} className={`mr-4 ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}>
                    {isLiked ? 'Unlike' : 'Like'} ({post.likes.length})
                </button>
            </div>

            <div className="mt-4">
                {post.comments.map(comment => (
                    <div key={comment.id} className="p-2 mt-2 bg-gray-100 rounded-lg">
                        <div className="font-bold">{comment.user.name}</div>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={submitComment} className="mt-4">
                <textarea
                    value={data.content}
                    onChange={e => setData('content', e.target.value)}
                    placeholder="Write a comment..."
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
                <button type="submit" className="px-4 py-2 mt-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700" disabled={processing}>
                    Comment
                </button>
            </form>
        </div>
    );
}