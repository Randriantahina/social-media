import { useForm, router, Link } from "@inertiajs/react";
import { useState } from "react";
import FollowButton from "./FollowButton";
import Modal from "./Modal";
import Dropdown from "./Dropdown";

export default function Post({ post, auth, followings }) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const {
        data,
        setData,
        post: commentPost,
        processing,
        errors,
        reset,
    } = useForm({
        content: "",
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: editReset,
    } = useForm({
        body: post.body,
        image: null,
    });

    const [editImagePreview, setEditImagePreview] = useState(
        post.image_path ? `/storage/${post.image_path}` : null,
    );

    const submitComment = (e) => {
        e.preventDefault();
        commentPost(route("comments.store", post.id), {
            onSuccess: () => {
                reset("content");
                setShowCommentModal(false);
            },
            preserveScroll: true,
        });
    };

    const handleLike = () => {
        const isLiked = post.likes.some(
            (like) => like.user_id === auth.user.id,
        );
        if (isLiked) {
            router.delete(route("likes.destroy", post.id), {
                preserveScroll: true,
            });
        } else {
            router.post(
                route("likes.store", post.id),
                {},
                { preserveScroll: true },
            );
        }
    };

    const handleEdit = () => {
        setEditData({ body: post.body, image: null });
        setEditImagePreview(
            post.image_path ? `/storage/${post.image_path}` : null,
        );
        setShowEditModal(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        // Use POST method with _method spoofing for file uploads
        router.post(
            route("posts.update", post.id),
            { ...editData, _method: "patch" },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    editReset();
                    setEditImagePreview(null);
                },
                preserveScroll: true,
            },
        );
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        setEditData("image", file);
        if (file) {
            setEditImagePreview(URL.createObjectURL(file));
        } else {
            setEditImagePreview(null);
        }
    };

    const isLiked = post.likes.some((like) => like.user_id === auth.user.id);

    return (
        <div className="bg-white shadow-md rounded-lg mb-6">
            {/* Post Header */}
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                            post.user.avatar ||
                            `https://ui-avatars.com/api/?name=${post.user.name}&background=random`
                        }
                        alt={post.user.name}
                    />
                    <div className="ml-3">
                        <Link
                            href={route("profile.show", post.user.id)}
                            className="font-bold text-gray-800 hover:underline"
                        >
                            {post.user.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    {post.user.id !== auth.user.id && (
                        <FollowButton
                            user={post.user}
                            followings={followings}
                        />
                    )}
                    {post.user.id === auth.user.id && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="text-gray-500 hover:text-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 12h.01M12 12h.01M19 12h.01"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <button
                                    onClick={handleEdit}
                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() =>
                                        router.delete(
                                            route("posts.destroy", post.id),
                                            { preserveScroll: true },
                                        )
                                    }
                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Delete
                                </button>
                            </Dropdown.Content>
                        </Dropdown>
                    )}
                </div>
            </div>

            {/* Post Body */}
            <div className="px-4 pb-2">
                <p className="text-gray-800">{post.body}</p>
            </div>
            {post.image_path && post.image_path !== "0" && (
                <div className="w-full bg-black">
                    <img
                        src={`/storage/${post.image_path}`}
                        alt="Post image"
                        className="w-full max-h-[70vh] object-contain"
                    />
                </div>
            )}

            {/* Post Stats */}
            <div className="p-4 flex justify-between items-center text-sm text-gray-500">
                <div>{post.likes.length} Likes</div>
                <div>{post.comments.length} Comments</div>
            </div>

            {/* Post Actions */}
            <div className="border-t border-gray-200">
                <div className="flex justify-around">
                    <button
                        onClick={handleLike}
                        className={`flex-1 flex justify-center items-center p-2 space-x-2 rounded-bl-lg hover:bg-gray-100 ${isLiked ? "text-blue-600" : "text-gray-600"}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.437V10m6-4h2a2 2 0 012 2v2h-4V6zM7 10V6a2 2 0 012-2h2a2 2 0 012 2v4H7z"
                            />
                        </svg>
                        <span className="font-semibold">Like</span>
                    </button>
                    <button
                        onClick={() => setShowCommentModal(true)}
                        className="flex-1 flex justify-center items-center p-2 space-x-2 hover:bg-gray-100 text-gray-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span className="font-semibold">Comment</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {post.comments.length > 0 && (
                <div className="p-4 space-y-4 bg-gray-50">
                    {post.comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex items-start space-x-3"
                        >
                            <img
                                className="h-8 w-8 rounded-full object-cover"
                                src={
                                    comment.user.avatar ||
                                    `https://ui-avatars.com/api/?name=${comment.user.name}&background=random`
                                }
                                alt={comment.user.name}
                            />
                            <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                                <Link
                                    href={route(
                                        "profile.show",
                                        comment.user.id,
                                    )}
                                    className="font-bold text-gray-800 hover:underline"
                                >
                                    {comment.user.name}
                                </Link>
                                <p className="text-sm text-gray-700">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Comment Modal */}
            <Modal
                show={showCommentModal}
                onClose={() => setShowCommentModal(false)}
            >
                <form onSubmit={submitComment} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Write a Comment
                    </h2>
                    <textarea
                        value={data.content}
                        onChange={(e) => setData("content", e.target.value)}
                        placeholder="Write your comment here..."
                        className="mt-4 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    ></textarea>
                    {errors.content && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.content}
                        </p>
                    )}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
                            onClick={() => setShowCommentModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            disabled={processing}
                        >
                            Comment
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Post Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Edit Post
                    </h2>
                    <textarea
                        value={editData.body}
                        onChange={(e) => setEditData("body", e.target.value)}
                        placeholder="What's on your mind?"
                        className="mt-4 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    ></textarea>
                    {editErrors.body && (
                        <p className="mt-2 text-sm text-red-600">
                            {editErrors.body}
                        </p>
                    )}
                    <input
                        type="file"
                        onChange={handleEditImageChange}
                        className="block w-full mt-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {editErrors.image && (
                        <p className="mt-2 text-sm text-red-600">
                            {editErrors.image}
                        </p>
                    )}
                    {editImagePreview && (
                        <div className="mt-4">
                            <img
                                src={editImagePreview}
                                alt="Image Preview"
                                className="max-w-xs h-auto rounded-lg shadow-md"
                            />
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            disabled={editProcessing}
                        >
                            Update
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
