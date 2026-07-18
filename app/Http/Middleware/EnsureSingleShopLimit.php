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
            
            // Check if seller already has a shop
            if ($seller && $seller->shop()->exists()) {
                if ($request->isMethod('post')) {
                    if ($request->expectsJson()) {
                        return response()->json([
                            'message' => 'Vous possédez déjà une boutique. Le pack Starter ne permet de créer qu\'une seule boutique.'
                        ], 403);
                    }
                    
                    return back()->with('error', 'Vous possédez déjà une boutique. Le pack Starter ne permet de créer qu\'une seule boutique.');
                }
                
                return redirect()->route('seller.dashboard')->with('error', 'Vous possédez déjà une boutique. Le pack Starter ne permet de créer qu\'une seule boutique.');
            }
        }

        return $next($request);
    }
}
