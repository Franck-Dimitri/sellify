<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->unique()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('slogan')->nullable();
            $table->text('description')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('banner_path')->nullable();
            
            // Professional Certification Information (Alibaba-Style)
            $table->string('company_name');
            $table->string('registration_number')->nullable(); // RCCM / Patente
            $table->string('address');
            $table->string('phone_contact');
            $table->string('email_contact');
            
            // Configuration & schedules
            $table->json('opening_hours')->nullable();
            $table->json('social_links')->nullable();
            $table->string('theme_color', 10)->default('#EAB308');
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
