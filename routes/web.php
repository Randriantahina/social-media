<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [PostController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Recherche d'amis
    Route::get('/users/search', [App\Http\Controllers\UserController::class, 'search'])->name('users.search');
    Route::get('/users/{user}', [ProfileController::class, 'show'])->name('profile.show');

    // Posts
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');

    // Comments
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');

    // Likes
    Route::post('/posts/{post}/likes', [LikeController::class, 'store'])->name('likes.store');
    Route::delete('/posts/{post}/likes', [LikeController::class, 'destroy'])->name('likes.destroy');

    // Follows
    Route::post('/users/{user}/follow', [FollowController::class, 'store'])->name('users.follow');
    Route::delete('/users/{user}/follow', [FollowController::class, 'destroy'])->name('users.unfollow');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    // Messages
    Route::get('/messages', [App\Http\Controllers\MessageController::class, 'inbox'])->name('messages.index'); // New route for messages inbox
    Route::get('/messages/{user}', [App\Http\Controllers\MessageController::class, 'index'])->name('messages.show');
    Route::post('/messages/{user}', [App\Http\Controllers\MessageController::class, 'store'])->name('messages.store');
});

require __DIR__.'/auth.php';
