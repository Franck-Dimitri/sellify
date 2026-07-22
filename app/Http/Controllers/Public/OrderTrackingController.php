<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SmartLink;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class OrderTrackingController extends Controller
{
    /**
     * Display public parcel tracking page for guest customers without login
     */
    public function show(string $tracking_code): InertiaResponse
    {
        $smartLink = SmartLink::with(['seller.shops', 'product'])
            ->where('tracking_code', $tracking_code)
            ->first();

        if (!$smartLink) {
            return Inertia::render('Public/OrderTracking', [
                'found' => false,
                'trackingCode' => $tracking_code,
            ]);
        }

        $shop = $smartLink->product ? $smartLink->product->shop : ($smartLink->seller->shops()->first() ?? null);

        return Inertia::render('Public/OrderTracking', [
            'found' => true,
            'trackingCode' => $tracking_code,
            'smartLink' => $smartLink,
            'shop' => $shop,
            'seller' => $smartLink->seller,
            'deliveryInfo' => $smartLink->delivery_info,
        ]);
    }
}
