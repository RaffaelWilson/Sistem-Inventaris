<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionUserController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['customer', 'details.product'])
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        $customers = Customer::select('id', 'name')->get();
        $products = Product::select('id', 'name', 'price', 'stock')->get();

        return Inertia::render('User/TransactionManagement', [
            'transactions' => $transactions,
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'created_at' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($data) {
            $total = collect($data['items'])->sum(fn($item) => $item['qty'] * $item['price']);

            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'customer_id' => $data['customer_id'],
                'type' => 'sale',
                'total_price' => $total,
                'created_at' => $data['created_at'],
            ]);

            foreach ($data['items'] as $item) {
                $transaction->details()->create([
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'subtotal' => $item['qty'] * $item['price'],
                ]);
            }
        });

        return redirect()->route('user.transactions.index')->with('success', 'Transaksi berhasil disimpan.');
    }

    public function show($id)
    {
        $transaction = Transaction::with(['customer', 'details.product'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json($transaction);
    }

    public function destroy($id)
    {
        $transaction = Transaction::where('user_id', Auth::id())->findOrFail($id);
        $transaction->details()->delete();
        $transaction->delete();

        return redirect()->route('user.transactions.index')->with('success', 'Transaksi berhasil dihapus.');
    }



}
