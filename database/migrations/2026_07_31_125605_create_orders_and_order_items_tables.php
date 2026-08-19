<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // e.g. SLF-2026-X892
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Client (null if guest)
            $table->foreignId('shop_id')->constrained('shops')->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->onDelete('set null');
            
            // Delivery details
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('delivery_address');
            $table->string('city')->default('Douala');
            
            // Financial amounts
            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            
            // Payment Escrow status
            $table->string('payment_method')->default('orange_money'); // orange_money, mtn_momo, bank_transfer
            $table->string('payment_status')->default('escrow_held'); // pending, escrow_held, released, refunded
            
            // Delivery Status & OTP
            $table->string('delivery_status')->default('pending'); // pending, preparing, in_transit, delivered, cancelled
            $table->string('delivery_otp', 6); // 6-digit verification code
            
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null');
            $table->string('product_name');
            $table->decimal('unit_price', 10, 2);
            $table->integer('quantity');
            $table->decimal('subtotal', 12, 2);
            $table->timestamps();
        });

        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('session_id')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
