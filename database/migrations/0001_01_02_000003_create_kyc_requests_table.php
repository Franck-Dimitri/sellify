<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kyc_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['seller', 'driver']);
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->string('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at');
            $table->timestamp('reviewed_at')->nullable();
            $table->integer('documents_count')->default(0);
            $table->integer('approved_documents_count')->default(0);
            
            // CNI metadata fields (entered manually / future OCR)
            $table->string('cni_number')->nullable();
            $table->string('cni_first_name')->nullable();
            $table->string('cni_last_name')->nullable();
            $table->date('cni_dob')->nullable();
            $table->string('cni_pob')->nullable();
            $table->date('cni_issue_date')->nullable();
            $table->date('cni_expiry_date')->nullable();
            $table->string('cni_gender')->nullable();
            $table->string('cni_nationality')->nullable();

            $table->timestamps();

            $table->index(['status', 'type']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kyc_requests');
    }
};
