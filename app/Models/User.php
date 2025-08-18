<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // Un utilisateur peut avoir plusieurs commentaires
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Un utilisateur peut avoir plusieurs likes
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    // Les utilisateurs qui suivent cet utilisateur
    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'followed_id', 'follower_id');
    }

    // Les utilisateurs que cet utilisateur suit
    public function followings()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'followed_id');
    }
}
