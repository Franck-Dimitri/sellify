<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PasswordResetController extends Controller
{
    /**
     * Display the forgot password link request view.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Send email with link or log mock OTP (since user wants email/logs setup).
     */
    public function sendLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $user = User::where('email', $request->email)->first();
        
        // Generate password reset token
        $token = Str::random(60);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        // Since we are doing OTP / Reset via mock email for Phase 1 dev,
        // let's log the link / OTP inside log, and simulate sending it.
        \Illuminate\Support\Facades\Log::info("Password Reset Link for {$user->email}: http://localhost:8000/password/reset/{$token}?email=" . urlencode($user->email));

        // We can also store an OTP in logs as requested "L'ENVOIE DE L'otp sera ca sera par email..."
        $otp = rand(100000, 999999);
        \Illuminate\Support\Facades\Log::info("Verification OTP for {$user->email}: {$otp}");

        // In a real application, we would use Mail::send() to send this.
        ActivityLog::log($user->id, 'password_reset_request', "Demande de réinitialisation de mot de passe générée.");

        return back()->with('success', 'Si votre adresse email est correcte, vous recevrez un lien de réinitialisation.');
    }

    /**
     * Display the password reset view.
     */
    public function showResetForm(Request $request, string $token): InertiaResponse
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    /**
     * Handle password update.
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email', 'exists:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (! $record || ! Hash::check($request->token, $record->token)) {
            return back()->withErrors(['email' => 'Ce jeton de réinitialisation est invalide ou expiré.']);
        }

        $user = User::where('email', $request->email)->first();
        
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        ActivityLog::log($user->id, 'password_reset_success', "Mot de passe réinitialisé avec succès.");

        return redirect()->route('login')->with('success', 'Votre mot de passe a été modifié avec succès. Connectez-vous.');
    }
}
