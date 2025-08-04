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
        Schema::create('medications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('generic_name');
            $table->string('concentration')->nullable();
            $table->string('presentation')->nullable();
            $table->uuid('dosage_form_id');
            $table->boolean('is_custom')->default(true);
            $table->timestamps();

            $table->fullText('generic_name');

            $table->foreign('dosage_form_id')->references('id')->on('dosage_forms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
