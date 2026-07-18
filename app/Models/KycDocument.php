<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KycDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'file_path',
        'original_name',
        'mime_type',
        'file_size',
        'status',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
            'file_size' => 'integer',
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

    public function getTypeLabel(): string
    {
        return match ($this->type) {
            'cni' => 'Carte Nationale d\'Identité',
            'passport' => 'Passeport',
            'selfie' => 'Photo Selfie',
            'registre_commerce' => 'Registre de Commerce',
            'permis_conduire' => 'Permis de Conduire',
            'carte_grise' => 'Carte Grise',
            'photo_vehicule' => 'Photo du Véhicule',
            default => ucfirst($this->type),
        };
    }
}
