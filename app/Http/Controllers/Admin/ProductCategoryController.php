<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:categories,name',
        ]);

        Category::create($data);

        return redirect()->back(); // atau bisa pakai inertia()->location() jika diperlukan
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->back();
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:categories,name,' . $category->id,
        ]);

        $category->update($data);

        return redirect()->back();
    }
}
