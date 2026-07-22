<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->string('code');
            $table->string('type')->default('percentage'); // percentage, fixed
            $table->decimal('value', 10, 2);
            $table->decimal('min_order_amount', 10, 2)->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->foreignId('seller_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->text('reason');
            $table->string('status')->default('open'); // open, under_review, resolved_seller, resolved_client, resolved_split
            $table->text('seller_defense_text')->nullable();
            $table->json('seller_evidence_paths')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamp('seller_responded_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disputes');
        Schema::dropIfExists('promo_codes');
    }
};
