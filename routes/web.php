<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InventoryLogController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PurchaseOrderController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\User\TransactionHistoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\CustomerController;
use App\Http\Controllers\User\TransactionUserController;
use App\Http\Controllers\User\UserProductController;
use App\Http\Controllers\User\UserProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Login');
})->name('home');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () { 
    // Route::get('/dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');

    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');


    Route::get('/admin/product-management', [ProductController::class, 'index'])->name('product.index');
    Route::post('/admin/product', [ProductController::class, 'store'])->name('product.store');
    Route::delete('/admin/product/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
    Route::put('/admin/product/{product}', [ProductController::class, 'update'])->name('product.update');

    Route::post('/admin/category', [ProductCategoryController::class, 'store'])->name('category.store');
    Route::put('/admin/category/{category}', [ProductCategoryController::class, 'update'])->name('category.update');
    Route::delete('/admin/category/{category}', [ProductCategoryController::class, 'destroy'])->name('category.destroy');

    Route::get('/admin/stock-management', [StockController::class, 'index'])->name('stock.index');
    Route::put('/admin/stock/{product}', [StockController::class, 'update'])->name('stock.update');


    Route::get('/admin/supplier-management', [SupplierController::class, 'index'])->name('supplier.index');
    Route::post('/admin/supplier', [SupplierController::class, 'store'])->name('supplier.store');
    Route::put('/admin/supplier/{supplier}', [SupplierController::class, 'update'])->name('supplier.update');
    Route::delete('/admin/supplier/{supplier}', [SupplierController::class, 'destroy'])->name('supplier.destroy');


    Route::get('/admin/purchase-orders', [PurchaseOrderController::class, 'index'])->name('purchase.index');
    Route::post('/admin/purchase-orders', [PurchaseOrderController::class, 'store'])->name('purchase.store');
    Route::get('/admin/purchase-orders/{purchase_order}', [PurchaseOrderController::class, 'show'])->name('purchase.show');
    Route::put('/admin/purchase-orders/{purchase_order}', [PurchaseOrderController::class, 'update'])->name('purchase.update');
    Route::delete('/admin/purchase-orders/{purchase_order}', [PurchaseOrderController::class, 'destroy'])->name('purchase.destroy');


    Route::get('/admin/transactions', [TransactionController::class, 'index'])->name('transaction.index');
    Route::post('/admin/transactions', [TransactionController::class, 'store'])->name('transaction.store');
    Route::get('/admin/transactions/{transaction}', [TransactionController::class, 'show'])->name('transaction.show');
    Route::put('/admin/transactions/{transaction}', [TransactionController::class, 'update'])->name('transaction.update');
    Route::delete('/admin/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transaction.destroy');

    Route::get('/admin/inventory-logs', [InventoryLogController::class, 'index'])->name('inventory.logs');

    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
});


Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/user/products', [UserProductController::class, 'index'])->name('user.products.index');
    Route::get('/user/transactions', [TransactionUserController::class, 'index'])->name('user.transactions.index');
    Route::post('/user/transactions', [TransactionUserController::class, 'store'])->name('user.transactions.store');
    Route::get('/user/transactions/{id}', [TransactionUserController::class, 'show'])->name('user.transactions.show');
    Route::delete('/user/transactions/{id}', [TransactionUserController::class, 'destroy'])->name('user.transactions.destroy');

    Route::get('/user/transaction-history', [TransactionHistoryController::class, 'index'])->name('transaction.history');

    Route::get('/user/my-profile', [UserProfileController::class, 'index'])->name('user.profile');
    Route::put('/user/my-profile', [UserProfileController::class, 'update'])->name('user.profile.update');

    Route::get('/user/customers', [CustomerController::class, 'index'])->name('user.customers.index');
    Route::post('/user/customers', [CustomerController::class, 'store'])->name('user.customers.store');
    Route::put('/user/customers/{customer}', [CustomerController::class, 'update'])->name('user.customers.update');
    Route::delete('/user/customers/{customer}', [CustomerController::class, 'destroy'])->name('user.customers.destroy');
});


Route::post('/api/login', [AuthController::class, 'login'])->name('api.login');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

