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
use Inertia\Inertia;

// ─────────────────────────────────────────────────────────────────────────────
// Routes Publiques
// ─────────────────────────────────────────────────────────────────────────────

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/boutique/{slug}', [ShopController::class, 'showPublic'])->name('shop.public');

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
        });

        // ─────────────────────────────────────────────────────────────────────────
        // Espace Vendeur (Dashboard & Actions)
        // ─────────────────────────────────────────────────────────────────────────
        Route::middleware('role:seller')->prefix('seller')->name('seller.')->group(function () {
            // Dashboard vendeur
            Route::get('/dashboard', function () {
                return Inertia::render('Seller/Dashboard');
            })->name('dashboard');

            // Actions liées à la boutique, restreintes par le KYC
            Route::middleware('kyc.verified')->group(function () {
                Route::get('/shop/create', [ShopController::class, 'create'])->middleware('shop.limit')->name('shop.create');
                Route::post('/shop', [ShopController::class, 'store'])->middleware('shop.limit')->name('shop.store');
                Route::get('/shop/edit', [ShopController::class, 'edit'])->name('shop.edit');
                Route::post('/shop/update', [ShopController::class, 'update'])->name('shop.update');
            });
        });

        // ─────────────────────────────────────────────────────────────────────────
        // Espace Livreur (Dashboard & Actions)
        // ─────────────────────────────────────────────────────────────────────────
        Route::middleware('role:driver')->prefix('driver')->name('driver.')->group(function () {
            // Dashboard livreur
            Route::get('/dashboard', function () {
                return Inertia::render('Driver/Dashboard');
            })->name('dashboard');

            // Exemple d'action critique restreinte par le middleware KYC
            Route::middleware('kyc.verified')->group(function () {
                Route::post('/delivery/accept', function () {
                    return back()->with('success', 'Livraison acceptée ! (Simulé)');
                })->name('delivery.accept');
            });
        });
    });
});
