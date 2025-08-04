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
        Schema::create('patients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('district_id')->nullable();
            $table->uuid('position_id')->nullable();
            $table->uuid('dependence_id')->nullable();
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('full_name')->storedAs('CONCAT(first_name, " ", last_name)');
            $table->enum('document_type', ['DNI', 'Pasaporte', 'Carnet de extranjería']);
            $table->string('document_number', 255);
            $table->date('birthdate')->nullable();
            $table->enum('sex', ['Masculino', 'Femenino'])->nullable();
            $table->string('contact_number', 255)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('password');
            $table->timestamps();

            $table->fullText('full_name');
            $table->index('document_number');

            $table->foreign('district_id')->references('id')->on('districts');
            $table->foreign('position_id')->references('id')->on('positions');
            $table->foreign('dependence_id')->references('id')->on('dependences');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
