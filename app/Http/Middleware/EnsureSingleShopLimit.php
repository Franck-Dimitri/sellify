<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSingleShopLimit
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isSeller()) {
            $seller = $user->seller;
            
            // Starter is limited to 1 shop, Pro is limited to 2 shops
            $maxShops = $seller && $seller->pack === 'pro' ? 2 : 1;
            
            // Only block creations (POST/PUT/PATCH) if the limit is reached
            if ($seller && $seller->shops()->count() >= $maxShops && !$request->isMethod('GET') && !$request->isMethod('HEAD')) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => "Vous possédez déjà {$maxShops} boutique(s). Votre pack actuel ne permet pas d'en créer d'autres."
                    ], 403);
                }
                
                return redirect()->route('seller.shop.index')->with('error', "Vous possédez déjà {$maxShops} boutique(s). Votre pack actuel ne permet pas d'en créer d'autres.");
            }
        }

        return $next($request);
    }
}
