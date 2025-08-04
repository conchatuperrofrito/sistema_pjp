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
        Schema::create('clinical_exams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('physical_exam_id');
            $table->uuid('regional_exam_id')->nullable();
            $table->text('general_exam');
         
            $table->timestamps();

            $table->foreign('physical_exam_id')->references('id')->on('physical_exams');
            $table->foreign('regional_exam_id')->references('id')->on('regional_exams');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinical_exams');
    }
};
