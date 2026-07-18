<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Seller;
use App\Models\Driver;
use App\Models\KycRequest;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    /**
     * Show admin dashboard statistics and activities.
     */
    public function index(): InertiaResponse
    {
        // KPIs
        $stats = [
            'total_users' => User::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_sellers' => Seller::count(),
            'verified_sellers' => Seller::where('status', 'approved')->count(),
            'pending_sellers' => Seller::where('status', 'pending')->count(),
            'total_drivers' => Driver::count(),
            'verified_drivers' => Driver::where('status', 'approved')->count(),
            'pending_drivers' => Driver::where('status', 'pending')->count(),
            'pending_kyc_requests' => KycRequest::where('status', 'pending')->count(),
        ];

        // Recent KYC Submissions
        $recentKycSubmissions = KycRequest::with(['user'])
            ->orderByDesc('submitted_at')
            ->limit(5)
            ->get();

        // Recent Activity Logs
        $recentActivities = ActivityLog::with(['user'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentKyc' => $recentKycSubmissions,
            'activities' => $recentActivities,
        ]);
    }
}
