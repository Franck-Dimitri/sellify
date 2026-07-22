<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SmartLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'product_id',
        'title',
        'token',
        'items',
        'price_at_time',
        'subtotal',
        'discount_amount',
        'shipping_fee',
        'total_price',
        'notes',
        'tracking_code',
        'delivery_info',
        'expires_at',
        'status',
        'clicks_count',
        'conversions_count',
        'order_id',
    ];

    protected $casts = [
        'items' => 'array',
        'delivery_info' => 'array',
        'price_at_time' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total_price' => 'decimal:2',
        'expires_at' => 'datetime',
        'clicks_count' => 'integer',
        'conversions_count' => 'integer',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}
