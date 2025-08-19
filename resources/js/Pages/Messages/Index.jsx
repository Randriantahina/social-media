import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, conversations }) {
    return (
        <AuthenticatedLayout>
            <Head title="Messages" />

            <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Your Conversations</h3>
                    {conversations.length > 0 ? (
                        <ul>
                            {conversations.map((conversation) => (
                                <li key={conversation.user.id} className="border-b border-gray-200 last:border-b-0">
                                    <Link href={route('messages.show', conversation.user.id)} className="flex items-center p-4 hover:bg-gray-50">
                                        <div className="flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={conversation.user.avatar || `https://ui-avatars.com/api/?name=${conversation.user.name}&background=random`} alt={conversation.user.name} />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="text-sm font-medium text-gray-900">{conversation.user.name}</div>
                                            <div className="text-sm text-gray-500 truncate">{conversation.latest_message}</div>
                                        </div>
                                        <div className="text-xs text-gray-400">{conversation.latest_message_time}</div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">You don't have any conversations yet.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
