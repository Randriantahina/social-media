<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\User;
use App\Models\Post;

class NewLikeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $liker;
    protected $post;

    public function __construct(User $liker, Post $post)
    {
        $this->liker = $liker;
        $this->post = $post;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'liker_id' => $this->liker->id,
            'liker_name' => $this->liker->name,
            'post_id' => $this->post->id,
            'post_title' => $this->post->title,
            'message' => $this->liker->name . ' liked your post: ' . $this->post->title,
        ];
    }
}