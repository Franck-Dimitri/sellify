<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'shop_id',
        'driver_id',
        'customer_name',
        'customer_phone',
        'delivery_address',
        'delivery_landmark',
        'latitude',
        'longitude',
        'city',
        'subtotal',
        'shipping_fee',
        'total_amount',
        'payment_method',
        'payment_status',
        'delivery_status',
        'delivery_otp',
        'delivered_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'delivered_at' => 'datetime',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'SLF-' . date('Y') . '-' . strtoupper(Str::random(6));
            }
            if (empty($order->delivery_otp)) {
                $order->delivery_otp = str_pad(mt_rand(100000, 999999), 6, '0', STR_PAD_LEFT);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function dispute()
    {
        return $this->hasOne(Dispute::class, 'order_id');
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}
