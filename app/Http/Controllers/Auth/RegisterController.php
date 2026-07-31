<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Seller;
use App\Models\Driver;
use App\Services\KycService;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendOtpMail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Exception;

class RegisterController extends Controller
{
    protected KycService $kycService;

    public function __construct(KycService $kycService)
    {
        $this->kycService = $kycService;
    }

    /**
     * Show registration options/form.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle registration requests.
     */
    public function store(Request $request)
    {
        $role = $request->input('role', 'customer');

        if (! in_array($role, ['customer', 'seller', 'driver'])) {
            return back()->withErrors(['role' => 'Rôle invalide.']);
        }

        // Shared validation rules
        $rules = [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'phone' => ['required', 'string', 'max:20', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];

        // Specific rules per role
        if ($role === 'driver') {
            $rules['vehicle_type'] = ['required', 'string', 'in:moto,voiture,velo,camionnette'];
            $rules['license_number'] = ['required', 'string', 'max:50'];
            $rules['vehicle_plate'] = ['required', 'string', 'max:30'];
            $rules['coverage_zone'] = ['required', 'string', 'max:255'];
            
            // Driver KYC Docs
            $rules['doc_cni'] = ['required', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'];
            $rules['doc_permis'] = ['required', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'];
            $rules['doc_carte_grise'] = ['required', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'];
            $rules['doc_vehicule'] = ['required', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'];
            $rules['doc_selfie'] = ['required', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'];
        } elseif ($role === 'seller') {
            // Seller KYC Docs
            $rules['doc_cni'] = ['required', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'];
            $rules['doc_registre'] = ['required', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'];
            $rules['doc_selfie'] = ['required', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'];
        }

        $validated = $request->validate($rules);

        try {
            $user = DB::transaction(function () use ($validated, $role, $request) {
                // 1. Create User with OTP code
                $otp = sprintf("%06d", random_int(0, 999999));
                $user = User::create([
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                    'password' => Hash::make($validated['password']),
                    'role' => $role,
                    'kyc_status' => in_array($role, ['seller', 'driver']) ? 'pending' : 'none',
                    'otp_code' => $otp,
                    'otp_expires_at' => now()->addMinutes(15),
                ]);

                // 2. Create specific profile
                if ($role === 'seller') {
                    Seller::create([
                        'user_id' => $user->id,
                        'status' => 'pending',
                        'pack' => 'starter', // Default pack
                    ]);

                    // Submit Seller KYC
                    $this->kycService->submitKyc($user, [
                        'cni' => $request->file('doc_cni'),
                        'registre_commerce' => $request->file('doc_registre'),
                        'selfie' => $request->file('doc_selfie'),
                    ]);
                } elseif ($role === 'driver') {
                    Driver::create([
                        'user_id' => $user->id,
                        'vehicle_type' => $validated['vehicle_type'],
                        'license_number' => $validated['license_number'],
                        'vehicle_plate' => $validated['vehicle_plate'],
                        'coverage_zone' => $validated['coverage_zone'],
                        'status' => 'pending',
                    ]);

                    // Submit Driver KYC
                    $this->kycService->submitKyc($user, [
                        'cni' => $request->file('doc_cni'),
                        'permis_conduire' => $request->file('doc_permis'),
                        'carte_grise' => $request->file('doc_carte_grise'),
                        'photo_vehicule' => $request->file('doc_vehicule'),
                        'selfie' => $request->file('doc_selfie'),
                    ]);
                }

                // Log registration
                ActivityLog::log(
                    $user->id,
                    'registration',
                    "Inscription en tant que " . ucfirst($role) . "."
                );

                return $user;
            });

            // Send OTP Mail
            Mail::to($user->email)->send(new SendOtpMail($user, $user->otp_code));

            // Login the user immediately
            Auth::login($user);

            // Redirect to OTP verification page
            return redirect()->route('otp.show');

        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Une erreur est survenue lors de l\'inscription : ' . $e->getMessage()]);
        }
    }
}
