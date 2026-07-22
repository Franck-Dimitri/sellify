<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'pack_id',
        'status',
        'started_at',
        'expires_at',
        'next_billing_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
        'next_billing_at' => 'datetime',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function pack(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPack::class, 'pack_id');
    }
}
