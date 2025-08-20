import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function Index({ auth, notifications }) {
    const markAsRead = (notification) => {
        router.post(
            route("notifications.read", notification.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    notification.read_at = new Date().toISOString();
                },
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

            <div className="bg-white shadow-md sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h3 className="text-2xl font-bold mb-6">
                        Your Notifications
                    </h3>
                    <div className="space-y-4">
                        {notifications.data.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg flex items-center justify-between ${notification.read_at ? "bg-gray-50" : "bg-blue-50"}`}
                            >
                                <div className="flex items-center">
                                    {/* You can add an icon here based on notification type */}
                                    <p
                                        className={`${notification.read_at ? "text-gray-600" : "text-blue-800"}`}
                                    >
                                        {notification.data.message}
                                    </p>
                                </div>
                                {!notification.read_at && (
                                    <button
                                        onClick={() => markAsRead(notification)}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        ))}
                        {notifications.data.length === 0 && (
                            <p className="text-gray-500">
                                You don't have any notifications yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
