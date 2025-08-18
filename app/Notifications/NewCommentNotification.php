<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;

class NewCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $commenter;
    protected $post;
    protected $comment;

    public function __construct(User $commenter, Post $post, Comment $comment)
    {
        $this->commenter = $commenter;
        $this->post = $post;
        $this->comment = $comment;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'commenter_id' => $this->commenter->id,
            'commenter_name' => $this->commenter->name,
            'post_id' => $this->post->id,
            'post_title' => $this->post->title,
            'comment_id' => $this->comment->id,
            'message' => $this->commenter->name . ' commented on your post: ' . $this->post->title,
        ];
    }
}