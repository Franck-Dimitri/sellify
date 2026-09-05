<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_reference')->nullable()->index()->after('total_amount');
            $table->string('payment_transaction_id')->nullable()->after('payment_reference');
            $table->string('payment_gateway')->default('hrpay')->after('payment_transaction_id');
            $table->json('payment_details')->nullable()->after('payment_gateway');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['payment_reference']);
            $table->dropColumn([
                'payment_reference',
                'payment_transaction_id',
                'payment_gateway',
                'payment_details',
            ]);
        });
    }
};
