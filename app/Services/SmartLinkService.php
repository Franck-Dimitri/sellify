<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Seller;
use App\Models\SmartLink;
use Illuminate\Support\Str;

class SmartLinkService
{
    /**
     * Generate a unique tracking code (e.g., TRK-8921-9874)
     */
    public function generateTrackingCode(): string
    {
        do {
            $code = 'TRK-' . rand(1000, 9999) . '-' . rand(1000, 9999);
        } while (SmartLink::where('tracking_code', $code)->exists());

        return $code;
    }

    /**
     * Generate a multi-product Smart-Link with advanced config
     */
    public function createMultiProductSmartLink(
        Seller $seller,
        array $items,
        ?string $title = null,
        float $discountAmount = 0,
        float $shippingFee = 0,
        ?string $notes = null,
        int $validityHours = 48
    ): SmartLink {
        $token = strtolower(Str::random(10));

        $subtotal = 0;
        $formattedItems = [];

        foreach ($items as $item) {
            $qty = max(1, (int)($item['quantity'] ?? 1));
            $unitPrice = (float)($item['unit_price'] ?? 0);
            $itemSubtotal = $qty * $unitPrice;
            $subtotal += $itemSubtotal;

            $formattedItems[] = [
                'product_id' => $item['product_id'] ?? null,
                'name' => $item['name'] ?? 'Produit',
                'quantity' => $qty,
                'unit_price' => $unitPrice,
                'total_price' => $itemSubtotal,
                'variant' => $item['variant'] ?? null,
                'image_url' => $item['image_url'] ?? null,
            ];
        }

        $totalPrice = max(0, $subtotal - $discountAmount + $shippingFee);
        $firstProductId = $formattedItems[0]['product_id'] ?? null;

        return SmartLink::create([
            'seller_id' => $seller->id,
            'product_id' => $firstProductId,
            'title' => $title ?: ('Commande #' . strtoupper(Str::random(6))),
            'token' => $token,
            'items' => $formattedItems,
            'price_at_time' => $totalPrice,
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'shipping_fee' => $shippingFee,
            'total_price' => $totalPrice,
            'notes' => $notes,
            'expires_at' => now()->addHours($validityHours),
            'status' => 'active',
            'clicks_count' => 0,
            'conversions_count' => 0,
        ]);
    }

    /**
     * Legacy single product link generator
     */
    public function generateSmartLink(Seller $seller, Product $product, int $validityHours = 48): SmartLink
    {
        $price = $product->active_promotion
            ? (float)$product->active_promotion->promo_price
            : (float)$product->price;

        $items = [
            [
                'product_id' => $product->id,
                'name' => $product->name,
                'quantity' => 1,
                'unit_price' => $price,
                'total_price' => $price,
                'variant' => null,
                'image_url' => is_array($product->images) ? ($product->images[0] ?? null) : null,
            ]
        ];

        return $this->createMultiProductSmartLink(
            seller: $seller,
            items: $items,
            title: $product->name,
            discountAmount: 0,
            shippingFee: 0,
            notes: null,
            validityHours: $validityHours
        );
    }

    /**
     * Validate token for Fast Checkout
     */
    public function validateSmartLink(string $token): ?SmartLink
    {
        $link = SmartLink::with(['product.shop', 'seller.user', 'seller.shops'])->where('token', $token)->first();

        if (!$link) {
            return null;
        }

        if ($link->status !== 'active' || $link->isExpired()) {
            if ($link->status === 'active' && $link->isExpired()) {
                $link->update(['status' => 'expired']);
            }
            return null;
        }

        // Track click
        $link->increment('clicks_count');

        return $link;
    }

    /**
     * Expire old links (> TTL)
     */
    public function expireOldLinks(): int
    {
        return SmartLink::where('status', 'active')
            ->where('expires_at', '<', now())
            ->update(['status' => 'expired']);
    }
}
