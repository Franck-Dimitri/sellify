<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('smart_links', function (Blueprint $table) {
            $table->string('title')->nullable()->after('token');
            $table->unsignedBigInteger('product_id')->nullable()->change();
            $table->json('items')->nullable()->after('product_id');
            $table->decimal('subtotal', 12, 2)->default(0)->after('price_at_time');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('subtotal');
            $table->decimal('shipping_fee', 10, 2)->default(0)->after('discount_amount');
            $table->decimal('total_price', 12, 2)->default(0)->after('shipping_fee');
            $table->text('notes')->nullable()->after('total_price');
            $table->string('tracking_code')->nullable()->unique()->after('notes');
            $table->json('delivery_info')->nullable()->after('tracking_code');
        });
    }

    public function down(): void
    {
        Schema::table('smart_links', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'items',
                'subtotal',
                'discount_amount',
                'shipping_fee',
                'total_price',
                'notes',
                'tracking_code',
                'delivery_info',
            ]);
        });
    }
};
