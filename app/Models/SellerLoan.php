<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SellerLoan extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'amount',
        'interest_rate',
        'duration_months',
        'monthly_payment',
        'total_amount_due',
        'amount_repaid',
        'ai_score_at_approval',
        'status',
        'disbursed_at',
        'contract_pdf_path',
        'signed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'interest_rate' => 'decimal:4',
        'duration_months' => 'integer',
        'monthly_payment' => 'decimal:2',
        'total_amount_due' => 'decimal:2',
        'amount_repaid' => 'decimal:2',
        'ai_score_at_approval' => 'integer',
        'disbursed_at' => 'datetime',
        'signed_at' => 'datetime',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function repayments(): HasMany
    {
        return $this->hasMany(LoanRepayment::class, 'loan_id');
    }
}
