<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Product;
use App\Models\Customer;
use App\Models\InventoryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        return inertia('Admin/TransactionManagement', [
            'transactions' => Transaction::with(['user', 'customer', 'details'])->orderByDesc('created_at')->get(),
            'customers' => Customer::all(),
            'products' => Product::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'type' => 'required|in:purchase,sale',
            'created_at' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($data) {
            $total = collect($data['items'])->sum(fn ($item) => $item['qty'] * $item['price']);

            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'customer_id' => $data['customer_id'],
                'type' => $data['type'],
                'total_price' => $total,
                'created_at' => $data['created_at'],
            ]);

            foreach ($data['items'] as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'subtotal' => $item['qty'] * $item['price'],
                ]);

                $product = Product::find($item['product_id']);
                $change = $data['type'] === 'sale' ? -$item['qty'] : $item['qty'];
                $product->increment('stock', $change);

                InventoryLog::create([
                    'product_id' => $item['product_id'],
                    'change' => $change,
                    'type' => $data['type'] === 'sale' ? 'out' : 'in',
                    'reference' => 'TX-' . $transaction->id,
                    'created_at' => now(),
                ]);
            }
        });

        return redirect()->route('transaction.index')->with('success', 'Transaksi berhasil disimpan.');
    }

    public function update(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'type' => 'required|in:purchase,sale',
            'created_at' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($transaction, $data) {
            // Restore stock before deleting old details
            foreach ($transaction->details as $detail) {
                $product = Product::find($detail->product_id);
                $change = $transaction->type === 'sale' ? $detail->qty : -$detail->qty;
                $product->increment('stock', $change);
            }

            $transaction->details()->delete();
            InventoryLog::where('reference', 'TX-' . $transaction->id)->delete();

            $total = collect($data['items'])->sum(fn ($item) => $item['qty'] * $item['price']);

            $transaction->update([
                'customer_id' => $data['customer_id'],
                'type' => $data['type'],
                'total_price' => $total,
                'created_at' => $data['created_at'],
            ]);

            foreach ($data['items'] as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'subtotal' => $item['qty'] * $item['price'],
                ]);

                $product = Product::find($item['product_id']);
                $change = $data['type'] === 'sale' ? -$item['qty'] : $item['qty'];
                $product->increment('stock', $change);

                InventoryLog::create([
                    'product_id' => $item['product_id'],
                    'change' => $change,
                    'type' => $data['type'] === 'sale' ? 'out' : 'in',
                    'reference' => 'TX-' . $transaction->id,
                    'created_at' => now(),
                ]);
            }
        });

        return redirect()->route('transaction.index')->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function show(Transaction $transaction)
    {
        return inertia('Admin/TransactionDetail', [
            'transaction' => $transaction->load('user', 'customer', 'details.product')
        ]);
    }

    public function destroy(Transaction $transaction)
    {
        DB::transaction(function () use ($transaction) {
            // Restore stock before deletion
            foreach ($transaction->details as $detail) {
                $product = Product::find($detail->product_id);
                $change = $transaction->type === 'sale' ? $detail->qty : -$detail->qty;
                $product->increment('stock', $change);
            }

            $transaction->details()->delete();
            InventoryLog::where('reference', 'TX-' . $transaction->id)->delete();
            $transaction->delete();
        });

        return back()->with('success', 'Transaksi berhasil dihapus.');
    }
}
