<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KycRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'status',
        'admin_notes',
        'rejection_reason',
        'reviewed_by',
        'submitted_at',
        'reviewed_at',
        'documents_count',
        'approved_documents_count',
        'cni_number',
        'cni_first_name',
        'cni_last_name',
        'cni_dob',
        'cni_pob',
        'cni_issue_date',
        'cni_expiry_date',
        'cni_gender',
        'cni_nationality',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'cni_dob' => 'date',
            'cni_issue_date' => 'date',
            'cni_expiry_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function isPending(): bool
    {
        return in_array($this->status, ['pending', 'under_review']);
    }

    public function getStatusLabel(): string
    {
        return match ($this->status) {
            'pending' => 'En attente',
            'under_review' => 'En cours de revue',
            'approved' => 'Approuvée',
            'rejected' => 'Rejetée',
            default => $this->status,
        };
    }
}
