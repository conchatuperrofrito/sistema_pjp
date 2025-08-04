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
        Schema::create('inspections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->string('area');
            $table->string('inspector');
            $table->text('findings');
            $table->enum('severity', ['Baja', 'Moderada', 'Alta']);
            $table->text('recommendations');
            $table->date('correction_deadline')->nullable();
            $table->string('correction_responsible');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspections');
    }
};
