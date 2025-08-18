import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Post from '@/Components/Post';

function CreatePostForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
            <form onSubmit={submit}>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Title"
                    className="block w-full mb-4 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}

                <textarea
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    placeholder="What's on your mind?"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
                {errors.body && <p className="mt-2 text-sm text-red-600">{errors.body}</p>}

                <input
                    type="file"
                    onChange={(e) => setData('image', e.target.files[0])}
                    className="block w-full mt-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}

                <button
                    type="submit"
                    className="px-4 py-2 mt-4 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    disabled={processing}
                >
                    Post
                </button>
            </form>
        </div>
    );
}

export default function Dashboard({ auth, posts, followings }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <CreatePostForm />
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