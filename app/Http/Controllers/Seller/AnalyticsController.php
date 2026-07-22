<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Services\RecommendationEngine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AnalyticsController extends Controller
{
    protected RecommendationEngine $recommendationEngine;

    public function __construct(RecommendationEngine $recommendationEngine)
    {
        $this->recommendationEngine = $recommendationEngine;
    }

    /**
     * Display AI Reports, winning products and quality scores.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $report = $this->recommendationEngine->getWinningProducts($seller);

        return Inertia::render('Seller/Analytics/Index', [
            'report' => $report,
        ]);
    }
}
