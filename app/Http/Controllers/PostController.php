<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $followingIds = Auth::user()->followings()->pluck('users.id');
        $posts = Post::with('user:id,name', 'comments.user:id,name', 'likes')
            ->whereIn('user_id', $followingIds)
            ->orWhere('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Dashboard', [
            'posts' => $posts,
            'followings' => Auth::user()->followings()->pluck('users.id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        $request->user()->posts()->create([
            'title' => $validated['title'],
            'body' => $validated['body'],
            'image_path' => $imagePath,
        ]);

        return redirect()->route('dashboard');
    }
}