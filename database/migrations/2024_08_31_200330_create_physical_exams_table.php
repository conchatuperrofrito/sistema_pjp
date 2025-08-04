<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('physical_exams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('respiratory_rate');
            $table->integer('heart_rate');
            $table->decimal('temperature', 5, 2);
            $table->string('blood_pressure', 7);
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('body_mass_index', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('physical_exams');
    }
};
