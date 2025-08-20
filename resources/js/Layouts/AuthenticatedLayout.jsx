import { Link, usePage, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [unreadMessagesCount, setUnreadMessagesCount] = useState(auth.unread_messages_count);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(auth.unread_notifications_count);

    useEffect(() => {
        if (user) {
            // Listen for notifications
            window.Echo.private(`App.Models.User.${user.id}`)
                .notification((notification) => {
                    setUnreadNotificationsCount(prevCount => prevCount + 1);
                });

            // Listen for new messages to update the count
            // Note: This requires a more complex channel setup to listen to all incoming messages
            // For now, we will rely on the initial count and page reloads.
            // A more advanced implementation would be a dedicated "new-message-count" channel.
        }

        // Cleanup
        return () => {
            if (user) {
                window.Echo.leave(`App.Models.User.${user.id}`);
            }
        };
    }, [user]);


    // Barre de recherche
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("users.search"),
            { query: searchQuery },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // State and logic for chat modal
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        message: "",
    });

    const openChatModal = (friend) => {
        setSelectedFriend(friend);
        setShowChatModal(true);
    };

    const closeChatModal = () => {
        setShowChatModal(false);
        reset();
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!selectedFriend) return;
        post(route("messages.store", selectedFriend.id), {
            onSuccess: () => closeChatModal(),
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Search */}
                        <div className="flex items-center space-x-4">
                            <Link href={route("dashboard")}>
                                <h1 className="text-2xl font-bold text-blue-600">
                                    SocialApp
                                </h1>
                            </Link>
                            <form
                                onSubmit={handleSearch}
                                className="relative hidden md:block"
                            >
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500"
                                />
                                <svg
                                    className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </form>
                        </div>

                        {/* Main Navigation Icons */}
                        <div className="flex items-center space-x-8">
                            <Link
                                href={route("dashboard")}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <svg
                                    className="w-7 h-7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href={route("messages.index")}
                                className="relative text-gray-600 hover:text-blue-600"
                            >
                                <svg
                                    className="w-7 h-7"
                                    xmlns="http://www.w3.org/2000/svg"
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
                                {auth.unread_messages_count > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                                        {auth.unread_messages_count}
                                    </span>
                                )}
                            </Link>
                            <Link
                                href={route("notifications.index")}
                                className="relative text-gray-600 hover:text-blue-600"
                            >
                                <svg
                                    className="w-7 h-7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                {auth.unread_notifications_count > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                                        {auth.unread_notifications_count}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="flex items-center">
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={
                                        user.avatar ||
                                        `https://ui-avatars.com/api/?name=${user.name}&background=random`
                                    }
                                    alt="Profile"
                                />
                                <span>{user.name}</span>
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="ml-4 text-gray-600 hover:text-blue-600"
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
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Sidebar */}
                    <aside className="col-span-3 hidden lg:block">
                        <div className="sticky top-20">
                            <div className="p-4 bg-white rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4">
                                    Navigation
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-md"
                                        >
                                            <span className="font-medium">
                                                My Profile
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-md"
                                        >
                                            <span className="font-medium">
                                                Friends
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-md"
                                        >
                                            <span className="font-medium">
                                                Groups
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-md"
                                        >
                                            <span className="font-medium">
                                                Events
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Center Feed */}
                    <div className="col-span-12 lg:col-span-6">{children}</div>

                    {/* Right Sidebar */}
                    <aside className="col-span-3 hidden lg:block">
                        <div className="sticky top-20">
                            <div className="p-4 bg-white rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-4">
                                    Contacts
                                </h3>
                                <div className="space-y-3">
                                    {(auth.friends?.length ?? 0) > 0 ? (
                                        auth.friends.map((friend) => (
                                            <div
                                                key={friend.id}
                                                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={
                                                            friend.avatar ||
                                                            `https://ui-avatars.com/api/?name=${friend.name}&background=random`
                                                        }
                                                        alt={friend.name}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                    <span className="font-medium text-gray-800">
                                                        {friend.name}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => openChatModal(friend)}
                                                    className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                                    title="Message"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 8h10M7 12h4m1 8l-5-5H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2h-3l-5 5z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            Vous n'avez aucun ami pour le moment.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Modal show={showChatModal} onClose={closeChatModal}>
                <form onSubmit={sendMessage} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Envoyer un message à {selectedFriend?.name}
                    </h2>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="message"
                            value="Message"
                            className="sr-only"
                        />

                        <textarea
                            id="message"
                            name="message"
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="5"
                            placeholder="Votre message..."
                        ></textarea>

                        <InputError message={errors.message} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Envoyer
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
