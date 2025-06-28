<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Customer;
use App\Models\PurchaseOrder;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {

        $totalProducts   = Product::count();
        $totalCategories = Category::count();
        $totalSuppliers  = Supplier::count();
        $totalCustomers  = Customer::count();


        $latestProducts  = Product::with('category')
                            ->latest()->take(3)->get();

        $latestCustomers = Customer::latest()
                            ->take(2)->get();


        $recentPurchases = PurchaseOrder::with(['supplier', 'details'])
            ->latest('order_date')
            ->take(5)
            ->get()
            ->map(fn ($po) => [
                'id'       => $po->id,
                'supplier' => $po->supplier?->name ?? '-',

                'invoice'  => 'PO-' . str_pad($po->id, 6, '0', STR_PAD_LEFT),

                'total'    => $po->details
                                 ->sum(fn ($d) => $d->qty * $d->price),
                'date'     => optional($po->order_date)->format('Y-m-d'),
            ]);


        $recentSales = Transaction::with('customer')
            ->where('type', 'sale')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(fn ($tx) => [
                'id'       => $tx->id,
                'customer' => $tx->customer?->name ?? '-',

                'receipt'  => 'TRX-' . str_pad($tx->id, 6, '0', STR_PAD_LEFT),
                'total'    => $tx->total_price,
                'date'     => optional($tx->created_at)->format('Y-m-d') ?: '-',
            ]);

        $salesPerMonth = Transaction::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as total")
        ->where('type', 'sale')
        ->whereNotNull('created_at')
        ->groupBy('month')
        ->orderBy('month', 'asc')
        ->take(6)
        ->get()
        ->map(fn ($row) => [
            'month' => $row->month,
            'total' => (int) $row->total,
        ]);


        return inertia('dashboard', [

            'totalProducts'        => $totalProducts,
            'totalCategories'      => $totalCategories,
            'totalSuppliers'       => $totalSuppliers,
            'totalCustomers'       => $totalCustomers,


            'products'             => $latestProducts,
            'customers'            => $latestCustomers,


            'suppliers'            => Supplier::orderBy('name')->get(),


            'purchaseTransactions' => $recentPurchases,
            'salesTransactions'    => $recentSales,

            'salesChart' => $salesPerMonth,

        ]);
    }
}
