<?php

namespace Tests\Feature;

use App\Mail\SendOtpMail;
use App\Models\User;
use App\Models\Seller;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class OtpVerifyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that user registration generates an OTP code, emails it, and redirects to verification page.
     */
    public function test_user_registration_sends_otp_and_redirects()
    {
        Mail::fake();

        $response = $this->post('/register', [
            'role' => 'customer',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+237699999999',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertRedirect(route('otp.show'));

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'email_verified_at' => null,
        ]);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user->otp_code);
        $this->assertNotNull($user->otp_expires_at);

        Mail::assertSent(SendOtpMail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email) && $mail->otpCode === $user->otp_code;
        });
    }

    /**
     * Test that unverified users attempting to access dashboard routes are redirected to verify-email.
     */
    public function test_unverified_user_is_redirected_to_verify_email()
    {
        $user = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'phone' => '+237688888888',
            'password' => bcrypt('Password123!'),
            'role' => 'seller',
            'email_verified_at' => null,
        ]);

        Seller::create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->get('/seller/dashboard');
        $response->assertRedirect(route('otp.show'));
    }

    /**
     * Test that submitting the correct OTP verification code validates the user's email.
     */
    public function test_submitting_correct_otp_verifies_email()
    {
        $user = User::create([
            'first_name' => 'Bob',
            'last_name' => 'Smith',
            'email' => 'bob@example.com',
            'phone' => '+237677777777',
            'password' => bcrypt('Password123!'),
            'role' => 'customer',
            'email_verified_at' => null,
            'otp_code' => '123456',
            'otp_expires_at' => now()->addMinutes(15),
        ]);

        $response = $this->actingAs($user)->post('/verify-email/confirm', [
            'code' => '123456',
        ]);

        $response->assertRedirect(route('welcome'));
        
        $user->refresh();
        $this->assertNotNull($user->email_verified_at);
        $this->assertNull($user->otp_code);
        $this->assertNull($user->otp_expires_at);
    }

    /**
     * Test that submitting an incorrect OTP code fails and returns validation errors.
     */
    public function test_submitting_incorrect_otp_fails()
    {
        $user = User::create([
            'first_name' => 'Bob',
            'last_name' => 'Smith',
            'email' => 'bob@example.com',
            'phone' => '+237677777777',
            'password' => bcrypt('Password123!'),
            'role' => 'customer',
            'email_verified_at' => null,
            'otp_code' => '123456',
            'otp_expires_at' => now()->addMinutes(15),
        ]);

        $response = $this->actingAs($user)->from('/verify-email')->post('/verify-email/confirm', [
            'code' => '654321',
        ]);

        $response->assertRedirect('/verify-email');
        $response->assertSessionHasErrors('code');
        
        $user->refresh();
        $this->assertNull($user->email_verified_at);
    }
}
