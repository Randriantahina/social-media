import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ auth, notifications }) {
    const markAsRead = (notification) => {
        router.post(route('notifications.read', notification.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Notifications</h2>}
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-2xl font-bold">Your Notifications</h3>
                            <div className="mt-6">
                                {notifications.data.map(notification => (
                                    <div key={notification.id} className={`p-4 mt-4 rounded-lg ${notification.read_at ? 'bg-gray-100' : 'bg-blue-100'}`}>
                                        <div className="flex items-center justify-between">
                                            <p>{notification.data.message}</p>
                                            {!notification.read_at && (
                                                <button onClick={() => markAsRead(notification)} className="text-sm text-blue-600">Mark as read</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
