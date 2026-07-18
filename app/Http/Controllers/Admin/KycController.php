<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KycRequest;
use App\Models\KycDocument;
use App\Services\KycService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Exception;

class KycController extends Controller
{
    protected KycService $kycService;

    public function __construct(KycService $kycService)
    {
        $this->kycService = $kycService;
    }

    /**
     * Display a list of KYC requests.
     */
    public function index(Request $request): InertiaResponse
    {
        $status = $request->input('status', 'pending');
        $type = $request->input('type');

        $requests = KycRequest::with(['user'])
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->orderByDesc('submitted_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Kyc/Index', [
            'kycRequests' => $requests,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    /**
     * Show single KYC request along with user identity documents.
     */
    public function show(int $id): InertiaResponse
    {
        $kycRequest = KycRequest::with(['user.kycDocuments'])->findOrFail($id);

        return Inertia::render('Admin/Kyc/Show', [
            'kycRequest' => $kycRequest,
        ]);
    }

    public function review(Request $request, int $id)
    {
        $rules = [
            'status' => ['required', 'in:approved,rejected'],
            'rejection_reason' => ['required_if:status,rejected', 'nullable', 'string', 'max:500'],
        ];

        if ($request->input('status') === 'approved') {
            $rules = array_merge($rules, [
                'cni_number' => ['required', 'string', 'max:50'],
                'cni_first_name' => ['required', 'string', 'max:255'],
                'cni_last_name' => ['required', 'string', 'max:255'],
                'cni_dob' => ['required', 'date'],
                'cni_pob' => ['required', 'string', 'max:255'],
                'cni_issue_date' => ['required', 'date'],
                'cni_expiry_date' => ['required', 'date', 'after:cni_issue_date'],
                'cni_gender' => ['required', 'in:M,F,other'],
                'cni_nationality' => ['required', 'string', 'max:100'],
            ]);
        }

        $request->validate($rules);

        $kycRequest = KycRequest::findOrFail($id);
        $admin = $request->user();

        $cniDetails = [];
        if ($request->input('status') === 'approved') {
            $cniDetails = $request->only([
                'cni_number',
                'cni_first_name',
                'cni_last_name',
                'cni_dob',
                'cni_pob',
                'cni_issue_date',
                'cni_expiry_date',
                'cni_gender',
                'cni_nationality',
            ]);
        }

        try {
            $this->kycService->reviewKycRequest(
                $kycRequest,
                $request->input('status'),
                $request->input('rejection_reason'),
                $admin,
                $cniDetails
            );

            $statusText = $request->input('status') === 'approved' ? 'approuvé' : 'rejeté';

            return redirect()->route('admin.users.all')
                ->with('success', "Le dossier KYC de {$kycRequest->user->full_name} a été {$statusText}.");

        } catch (Exception $e) {
            return back()->with('error', "Erreur lors du traitement du KYC : " . $e->getMessage());
        }
    }
}
