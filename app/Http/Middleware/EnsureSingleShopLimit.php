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
            
            // Only block creations (POST/PUT/PATCH) if the limit is reached
            if ($seller && $seller->shops()->exists() && !$request->isMethod('GET') && !$request->isMethod('HEAD')) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Vous possédez déjà une boutique. Le pack Starter ne permet de créer qu\'une seule boutique.'
                    ], 403);
                }
                
                return redirect()->route('seller.shop.index')->with('error', 'Vous possédez déjà une boutique. Le pack Starter ne permet de créer qu\'une seule boutique.');
            }
        }

        return $next($request);
    }
}
