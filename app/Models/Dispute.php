<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'seller_id',
        'client_id',
        'reason',
        'status',
        'seller_defense_text',
        'seller_evidence_paths',
        'resolution_notes',
        'seller_responded_at',
        'resolved_at',
    ];

    protected $casts = [
        'seller_evidence_paths' => 'array',
        'seller_responded_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
