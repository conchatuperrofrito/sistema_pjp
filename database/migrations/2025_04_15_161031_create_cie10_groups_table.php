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
        Schema::create('cie10_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('chapter_id');
            $table->string('code');
            $table->string('description');

            $table->timestamps();

            $table->foreign('chapter_id')->references('id')->on('cie10_chapters');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cie10_groups');
    }
};
