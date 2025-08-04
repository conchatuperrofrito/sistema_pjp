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
        Schema::create('environmental_monitorings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('area');
            $table->string('agent_type');
            $table->string('agent_description', 100)->nullable();
            $table->decimal('measured_value', 8, 2);
            $table->string('unit', 20);
            $table->decimal('permitted_limit', 8, 2)->nullable();
            $table->date('measurement_date');
            $table->string('frequency');
            $table->string('responsible');
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('environmental_monitorings');
    }
};
