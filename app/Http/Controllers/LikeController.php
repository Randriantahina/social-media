<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Notifications\NewLikeNotification;

class LikeController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $like = $post->likes()->create([
            'user_id' => $request->user()->id,
        ]);

        if ($post->user_id !== $request->user()->id) {
            $post->user->notify(new NewLikeNotification($request->user(), $post));
        }

        return back();
    }

    public function destroy(Request $request, Post $post)
    {
        $post->likes()->where('user_id', $request->user()->id)->delete();

        return back();
    }
}
