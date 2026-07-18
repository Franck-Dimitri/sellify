<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Seller;
use App\Models\Driver;
use App\Models\KycRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Exception;

class UserController extends Controller
{
    /**
     * Display a global list of users with search and filter.
     */
    public function all(Request $request): InertiaResponse
    {
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status');

        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => User::count(),
            'active' => User::where('status', 'active')->count(),
            'pending_kyc' => KycRequest::where('status', 'pending')->count(),
            'sellers' => User::where('role', 'seller')->count(),
            'drivers' => User::where('role', 'driver')->count(),
            'customers' => User::where('role', 'customer')->count(),
        ];

        // Fetch pending requests with documents count
        $pendingRequests = KycRequest::with(['user.kycDocuments'])
            ->where('status', 'pending')
            ->orderByDesc('submitted_at')
            ->get();

        return Inertia::render('Admin/Users/All', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
            'stats' => $stats,
            'pendingRequests' => $pendingRequests,
        ]);
    }

    /**
     * Display sellers list with status filters and search.
     */
    public function sellers(Request $request): InertiaResponse
    {
        $search = $request->input('search');
        $status = $request->input('status'); // approved, pending, rejected

        $query = User::where('role', 'seller')
            ->with(['seller', 'kycRequests']);

        if ($status) {
            $query->whereHas('seller', function ($q) use ($status) {
                $q->where('status', $status);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $sellers = $query->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => User::where('role', 'seller')->count(),
            'approved' => Seller::where('status', 'approved')->count(),
            'pending' => Seller::where('status', 'pending')->count(),
            'rejected' => Seller::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Users/Sellers', [
            'sellers' => $sellers,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display drivers list with status filters and search.
     */
    public function drivers(Request $request): InertiaResponse
    {
        $search = $request->input('search');
        $status = $request->input('status'); // approved, pending, rejected

        $query = User::where('role', 'driver')
            ->with(['driver', 'kycRequests']);

        if ($status) {
            $query->whereHas('driver', function ($q) use ($status) {
                $q->where('status', $status);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $drivers = $query->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => User::where('role', 'driver')->count(),
            'approved' => Driver::where('status', 'approved')->count(),
            'pending' => Driver::where('status', 'pending')->count(),
            'rejected' => Driver::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Users/Drivers', [
            'drivers' => $drivers,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display customers list with status filters and search.
     */
    public function customers(Request $request): InertiaResponse
    {
        $search = $request->input('search');
        $status = $request->input('status'); // active, suspended, banned

        $query = User::where('role', 'customer');

        if ($status) {
            if ($status === 'inactive') {
                $query->whereIn('status', ['suspended', 'banned']);
            } else {
                $query->where('status', $status);
            }
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => User::where('role', 'customer')->count(),
            'active' => User::where('role', 'customer')->where('status', 'active')->count(),
            'inactive' => User::where('role', 'customer')->whereIn('status', ['suspended', 'banned'])->count(),
        ];

        return Inertia::render('Admin/Users/Customers', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display admins list.
     */
    public function admins(Request $request): InertiaResponse
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = User::whereIn('role', ['admin', 'superadmin']);

        if ($status) {
            if ($status === 'inactive') {
                $query->whereIn('status', ['suspended', 'banned']);
            } else {
                $query->where('status', $status);
            }
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $admins = $query->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => User::whereIn('role', ['admin', 'superadmin'])->count(),
            'active' => User::whereIn('role', ['admin', 'superadmin'])->where('status', 'active')->count(),
            'inactive' => User::whereIn('role', ['admin', 'superadmin'])->whereIn('status', ['suspended', 'banned'])->count(),
        ];

        return Inertia::render('Admin/Users/Admins', [
            'admins' => $admins,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display blocked users list.
     */
    public function blocked(Request $request): InertiaResponse
    {
        $search = $request->input('search');
        $status = $request->input('status'); // suspended, banned

        $query = User::whereIn('status', ['suspended', 'banned']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => User::whereIn('status', ['suspended', 'banned'])->count(),
            'suspended' => User::where('status', 'suspended')->count(),
            'banned' => User::where('status', 'banned')->count(),
        ];

        return Inertia::render('Admin/Users/Blocked', [
            'users' => $users,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }


    /**
     * Display a single user details with profile (Seller/Driver) and activity logs.
     */
    public function show(int $id): InertiaResponse
    {
        $user = User::with(['seller.reviewer', 'driver.reviewer', 'kycDocuments.reviewer', 'kycRequests', 'activities'])
            ->findOrFail($id);

        return Inertia::render('Admin/Users/Show', [
            'targetUser' => $user,
        ]);
    }

    /**
     * Suspend a user.
     */
    public function suspend(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $admin = $request->user();

        $user->update([
            'status' => 'suspended',
            'is_active' => false,
        ]);

        ActivityLog::log(
            $user->id,
            'account_suspended',
            "Compte suspendu par l'administrateur {$admin->full_name}.",
            ['admin_id' => $admin->id]
        );

        return back()->with('success', "Le compte de {$user->full_name} a été suspendu.");
    }

    /**
     * Unsuspend / Activate a user.
     */
    public function activate(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $admin = $request->user();

        $user->update([
            'status' => 'active',
            'is_active' => true,
        ]);

        ActivityLog::log(
            $user->id,
            'account_activated',
            "Compte activé par l'administrateur {$admin->full_name}.",
            ['admin_id' => $admin->id]
        );

        return back()->with('success', "Le compte de {$user->full_name} a été activé.");
    }

    /**
     * Ban a user.
     */
    public function ban(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $admin = $request->user();

        $user->update([
            'status' => 'banned',
            'is_active' => false,
        ]);

        ActivityLog::log(
            $user->id,
            'account_banned',
            "Compte banni par l'administrateur {$admin->full_name}.",
            ['admin_id' => $admin->id]
        );

        return back()->with('success', "Le compte de {$user->full_name} a été banni.");
    }
}
