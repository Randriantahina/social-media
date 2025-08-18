<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Notifications\NewFollowerNotification;

class FollowController extends Controller
{
    public function store(Request $request, User $user)
    {
        $request->user()->followings()->attach($user);

        $user->notify(new NewFollowerNotification($request->user()));

        return back();
    }

    public function destroy(Request $request, User $user)
    {
        $request->user()->followings()->detach($user);

        return back();
    }
}
