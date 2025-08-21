import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Show({ auth, messages: initialMessages, receiver }) {
    const [messages, setMessages] = useState(initialMessages);
    const messagesEndRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const ids = [auth.user.id, receiver.id].sort((a, b) => a - b);
        const channelName = `chat.${ids[0]}.${ids[1]}`;

        const channel = window.Echo.private(channelName);

        const listener = (e) => {
            setMessages((prevMessages) => [...prevMessages, e.message]);
        };

        channel.listen('message.sent', listener);

        return () => {
            channel.stopListening('message.sent', listener);
            window.Echo.leave(channelName);
        };
    }, [auth.user.id, receiver.id]);

    const submitMessage = (e) => {
        e.preventDefault();
        post(route('messages.store', receiver.id), {
            data,
            onSuccess: () => reset('message'),
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chat with {receiver.name}</h2>}
        >
            <Head title={`Chat with ${receiver.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex flex-col h-96 overflow-y-auto mb-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`my-1 p-2 rounded-lg ${
                                            message.sender_id === auth.user.id
                                                ? 'bg-blue-500 text-white self-end'
                                                : 'bg-gray-200 text-gray-800 self-start'
                                        }`}
                                    >
                                        <strong>{message.sender.name}:</strong> {message.message}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={submitMessage} className="flex">
                                <input
                                    type="text"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <button
                                    type="submit"
                                    className="ml-2 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    disabled={processing}
                                >
                                    Send
                                </button>
                            </form>
                            {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}