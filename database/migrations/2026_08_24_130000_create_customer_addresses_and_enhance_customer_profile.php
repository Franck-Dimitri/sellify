<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create customer addresses table with visual landmark support
        if (!Schema::hasTable('customer_addresses')) {
            Schema::create('customer_addresses', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('label')->default('Domicile'); // Domicile, Bureau, etc.
                $table->string('recipient_name')->nullable();
                $table->string('recipient_phone')->nullable();
                $table->string('city')->default('Douala');
                $table->string('quarter')->nullable();
                $table->text('address')->nullable();
                $table->text('landmark_description')->nullable(); // Repère textuel (ex: Portail bleu près de la station)
                $table->string('landmark_photo_path')->nullable(); // Photo du point de repère
                $table->decimal('latitude', 10, 7)->nullable();
                $table->decimal('longitude', 10, 7)->nullable();
                $table->boolean('is_default')->default(false);
                $table->timestamps();
            });
        }

        // 2. Enhance users table with Mobile Money & notification preferences
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'momo_number')) {
                $table->string('momo_number')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'om_number')) {
                $table->string('om_number')->nullable()->after('momo_number');
            }
            if (!Schema::hasColumn('users', 'preferred_payment_method')) {
                $table->string('preferred_payment_method')->default('momo')->after('om_number'); // momo, orange_money, card
            }
            if (!Schema::hasColumn('users', 'notification_preferences')) {
                $table->json('notification_preferences')->nullable()->after('preferred_payment_method');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_addresses');

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'momo_number')) {
                $table->dropColumn('momo_number');
            }
            if (Schema::hasColumn('users', 'om_number')) {
                $table->dropColumn('om_number');
            }
            if (Schema::hasColumn('users', 'preferred_payment_method')) {
                $table->dropColumn('preferred_payment_method');
            }
            if (Schema::hasColumn('users', 'notification_preferences')) {
                $table->dropColumn('notification_preferences');
            }
        });
    }
};
