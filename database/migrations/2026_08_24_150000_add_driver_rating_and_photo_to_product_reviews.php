<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('product_reviews', 'driver_rating')) {
                $table->unsignedTinyInteger('driver_rating')->nullable()->after('rating');
            }
            if (!Schema::hasColumn('product_reviews', 'photo_path')) {
                $table->string('photo_path')->nullable()->after('comment');
            }
        });
    }

    public function down(): void
    {
        Schema::table('product_reviews', function (Blueprint $table) {
            if (Schema::hasColumn('product_reviews', 'driver_rating')) {
                $table->dropColumn('driver_rating');
            }
            if (Schema::hasColumn('product_reviews', 'photo_path')) {
                $table->dropColumn('photo_path');
            }
        });
    }
};
