import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Post from '@/Components/Post';

function CreatePostForm({ user }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => {
                reset();
                setImagePreview(null);
            },
            preserveScroll: true,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md sm:rounded-lg">
            <form onSubmit={submit}>
                <div className="flex items-start space-x-4">
                    <img className="h-12 w-12 rounded-full object-cover" src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Profile" />
                    <div className="flex-1">
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder={`What's on your mind, ${user.name}?`}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-24 resize-y"
                        ></textarea>
                    </div>
                </div>

                {errors.body && <p className="mt-2 text-sm text-red-600">{errors.body}</p>}

                {imagePreview && (
                    <div className="mt-4">
                        <img src={imagePreview} alt="Image Preview" className="max-w-xs h-auto rounded-lg shadow-md" />
                    </div>
                )}

                <div className="flex justify-between items-center mt-4">
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}

                    <button
                        type="submit"
                        className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        disabled={processing}
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Dashboard({ auth, posts, followings }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <CreatePostForm user={auth.user} />
                {posts.map(post => (
                    <Post key={post.id} post={post} auth={auth} followings={followings} />
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
