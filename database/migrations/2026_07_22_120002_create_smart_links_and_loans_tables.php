<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('smart_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('token')->unique();
            $table->decimal('price_at_time', 10, 2);
            $table->timestamp('expires_at');
            $table->string('status')->default('active'); // active, paid, expired, cancelled
            $table->integer('clicks_count')->default(0);
            $table->integer('conversions_count')->default(0);
            $table->unsignedBigInteger('order_id')->nullable();
            $table->timestamps();
        });

        Schema::create('seller_loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->decimal('interest_rate', 5, 4); // ex: 0.0800 pour 8%
            $table->integer('duration_months'); // 3, 6, 12
            $table->decimal('monthly_payment', 10, 2);
            $table->decimal('total_amount_due', 12, 2);
            $table->decimal('amount_repaid', 12, 2)->default(0);
            $table->integer('ai_score_at_approval');
            $table->string('status')->default('pending'); // pending, approved, active, completed, defaulted
            $table->timestamp('disbursed_at')->nullable();
            $table->string('contract_pdf_path')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('loan_repayments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained('seller_loans')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('escrow_transaction_id')->nullable();
            $table->string('status')->default('completed'); // completed, pending
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_repayments');
        Schema::dropIfExists('seller_loans');
        Schema::dropIfExists('smart_links');
    }
};
