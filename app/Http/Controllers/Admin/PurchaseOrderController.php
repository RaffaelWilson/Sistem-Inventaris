<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        return inertia('Admin/PurchaseOrderManagement', [
            'orders' => PurchaseOrder::with('supplier', 'user', 'details.product')
                ->orderByDesc('order_date')
                ->get(),
            'suppliers' => Supplier::select('id', 'name')->get(),
            'products' => Product::select('id', 'name')->get(),
        ]);
    }

    public function show(PurchaseOrder $purchase_order)
    {
        return inertia('Admin/PurchaseOrderDetail', [
            'order' => $purchase_order->load('supplier', 'user', 'details.product')
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'status' => 'required|in:draft,received,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($data) {
            $po = PurchaseOrder::create([
                'supplier_id' => $data['supplier_id'],
                'user_id' => Auth::id(),
                'order_date' => $data['order_date'],
                'status' => $data['status'],
            ]);

            foreach ($data['items'] as $item) {
                PurchaseOrderDetail::create([
                    'purchase_order_id' => $po->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                ]);
            }
        });

        return redirect()->route('purchase.index')->with('success', 'Purchase Order berhasil dibuat.');
    }

    public function update(Request $request, PurchaseOrder $purchase_order)
    {
        $data = $request->validate([
            'status' => 'required|in:draft,received,cancelled',
        ]);

        $purchase_order->update([
            'status' => $data['status'],
        ]);

        return back()->with('success', 'Status Purchase Order diperbarui.');
    }

    public function destroy(PurchaseOrder $purchase_order)
    {
        $purchase_order->delete();
        return back()->with('success', 'Purchase Order dihapus.');
    }
}
