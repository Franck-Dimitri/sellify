<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_packs', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // starter, pro, business
            $table->string('display_name');
            $table->decimal('monthly_price', 10, 2)->default(0);
            $table->decimal('commission_rate_min', 5, 2);
            $table->decimal('commission_rate_max', 5, 2);
            $table->integer('max_products')->nullable(); // null for unlimited
            $table->json('features')->nullable();
            $table->timestamps();
        });

        Schema::create('seller_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained()->onDelete('cascade');
            $table->foreignId('pack_id')->constrained('subscription_packs')->onDelete('cascade');
            $table->string('status')->default('active'); // active, expired, cancelled
            $table->timestamp('started_at');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('next_billing_at')->nullable();
            $table->timestamps();
        });

        Schema::create('seller_wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->unique()->constrained()->onDelete('cascade');
            $table->decimal('balance', 12, 2)->default(0);
            $table->decimal('pending_balance', 12, 2)->default(0);
            $table->string('currency', 10)->default('FCFA');
            $table->timestamps();
        });

        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained('seller_wallets')->onDelete('cascade');
            $table->string('type'); // credit_escrow, debit_withdrawal, debit_subscription, debit_loan_repayment
            $table->decimal('amount', 12, 2);
            $table->string('reference')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('completed'); // completed, pending, failed
            $table->timestamps();
        });

        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->decimal('fee', 10, 2)->default(0);
            $table->decimal('net_amount', 12, 2);
            $table->string('payment_method'); // orange_money, mtn_momo, bank_transfer
            $table->string('phone_number')->nullable();
            $table->json('bank_details')->nullable();
            $table->string('status')->default('pending'); // pending, processing, completed, rejected
            $table->text('rejection_reason')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('withdrawals');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('seller_wallets');
        Schema::dropIfExists('seller_subscriptions');
        Schema::dropIfExists('subscription_packs');
    }
};
