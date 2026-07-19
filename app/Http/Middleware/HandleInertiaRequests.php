<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        if ($user) {
            // Load relations if they exist
            $user->loadMissing(['seller.shops', 'driver']);
        }

        $sidebarCounts = null;
        if ($user && in_array($user->role, ['admin', 'superadmin'])) {
            $sidebarCounts = [
                'sellers' => \App\Models\User::where('role', 'seller')->count(),
                'drivers' => \App\Models\User::where('role', 'driver')->count(),
                'customers' => \App\Models\User::where('role', 'customer')->count(),
                'admins' => \App\Models\User::whereIn('role', ['admin', 'superadmin'])->count(),
                'blocked' => \App\Models\User::whereIn('status', ['suspended', 'banned'])->count(),
                'all' => \App\Models\User::count(),
            ];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'sidebar_counts' => $sidebarCounts,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
