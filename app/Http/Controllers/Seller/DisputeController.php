<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Dispute;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DisputeController extends Controller
{
    /**
     * List disputes for the logged-in seller.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $disputes = Dispute::where('seller_id', $seller->id)
            ->with('client')
            ->latest()
            ->get();

        return Inertia::render('Seller/Disputes/Index', [
            'disputes' => $disputes,
        ]);
    }

    /**
     * Submit defense evidence for a dispute.
     */
    public function submitDefense(Request $request, Dispute $dispute): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller || $dispute->seller_id !== $seller->id) {
            abort(403);
        }

        $validated = $request->validate([
            'seller_defense_text' => 'required|string|min:10',
            'evidences' => 'nullable|array',
            'evidences.*' => 'file|mimes:jpeg,png,jpg,pdf|max:5120',
        ]);

        $evidencePaths = $dispute->seller_evidence_paths ?? [];
        if ($request->hasFile('evidences')) {
            foreach ($request->file('evidences') as $file) {
                $evidencePaths[] = $file->store('disputes/evidence', 'public');
            }
        }

        $dispute->update([
            'seller_defense_text' => $validated['seller_defense_text'],
            'seller_evidence_paths' => $evidencePaths,
            'seller_responded_at' => now(),
            'status' => 'under_review',
        ]);

        ActivityLog::log(
            $request->user()->id,
            'dispute_defense_submitted',
            "Soumission de preuves de défense pour le litige #{$dispute->id}."
        );

        return redirect()->route('seller.disputes.index')
            ->with('success', 'Vos preuves de défense ont été transmises à l\'équipe d\'arbitrage Admin.');
    }
}
