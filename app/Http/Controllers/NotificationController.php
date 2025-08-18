<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return inertia('Notifications/Index', [
            'notifications' => Auth::user()->notifications()->paginate(10),
        ]);
    }

    public function markAsRead(Request $request, $notificationId)
    {
        $notification = $request->user()->notifications()->findOrFail($notificationId);
        $notification->markAsRead();

        return back();
    }
}