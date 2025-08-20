<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
            'body' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');

        }

        $request->user()->posts()->create([
            'body' => $validated['body'],
            'image_path' => $imagePath,
        ]);

        return redirect()->route('dashboard');
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post); // Assuming a PostPolicy exists for authorization

        $post->delete();

        return redirect()->route('dashboard');
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'body' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($post->image_path) {
                Storage::disk('public')->delete($post->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('posts', 'public');
        } else {
            // If no new image, retain existing image_path or set to null if it was removed
            $validated['image_path'] = $post->image_path;
        }

        $post->update($validated);

        return redirect()->route('dashboard');
    }
}
