<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\KycController as AdminKycController;
use App\Http\Controllers\Admin\KycDocumentController as AdminKycDocumentController;
use App\Http\Controllers\Seller\ShopController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\PromotionController;
use App\Http\Controllers\Seller\InventoryController;
use App\Http\Controllers\Seller\SubscriptionController;
use App\Http\Controllers\Seller\WalletController;
use App\Http\Controllers\Seller\SmartLinkController;
use App\Http\Controllers\Seller\SellifyPayController;
use App\Http\Controllers\Seller\AnalyticsController;
use App\Http\Controllers\Seller\DisputeController;
use App\Http\Controllers\Public\SmartLinkCheckoutController;
use App\Http\Controllers\Public\OrderTrackingController;
use App\Http\Controllers\Public\StoreController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Seller\PromoCodeController;
use App\Http\Controllers\AiChatController;
use Inertia\Inertia;

// ─────────────────────────────────────────────────────────────────────────────
// Routes Publiques
// ─────────────────────────────────────────────────────────────────────────────

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/store', [StoreController::class, 'indexProducts'])->name('public.products.index');
Route::get('/produit/{slug}', [StoreController::class, 'showProduct'])->name('public.products.show');
Route::get('/boutiques', [StoreController::class, 'indexShops'])->name('public.shops.index');
Route::get('/api/search/suggestions', [StoreController::class, 'searchSuggestions'])->name('public.search.suggestions');

Route::get('/boutique/{slug}', [ShopController::class, 'showPublic'])->name('shop.public');
Route::post('/boutique/checkout/direct', [ShopController::class, 'directCheckout'])->name('shop.direct_checkout');

// Public Shopping Cart Routes
Route::get('/cart', [\App\Http\Controllers\Public\CartController::class, 'index'])->name('public.cart.index');
Route::post('/cart/add', [\App\Http\Controllers\Public\CartController::class, 'add'])->name('public.cart.add');
Route::post('/cart/update/{id}', [\App\Http\Controllers\Public\CartController::class, 'update'])->name('public.cart.update');
Route::delete('/cart/remove/{id}', [\App\Http\Controllers\Public\CartController::class, 'remove'])->name('public.cart.remove');
Route::post('/cart/clear', [\App\Http\Controllers\Public\CartController::class, 'clear'])->name('public.cart.clear');

// Public Checkout Routes
Route::get('/checkout', [\App\Http\Controllers\Public\CheckoutController::class, 'show'])->name('public.checkout.index');
Route::post('/checkout/process', [\App\Http\Controllers\Public\CheckoutController::class, 'process'])->name('public.checkout.process');
Route::post('/checkout/promo/apply', [\App\Http\Controllers\Public\CheckoutController::class, 'applyPromoCode'])->name('public.checkout.promo.apply');
Route::post('/checkout/promo/remove', [\App\Http\Controllers\Public\CheckoutController::class, 'removePromoCode'])->name('public.checkout.promo.remove');

// Fast Checkout via Smart-Link
Route::get('/pay/{token}', [SmartLinkCheckoutController::class, 'show'])->name('smartlink.checkout');
Route::post('/pay/{token}', [SmartLinkCheckoutController::class, 'processPayment'])->name('smartlink.pay');

// Suivi de colis public sans compte
Route::get('/track/{tracking_code}', [OrderTrackingController::class, 'show'])->name('public.order_tracking');

// ─────────────────────────────────────────────────────────────────────────────
// Routes Invité (Guest Auth)
// ─────────────────────────────────────────────────────────────────────────────

Route::middleware('guest')->group(function () {
    // Inscription
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);

    // Connexion
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    // Réinitialisation de mot de passe
    Route::get('/forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendLink'])->name('password.email');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.update');
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes Protégées (Auth & Compte Actif)
// ─────────────────────────────────────────────────────────────────────────────

