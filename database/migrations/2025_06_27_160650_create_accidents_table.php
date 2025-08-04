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
        Schema::create('accidents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->time('hour');
            $table->string('event_type');
            $table->uuid('patient_id');
            $table->text('description');
            $table->text('probable_cause');
            $table->text('consequences');
            $table->text('corrective_actions');
            $table->string('responsible');
            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('patients');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accidents');
    }
};
