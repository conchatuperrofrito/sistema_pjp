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
        Schema::create('cie10_diagnostic_codes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('diagnostic_id');

            $table->uuid('classifiable_id');
            $table->string('classifiable_type');

            $table->enum('type', ['Definitivo', 'Presuntivo', 'Provisional']);
            $table->enum('case', ['Nuevo', 'Repetido', 'Recidiva', 'Secuela', 'Complicación']);
            $table->boolean('discharge_flag');

            $table->timestamps();

            $table->foreign('diagnostic_id')->references('id')->on('diagnoses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cie10_diagnostic_code');
    }
};
