<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Mail\SendOtpMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class LoginController extends Controller
{
    /**
     * Show the login form.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login requests.
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->boolean('remember', false);

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Update user login info
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);

            // Check if email is verified
            if (! $user->email_verified_at) {
                // Generate OTP
                $otp = sprintf("%06d", random_int(0, 999999));
                $user->update([
                    'otp_code' => $otp,
                    'otp_expires_at' => now()->addMinutes(15),
                ]);

                // Send Mail
                Mail::to($user->email)->send(new SendOtpMail($user, $otp));

                // Log login
                ActivityLog::log(
                    $user->id,
                    'login_unverified',
                    "Connexion réussie, redirection vers vérification OTP.",
                    ['ip' => $request->ip(), 'agent' => $request->userAgent()]
                );

                return redirect()->route('otp.show');
            }

            // Log login
            ActivityLog::log(
                $user->id,
                'login',
                "Connexion réussie.",
                ['ip' => $request->ip(), 'agent' => $request->userAgent()]
            );

            // Redirect depending on role
            if ($user->isAdmin()) {
                return redirect()->intended(route('admin.dashboard'));
            } elseif ($user->isSeller()) {
                return redirect()->intended(route('seller.dashboard'));
            } elseif ($user->isDriver()) {
                return redirect()->intended(route('driver.dashboard'));
            }

            // Default route (for customer)
            return redirect()->intended(route('welcome'))->with('success', 'Ravi de vous revoir !');
        }

        return back()->withErrors([
            'email' => 'Les identifiants fournis ne correspondent pas à nos enregistrements.',
        ])->onlyInput('email');
    }

    /**
     * Log out the user.
     */
    public function destroy(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            ActivityLog::log($user->id, 'logout', "Déconnexion de la session.");
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('welcome')->with('success', 'Vous avez été déconnecté.');
    }
}
