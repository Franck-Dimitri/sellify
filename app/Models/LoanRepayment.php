<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanRepayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'amount',
        'escrow_transaction_id',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(SellerLoan::class, 'loan_id');
    }
}
