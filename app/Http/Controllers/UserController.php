<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
class UserController extends Controller
{
       public function search(Request $request)
    {
        $query = $request->input('query');
        $users = User::where('name', 'like', "%{$query}%")->get();

        return Inertia::render('Users/Search', [
            'users' => $users,
            'query' => $query,
        ]);
    }
}