Route::middleware(['auth', 'account.active'])->group(function () {
    
    // Déconnexion
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Routes de vérification OTP
    Route::get('/verify-email', [OtpController::class, 'show'])->name('otp.show');
    Route::post('/verify-email/confirm', [OtpController::class, 'verify'])->name('otp.verify');
    Route::post('/verify-email/resend', [OtpController::class, 'resend'])->name('otp.resend');

    // Routes nécessitant la vérification OTP
    Route::middleware('otp.verified')->group(function () {
        
        // Page temporaire / Dashboard d'attente pour KYC non validé (si redirection nécessaire)
        Route::get('/kyc/pending', function () {
            $user = auth()->user();
            if ($user->isKycVerified()) {
                return redirect()->route($user->role . '.dashboard');
            }
            return Inertia::render('Auth/PendingVerification');
        })->name('kyc.pending');

        // ─────────────────────────────────────────────────────────────────────────
        // Espace Administration
        // ─────────────────────────────────────────────────────────────────────────
        Route::middleware('role:admin,superadmin')->prefix('admin')->name('admin.')->group(function () {
            // Dashboard principal
            Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

            // Gestion des utilisateurs
            Route::get('/users', function () {
                return redirect()->route('admin.users.all');
            })->name('users.index');
            Route::get('/users/all', [AdminUserController::class, 'all'])->name('users.all');
            Route::get('/users/sellers', [AdminUserController::class, 'sellers'])->name('users.sellers');
            Route::get('/users/drivers', [AdminUserController::class, 'drivers'])->name('users.drivers');
            Route::get('/users/customers', [AdminUserController::class, 'customers'])->name('users.customers');
            Route::get('/users/admins', [AdminUserController::class, 'admins'])->name('users.admins');
            Route::get('/users/blocked', [AdminUserController::class, 'blocked'])->name('users.blocked');

            Route::get('/users/{id}', [AdminUserController::class, 'show'])->name('users.show');
            Route::post('/users/{id}/suspend', [AdminUserController::class, 'suspend'])->name('users.suspend');
            Route::post('/users/{id}/activate', [AdminUserController::class, 'activate'])->name('users.activate');
            Route::post('/users/{id}/ban', [AdminUserController::class, 'ban'])->name('users.ban');

            // Revue KYC
            Route::get('/kyc', [AdminKycController::class, 'index'])->name('kyc.index');
            Route::get('/kyc/{id}', [AdminKycController::class, 'show'])->name('kyc.show');
            Route::post('/kyc/{id}/review', [AdminKycController::class, 'review'])->name('kyc.review');

            // Fichiers KYC sécurisés
            Route::get('/kyc/document/{id}', [AdminKycDocumentController::class, 'show'])->name('kyc.document.show');

            // Arbitrage des litiges par l'admin
            Route::post('/disputes/{dispute}/resolve', [\App\Http\Controllers\Admin\DashboardController::class, 'resolveDispute'])->name('disputes.resolve');

            // Commandes globales & Séquestre Escrow
            Route::get('/orders', [\App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
            Route::get('/orders/{order_number}', [\App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
            Route::get('/escrow', [\App\Http\Controllers\Admin\OrderController::class, 'escrow'])->name('escrow.index');
            Route::get('/escrow/{order_number}', [\App\Http\Controllers\Admin\OrderController::class, 'escrowShow'])->name('escrow.show');
            Route::post('/escrow/{order_number}/release', [\App\Http\Controllers\Admin\OrderController::class, 'forceReleaseEscrow'])->name('escrow.release');
            Route::post('/escrow/{order_number}/refund', [\App\Http\Controllers\Admin\OrderController::class, 'forceRefundEscrow'])->name('escrow.refund');
            Route::post('/escrow/{order_number}/lock', [\App\Http\Controllers\Admin\OrderController::class, 'lockEscrow'])->name('escrow.lock');

            // Moderation globale des boutiques
            Route::get('/shops', [\App\Http\Controllers\Admin\ShopController::class, 'index'])->name('shops.index');
            Route::get('/shops/{shop}', [\App\Http\Controllers\Admin\ShopController::class, 'show'])->name('shops.show');
            Route::post('/shops/{shop}/activate', [\App\Http\Controllers\Admin\ShopController::class, 'activate'])->name('shops.activate');
            Route::post('/shops/{shop}/suspend', [\App\Http\Controllers\Admin\ShopController::class, 'suspend'])->name('shops.suspend');
        });

        // ─────────────────────────────────────────────────────────────────────────
        // Espace Vendeur (Dashboard & Actions)
        // ─────────────────────────────────────────────────────────────────────────
        Route::middleware('role:seller')->prefix('seller')->name('seller.')->group(function () {
            // Dashboard vendeur
            Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
                $seller = $request->user()->seller;
                $shops = $seller ? $seller->shops()->with('products.promotions')->get() : collect();
                $shopIds = $shops->pluck('id');
                
                $totalStock = $seller ? $seller->totalStock() : 0;
                $totalProducts = $shops->reduce(fn($sum, $s) => $sum + $s->products->where('is_archived', false)->count(), 0);
                
                // Real dynamic orders from all seller shops
                $recentOrders = \App\Models\Order::whereIn('shop_id', $shopIds)
                    ->with(['shop:id,name,slug', 'items'])
                    ->latest()
                    ->take(8)
                    ->get();

                $totalRevenue = \App\Models\Order::whereIn('shop_id', $shopIds)
                    ->whereIn('payment_status', ['escrow_held', 'released'])
                    ->sum('total_amount');

                $pendingOrdersCount = \App\Models\Order::whereIn('shop_id', $shopIds)
                    ->whereIn('delivery_status', ['pending', 'preparing'])
                    ->count();

                $deliveredOrdersCount = \App\Models\Order::whereIn('shop_id', $shopIds)
                    ->where('delivery_status', 'delivered')
                    ->count();

                $logs = \App\Models\ActivityLog::where('user_id', $request->user()->id)
                    ->latest()
                    ->take(10)
                    ->get();

                return Inertia::render('Seller/Dashboard', [
                    'shopsData' => $shops,
                    'totalStock' => $totalStock,
                    'totalProducts' => $totalProducts,
                    'totalRevenue' => (float)$totalRevenue,
                    'pendingOrdersCount' => $pendingOrdersCount,
                    'deliveredOrdersCount' => $deliveredOrdersCount,
                    'recentOrders' => $recentOrders,
                    'activityLogs' => $logs,
                ]);
            })->name('dashboard');

            // Actions liées à la boutique, restreintes par le KYC
            Route::middleware('kyc.verified')->group(function () {
                // Central shop list and management
                Route::get('/shops', [ShopController::class, 'index'])->name('shop.index');
                Route::delete('/shop/{shop:slug}', [ShopController::class, 'destroy'])->name('shop.destroy');

                // Central Orders Management
                Route::get('/orders', [SellerOrderController::class, 'index'])->name('orders.index');
                Route::get('/orders/{order_number}', [SellerOrderController::class, 'show'])->name('orders.show');
                Route::post('/orders/{order_number}/status', [SellerOrderController::class, 'updateStatus'])->name('orders.status');
                Route::get('/orders/{order_number}/print', [SellerOrderController::class, 'printSlip'])->name('orders.print');

                // Central promotions (consolidated view) & Promo Codes
                Route::get('/promotions', [PromotionController::class, 'globalIndex'])->name('promotions.global');
                Route::get('/promo-codes', [PromoCodeController::class, 'index'])->name('promocodes.index');
                Route::post('/promo-codes', [PromoCodeController::class, 'store'])->name('promocodes.store');
                Route::delete('/promo-codes/{promoCode}', [PromoCodeController::class, 'destroy'])->name('promocodes.destroy');

                // Inventaire
                Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
                Route::post('/inventory/batch', [InventoryController::class, 'updateBatch'])->name('inventory.batch');

                // Abonnements SaaS
                Route::get('/subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
                Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgrade'])->name('subscription.upgrade');

                // Portefeuille & Retraits
                Route::get('/wallet', [WalletController::class, 'index'])->name('wallet.index');
                Route::post('/wallet/withdraw', [WalletController::class, 'requestWithdrawal'])->name('wallet.withdraw');

                // Smart-Links
                Route::get('/smart-links', [SmartLinkController::class, 'index'])->name('smart_links.index');
                Route::post('/smart-links', [SmartLinkController::class, 'store'])->name('smart_links.store');

                // SellifyPay (Micro-prêts)
                Route::get('/loans', [SellifyPayController::class, 'index'])->name('loans.index');
                Route::post('/loans/request', [SellifyPayController::class, 'requestLoan'])->name('loans.request');

                // Analytics & Rapports IA
                Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

                // Litiges (Vendeur)
                Route::get('/disputes', [DisputeController::class, 'index'])->name('disputes.index');
                Route::post('/disputes/{dispute}/defense', [DisputeController::class, 'submitDefense'])->name('disputes.defense');

                // Central shop creation
                Route::get('/shop/create', [ShopController::class, 'create'])->middleware('shop.limit')->name('shop.create');
                Route::post('/shop', [ShopController::class, 'store'])->middleware('shop.limit')->name('shop.store');

                // Local shop management (isolated by slug)
                Route::prefix('shop/{shop:slug}')->name('shop.')->group(function () {
                    Route::get('/dashboard', [ShopController::class, 'localDashboard'])->name('dashboard');
                    Route::get('/edit', [ShopController::class, 'edit'])->name('edit');
                    Route::post('/update', [ShopController::class, 'update'])->name('update');

                    // Products management
                    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
                    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
                    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
                    Route::get('/products/{product:slug}/edit', [ProductController::class, 'edit'])->name('products.edit');
                    Route::post('/products/{product:slug}/update', [ProductController::class, 'update'])->name('products.update');
                    Route::post('/products/{product:slug}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
                    Route::post('/products/{product:slug}/archive', [ProductController::class, 'archive'])->name('products.archive');
                    Route::delete('/products/{product:slug}', [ProductController::class, 'destroy'])->name('products.destroy');

                    // Promotions management
                    Route::get('/promotions', [PromotionController::class, 'index'])->name('promotions.index');
                    Route::post('/promotions', [PromotionController::class, 'store'])->name('promotions.store');
                    Route::delete('/promotions/{promotion}', [PromotionController::class, 'destroy'])->name('promotions.destroy');
                });
            });
        });

        // Chatbot IA Flottant
        Route::post('/ai/chat', [AiChatController::class, 'handle'])->name('ai.chat');

        // ─────────────────────────────────────────────────────────────────────────
        // Espace Client (Commandes, Suivi OTP, Litiges & Confirmation Escrow)
        // ─────────────────────────────────────────────────────────────────────────
        Route::prefix('customer')->name('customer.')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'dashboard'])->name('dashboard');
            Route::get('/orders', [\App\Http\Controllers\Customer\OrderController::class, 'index'])->name('orders.index');
            Route::get('/orders/{order_number}', [\App\Http\Controllers\Customer\OrderController::class, 'show'])->name('orders.show');
            Route::get('/orders/{order_number}/invoice', [\App\Http\Controllers\Customer\OrderController::class, 'invoice'])->name('orders.invoice');
            Route::post('/orders/{order_number}/reorder', [\App\Http\Controllers\Customer\OrderController::class, 'reorder'])->name('orders.reorder');
            Route::post('/orders/{order_number}/confirm', [\App\Http\Controllers\Customer\OrderController::class, 'confirmDelivery'])->name('orders.confirm');
            Route::post('/orders/{order_number}/cancel', [\App\Http\Controllers\Customer\OrderController::class, 'cancelOrder'])->name('orders.cancel');
            Route::post('/orders/{order_number}/review', [\App\Http\Controllers\Customer\OrderController::class, 'submitReview'])->name('orders.review');
            Route::post('/orders/{order_number}/dispute', [\App\Http\Controllers\Customer\OrderController::class, 'openDispute'])->name('orders.dispute');
            Route::get('/wishlist', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'wishlist'])->name('wishlist');
            Route::post('/wishlist/toggle/{product}', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'toggleWishlist'])->name('wishlist.toggle');
            Route::get('/notifications', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'notifications'])->name('notifications');
            Route::post('/notifications/mark-read', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'markNotificationsRead'])->name('notifications.read');
            Route::get('/referral', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'referral'])->name('referral');
            Route::get('/settings', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'settings'])->name('settings');
            Route::post('/settings', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'updateSettings'])->name('settings.update');
            Route::get('/disputes', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'disputes'])->name('disputes.index');
            Route::get('/loyalty', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'loyalty'])->name('loyalty');
            Route::get('/profile', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'profile'])->name('profile');
            Route::post('/profile', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'updateProfile'])->name('profile.update');
            Route::get('/addresses', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'addresses'])->name('addresses.index');
            Route::post('/addresses', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'storeAddress'])->name('addresses.store');
            Route::post('/addresses/{address}/update', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'updateAddress'])->name('addresses.update');
            Route::delete('/addresses/{address}', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'destroyAddress'])->name('addresses.destroy');
            Route::post('/addresses/{address}/default', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'setDefaultAddress'])->name('addresses.default');
            Route::post('/settings/sessions/terminate-others', [\App\Http\Controllers\Customer\CustomerDashboardController::class, 'terminateOtherSessions'])->name('settings.sessions.terminate');
        });

        // ─────────────────────────────────────────────────────────────────────────
        // Espace Livreur (Dashboard, Tracking, Gains, OTP & 7 Onglets)
        // ─────────────────────────────────────────────────────────────────────────
        Route::middleware('role:driver')->prefix('driver')->name('driver.')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Driver\DriverController::class, 'dashboard'])->name('dashboard');
            Route::get('/deliveries', [\App\Http\Controllers\Driver\DriverController::class, 'deliveries'])->name('deliveries');
            Route::get('/map', [\App\Http\Controllers\Driver\DriverController::class, 'map'])->name('map');
            Route::get('/earnings', [\App\Http\Controllers\Driver\DriverController::class, 'earnings'])->name('earnings');
            Route::get('/notifications', [\App\Http\Controllers\Driver\DriverController::class, 'notifications'])->name('notifications');
            Route::get('/reviews', [\App\Http\Controllers\Driver\DriverController::class, 'reviews'])->name('reviews');
            Route::get('/assistant', [\App\Http\Controllers\Driver\DriverController::class, 'assistant'])->name('assistant');
            Route::post('/assistant/chat', [\App\Http\Controllers\Driver\DriverController::class, 'chatAssistant'])->name('assistant.chat');
            Route::get('/settings', [\App\Http\Controllers\Driver\DriverController::class, 'settings'])->name('settings');
            Route::post('/settings', [\App\Http\Controllers\Driver\DriverController::class, 'updateSettings'])->name('settings.update');

            Route::post('/availability', [\App\Http\Controllers\Driver\DriverController::class, 'toggleAvailability'])->name('availability');
            Route::post('/withdraw', [\App\Http\Controllers\Driver\DriverController::class, 'requestPayout'])->name('withdraw');
            Route::post('/points/convert', [\App\Http\Controllers\Driver\DriverController::class, 'convertPoints'])->name('points.convert');
            Route::post('/telemetry/location', [\App\Http\Controllers\Driver\DriverController::class, 'updateLocation'])->name('telemetry.location');
            Route::post('/routes/optimize', [\App\Http\Controllers\Driver\DriverController::class, 'optimizeRoutes'])->name('routes.optimize');
            Route::get('/delivery/{order_number}/slip', [\App\Http\Controllers\Driver\DriverController::class, 'printDeliverySlip'])->name('delivery.slip');

            Route::middleware('kyc.verified')->group(function () {
                Route::post('/delivery/{order_number}/accept', [\App\Http\Controllers\Driver\DriverController::class, 'acceptDelivery'])->name('delivery.accept');
                Route::post('/delivery/{order_number}/refuse', [\App\Http\Controllers\Driver\DriverController::class, 'refuseDelivery'])->name('delivery.refuse');
                Route::post('/delivery/{order_number}/verify-otp', [\App\Http\Controllers\Driver\DriverController::class, 'verifyDeliveryOtp'])->name('delivery.verify_otp');
                Route::post('/delivery/{order_number}/incident', [\App\Http\Controllers\Driver\DriverController::class, 'reportIncidentAndReturn'])->name('delivery.incident');
            });
        });
    });
});
