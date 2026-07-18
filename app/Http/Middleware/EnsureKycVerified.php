<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureKycVerified
{
    /**
     * Handle an incoming request.
     * Note: This middleware is applied to actions. It shouldn't block simple navigation,
     * but we will let controllers check this or block critical write actions.
     * If $request->route() wants to enforce complete block, it redirects or aborts.
     * As per user settings: "peut laisser acces au dahbord, mais pas d'actions majeures sur le dashbord les fonctionnalites critiques lie a son role reste figes"
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // If the user is a seller or driver and has not verified their KYC
        if (in_array($user->role, ['seller', 'driver']) && ! $user->isKycVerified()) {
            // For AJAX/Inertia requests, we can return a flash message or error, but let's check
            // if this is a request to a critical action (POST, PUT, DELETE)
            if ($request->isMethod('post') || $request->isMethod('put') || $request->isMethod('patch') || $request->isMethod('delete')) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Votre compte n\'a pas encore été validé. Cette action est suspendue.'
                    ], 403);
                }
                
                return back()->with('flash', [
                    'type' => 'error',
                    'message' => 'Votre KYC n\'est pas encore validé. Action bloquée.'
                ]);
            }
        }

        return $next($request);
    }
}
