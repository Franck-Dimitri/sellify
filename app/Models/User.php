<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'role',
        'avatar',
        'kyc_status',
        'kyc_verified_at',
        'email_verified_at',
        'status',
        'is_active',
        'loyalty_points',
        'oauth_provider',
        'oauth_provider_id',
        'last_login_at',
        'last_login_ip',
        'otp_code',
        'otp_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $attributes = [
        'status' => 'active',
        'is_active' => true,
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'kyc_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // ──────────── Accessors ────────────

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    // ──────────── Relations ────────────

    public function seller(): HasOne
    {
        return $this->hasOne(Seller::class);
    }

    public function driver(): HasOne
    {
        return $this->hasOne(Driver::class);
    }

    public function kycDocuments(): HasMany
    {
        return $this->hasMany(KycDocument::class);
    }

    public function kycRequests(): HasMany
    {
        return $this->hasMany(KycRequest::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(ActivityLog::class)->orderByDesc('created_at');
    }

    // ──────────── Helpers ────────────

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'superadmin']);
    }

    public function isSeller(): bool
    {
        return $this->role === 'seller';
    }

    public function isDriver(): bool
    {
        return $this->role === 'driver';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isKycVerified(): bool
    {
        return $this->kyc_status === 'verified';
    }

    public function isAccountActive(): bool
    {
        return $this->status === 'active' && $this->is_active;
    }
}
