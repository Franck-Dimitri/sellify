<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            if (!Schema::hasColumn('shops', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('address');
            }
            if (!Schema::hasColumn('shops', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
            if (!Schema::hasColumn('shops', 'city')) {
                $table->string('city')->default('Douala')->after('longitude');
            }
        });

        Schema::table('drivers', function (Blueprint $table) {
            if (!Schema::hasColumn('drivers', 'current_latitude')) {
                $table->decimal('current_latitude', 10, 7)->nullable()->after('coverage_zone');
            }
            if (!Schema::hasColumn('drivers', 'current_longitude')) {
                $table->decimal('current_longitude', 10, 7)->nullable()->after('current_latitude');
            }
            if (!Schema::hasColumn('drivers', 'heading')) {
                $table->decimal('heading', 5, 2)->default(0)->after('current_longitude');
            }
            if (!Schema::hasColumn('drivers', 'last_location_updated_at')) {
                $table->timestamp('last_location_updated_at')->nullable()->after('heading');
            }
            if (!Schema::hasColumn('drivers', 'last_ping_at')) {
                $table->timestamp('last_ping_at')->nullable()->after('last_location_updated_at');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('delivery_address');
            }
            if (!Schema::hasColumn('orders', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'city']);
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn(['current_latitude', 'current_longitude', 'heading', 'last_location_updated_at']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
