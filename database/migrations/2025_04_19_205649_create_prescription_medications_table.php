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
        Schema::create('prescription_medications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('medication_id');
            $table->uuid('prescription_id');
            $table->integer('duration');
            $table->integer('frequency');
            $table->string('instructions')->nullable();
            $table->integer('quantity');

            $table->timestamps();

            $table->foreign('medication_id')->references('id')->on('medications');
            $table->foreign('prescription_id')->references('id')->on('prescriptions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medication_prescription');
    }
};
