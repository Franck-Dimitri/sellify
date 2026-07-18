<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\SendOtpMail;
use App\Mail\ClientWelcomeMail;
use App\Mail\RegistrationRequestReceivedMail;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class OtpController extends Controller
{
    /**
     * Show the OTP verification screen.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        // If email is already verified, redirect to dashboard
        if ($user->email_verified_at) {
            return $this->redirectUserDashboard($user);
        }

        return Inertia::render('Auth/VerifyEmailOtp', [
            'email' => $user->email,
        ]);
    }

    /**
     * Verify the code.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if ($user->email_verified_at) {
            return $this->redirectUserDashboard($user);
        }

        if ($user->otp_code !== $request->code || now()->greaterThan($user->otp_expires_at)) {
            return back()->withErrors([
                'code' => 'Le code saisi est incorrect ou a expiré. Veuillez en demander un nouveau.',
            ]);
        }

        // Verify user
        $user->update([
            'email_verified_at' => now(),
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        ActivityLog::log($user->id, 'email_verified', "Vérification de l'adresse email par code OTP réussie.");

        // Send confirmation/welcome email
        try {
            if ($user->isCustomer()) {
                Mail::to($user->email)->send(new ClientWelcomeMail($user));
            } elseif ($user->isSeller() || $user->isDriver()) {
                Mail::to($user->email)->send(new RegistrationRequestReceivedMail($user));
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to send welcome/registration confirmation email to {$user->email}: " . $e->getMessage());
        }

        return $this->redirectUserDashboard($user)->with('success', 'Votre adresse e-mail a été vérifiée avec succès.');
    }

    /**
     * Resend the code.
     */
    public function resend(Request $request)
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return $this->redirectUserDashboard($user);
        }

        // Throttle resends: check if previous OTP was generated less than 60 seconds ago
        // (i.e. now is before otp_expires_at - 14 minutes)
        if ($user->otp_expires_at && now()->isBefore($user->otp_expires_at->copy()->subMinutes(14))) {
            return back()->withErrors([
                'code' => 'Veuillez attendre une minute avant de demander un nouveau code.',
            ]);
        }

        // Generate new code
        $otp = sprintf("%06d", random_int(0, 999999));
        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(15),
        ]);

        Mail::to($user->email)->send(new SendOtpMail($user, $otp));

        ActivityLog::log($user->id, 'otp_resend', "Renvoi du code OTP par e-mail.");

        return back()->with('success', 'Un nouveau code de vérification a été envoyé à votre adresse e-mail.');
    }

    /**
     * Helper to redirect user to their dashboard based on role.
     */
    protected function redirectUserDashboard($user)
    {
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'));
        } elseif ($user->isSeller()) {
            return redirect()->intended(route('seller.dashboard'));
        } elseif ($user->isDriver()) {
            return redirect()->intended(route('driver.dashboard'));
        }
        return redirect()->intended(route('welcome'));
    }
}
