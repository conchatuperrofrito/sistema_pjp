<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('occupational_exams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_id');
            $table->enum('exam_type', ['Ingreso', 'Periódico', 'Retiro']);
            $table->date('date');
            $table->enum('result', ['Apto', 'No Apto', 'Apto con reservas']);
            $table->text('medical_observations')->nullable();
            $table->string('doctor');
            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('patients');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('occupational_exams');
    }
};
