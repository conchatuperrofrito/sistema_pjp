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
        Schema::create('medical_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('clinical_exam_id')->nullable();
            $table->uuid('dental_evolution_id')->nullable();
            $table->uuid('anamnesis_id')->nullable();
            $table->uuid('diagnosis_id')->nullable();
            $table->uuid('therapeutic_plan_id')->nullable();
            $table->uuid('prescription_id')->nullable();
            $table->uuid('consultation_closure_id')->nullable();
            $table->uuid('doctor_id');
            $table->timestamps();

            $table->foreign('clinical_exam_id')->references('id')->on('clinical_exams');
            $table->foreign('dental_evolution_id')->references('id')->on('dental_evolutions');
            $table->foreign('anamnesis_id')->references('id')->on('anamneses');
            $table->foreign('diagnosis_id')->references('id')->on('diagnoses');
            $table->foreign('prescription_id')->references('id')->on('prescriptions');
            $table->foreign('therapeutic_plan_id')->references('id')->on('therapeutic_plans');
            $table->foreign('consultation_closure_id')->references('id')->on('consultation_closures');
            $table->foreign('doctor_id')->references('id')->on('doctors');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
