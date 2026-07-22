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
        'sku',
        'description',
        'price',
        'weight',
        'dimensions',
        'stock',
        'alert_threshold',
        'stock_status',
        'variants',
        'image_paths',
        'is_active',
        'is_archived',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'weight' => 'decimal:2',
        'dimensions' => 'array',
        'stock' => 'integer',
        'alert_threshold' => 'integer',
        'variants' => 'array',
        'image_paths' => 'array',
        'is_active' => 'boolean',
        'is_archived' => 'boolean',
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

    public function activePromotion()
    {
        $today = now()->toDateString();
        return $this->hasOne(Promotion::class)
            ->where('promotions.is_active', true)
            ->where('promotions.start_date', '<=', $today)
            ->where('promotions.end_date', '>=', $today);
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
