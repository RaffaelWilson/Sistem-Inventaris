<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'stock',
        'price',
        'category_id',
        'minimum_stock_level'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
