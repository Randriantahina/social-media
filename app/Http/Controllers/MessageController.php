<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(User $user)
    {
        $messages = Message::where(function ($query) use ($user) {
            $query->where('sender_id', Auth::id())
                  ->where('receiver_id', $user->id);
        })->orWhere(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                  ->where('receiver_id', Auth::id());
        })
        ->with('sender:id,name', 'receiver:id,name')
        ->orderBy('created_at', 'asc')
        ->get();

        return Inertia::render('Messages/Show', [
            'messages' => $messages,
            'receiver' => $user,
        ]);
    }

    public function inbox()
    {
        $userId = Auth::id();

        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($message) use ($userId) {
                return $message->sender_id === $userId ? $message->receiver_id : $message->sender_id;
            })
            ->map(function ($messages) {
                $latestMessage = $messages->first();
                $otherUser = $latestMessage->sender_id === Auth::id() ? $latestMessage->receiver : $latestMessage->sender;
                return [
                    'user' => $otherUser,
                    'latest_message' => $latestMessage->message,
                    'latest_message_time' => $latestMessage->created_at->diffForHumans(),
                ];
            })
            ->values(); // Reset keys to be a simple array

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
        ]);
    }

    public function store(Request $request, User $user)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $user->id,
            'message' => $validated['message'],
        ]);

        \App\Events\MessageSent::dispatch($message, Auth::user(), $user);

        return redirect()->back();
    }
}
