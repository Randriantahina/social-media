import { useForm, Link } from "@inertiajs/react";

export default function Index({ posts, auth }) {
    const { data, setData, post, processing } = useForm({ content: "" });

    const submit = (e) => {
        e.preventDefault();
        post("/posts");
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Fil d’actualité</h1>

            <form onSubmit={submit} className="mb-6">
                <textarea
                    value={data.content}
                    onChange={(e) => setData("content", e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Exprime-toi..."
                />
                <button
                    disabled={processing}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Publier
                </button>
            </form>

            {posts.map((post) => (
                <div key={post.id} className="mb-4 p-4 border rounded">
                    <p>
                        <b>{post.user.name}</b>: {post.content}
                    </p>
                    <p className="text-sm text-gray-500">
                        {post.comments.length} commentaires •{" "}
                        {post.likes.length} likes
                    </p>
                </div>
            ))}
        </div>
    );
}
