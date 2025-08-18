<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Notifications\NewCommentNotification;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->input('content'),
        ]);

        if ($post->user_id !== $request->user()->id) {
            $post->user->notify(new NewCommentNotification($request->user(), $post, $comment));
        }

        return back();
    }
}
