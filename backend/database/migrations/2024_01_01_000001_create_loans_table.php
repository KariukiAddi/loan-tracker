<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->string('borrower_name');
            $table->decimal('amount', 12, 2);
            $table->decimal('interest_rate', 5, 2)->default(2.00);
            $table->integer('repayment_period');
            $table->date('start_date')->default(now());
            $table->timestamps();
            
            $table->index(['borrower_name']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
