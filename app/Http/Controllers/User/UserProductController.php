<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')
            ->select('id', 'name', 'stock', 'price', 'category_id', 'minimum_stock_level');

        if ($request->has('category_id') && $request->category_id != 'all') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->paginate(10)->withQueryString();
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('User/ProductList', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only('category_id', 'search'),
        ]);
    }
}
