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
        Schema::create('anamneses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('disease_duration', 50);
            $table->string('onset_type', 20);
            $table->string('course', 20);
            $table->text('symptoms_signs');
            $table->text('clinical_story');
            $table->string('appetite', 20);
            $table->string('thirst', 20);
            $table->string('urine', 20);
            $table->string('stool', 20);
            $table->decimal('weight', 5, 2);
            $table->string('sleep', 20);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anamneses');
    }
};
