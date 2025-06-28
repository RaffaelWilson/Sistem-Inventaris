<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionHistoryController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['user', 'customer'])
            // ->orderByDesc('created_at')
            // ->get();
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('User/TransactionHistory', [
            'transactions' => $transactions,
        ]);
    }
}
