<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'monthly_price',
        'commission_rate_min',
        'commission_rate_max',
        'max_products',
        'features',
    ];

    protected $casts = [
        'monthly_price' => 'decimal:2',
        'commission_rate_min' => 'decimal:2',
        'commission_rate_max' => 'decimal:2',
        'max_products' => 'integer',
        'features' => 'array',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(SellerSubscription::class, 'pack_id');
    }
}
