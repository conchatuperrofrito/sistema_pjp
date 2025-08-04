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
        Schema::create('dental_evolutions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->text('odontogram');
            $table->text('specifications');
            $table->text('observations');
            $table->date('basic_dental_discharge');
            $table->uuid('consent_id')->nullable();
            $table->timestamps();
            $table->foreign('consent_id')->references('id')->on('dental_informed_consents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dental_evolutions');
    }
};
