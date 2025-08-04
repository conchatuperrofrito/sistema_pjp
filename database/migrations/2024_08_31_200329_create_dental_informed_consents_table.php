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
        Schema::create('dental_informed_consents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('procedure_description');
            $table->text('diagnosis');
            $table->text('treatment_plan');
            $table->text('procedure_benefits');
            $table->text('treatment_refusal_consequences');
            $table->text('potential_risks');
            $table->date('consent_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dental_informed_consents');
    }
};
