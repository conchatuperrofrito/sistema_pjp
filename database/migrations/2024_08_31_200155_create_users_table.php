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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->enum('document_type', ['DNI', 'Pasaporte', 'Carnet de extranjería']);
            $table->string('document_number', 50)->unique();
            $table->text('password');
            $table->uuid('role_id');
            $table->timestamps();
            
            $table->foreign('role_id')->references('id')->on('roles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
