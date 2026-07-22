<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'name',
        'slug',
        'slogan',
        'description',
        'logo_path',
        'banner_path',
        'company_name',
        'registration_number',
        'address',
        'phone_contact',
        'email_contact',
        'opening_hours',
        'return_policy',
        'shipping_settings',
        'social_links',
        'theme_color',
        'is_active',
        'is_holiday_mode',
    ];

    protected function casts(): array
    {
        return [
            'opening_hours' => 'array',
            'return_policy' => 'array',
            'shipping_settings' => 'array',
            'social_links' => 'array',
            'is_active' => 'boolean',
            'is_holiday_mode' => 'boolean',
        ];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function promotions(): HasMany
    {
        return $this->hasMany(Promotion::class);
    }

    public function promoCodes(): HasMany
    {
        return $this->hasMany(PromoCode::class);
    }
}
