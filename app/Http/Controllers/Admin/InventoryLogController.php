<?php

// app/Http/Controllers/Admin/InventoryLogController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\Product;
use Illuminate\Http\Request;

class InventoryLogController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryLog::with('product')->orderByDesc('created_at');

        if ($request->search) {
            $query->whereHas('product', fn($q) =>
                $q->where('name', 'like', '%' . $request->search . '%')
            );
        }

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        return inertia('Admin/InventoryLogMonitoring', [
            'logs' => $query->get(),
            'products' => Product::all(),
            'filters' => $request->only('search', 'type')
        ]);
    }
}
