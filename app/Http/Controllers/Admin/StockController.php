<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index()
    {
        return inertia('Admin/StockManagement', [
            'products' => Product::select('id', 'name', 'stock', 'minimum_stock_level')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $product->update(['stock' => $data['stock']]);

        // Jika request dari JavaScript (AJAX/axios), kirim response JSON
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Stok berhasil diperbarui']);
        }

        return redirect()->back();
    }

}
