<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'image_paths',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'image_paths' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = ['active_promotion'];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function promotions(): HasMany
    {
        return $this->hasMany(Promotion::class);
    }

    /**
     * Get the active promotion for this product.
     */
    public function getActivePromotionAttribute()
    {
        $today = now()->toDateString();
        return $this->promotions()
            ->where('is_active', true)
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->orderBy('discount_percentage', 'desc')
            ->first();
    }
}
