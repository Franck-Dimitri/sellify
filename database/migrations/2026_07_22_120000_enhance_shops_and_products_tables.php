<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->json('return_policy')->nullable()->after('opening_hours');
            $table->json('shipping_settings')->nullable()->after('return_policy');
            $table->boolean('is_holiday_mode')->default(false)->after('is_active');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')->nullable()->after('slug');
            $table->decimal('weight', 8, 2)->nullable()->after('price');
            $table->json('dimensions')->nullable()->after('weight');
            $table->integer('alert_threshold')->default(5)->after('stock');
            $table->string('stock_status')->default('in_stock')->after('alert_threshold'); // in_stock, out_of_stock, pre_order
            $table->json('variants')->nullable()->after('stock_status');
            $table->boolean('is_archived')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn(['return_policy', 'shipping_settings', 'is_holiday_mode']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['sku', 'weight', 'dimensions', 'alert_threshold', 'stock_status', 'variants', 'is_archived']);
        });
    }
};
