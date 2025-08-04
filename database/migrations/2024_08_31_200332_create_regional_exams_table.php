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
        Schema::create('regional_exams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('regional_exam')->nullable();
            $table->text('skin')->nullable();
            $table->text('eyes')->nullable();
            $table->text('ears')->nullable();
            $table->text('nose')->nullable();
            $table->text('mouth')->nullable();
            $table->text('throat')->nullable();
            $table->text('teeth')->nullable();
            $table->text('neck')->nullable();
            $table->text('thorax')->nullable();
            $table->text('lungs')->nullable();
            $table->text('heart')->nullable();
            $table->text('breasts')->nullable();
            $table->text('abdomen')->nullable();
            $table->text('urinary')->nullable();
            $table->text('lymphatic')->nullable();
            $table->text('vascular')->nullable();
            $table->text('locomotor')->nullable();
            $table->text('extremities')->nullable();
            $table->text('obituaries')->nullable();
            $table->text('higher_functions')->nullable();
            $table->text('lower_functions')->nullable();
            $table->text('rectal')->nullable();
            $table->text('gynecological')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regional_exams');
    }
};
