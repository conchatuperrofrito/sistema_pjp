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
        Schema::create('committee_minutes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->text('topics');
            $table->text('agreements');
            $table->string('followup_responsible');
            $table->date('next_meeting_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_minutes');
    }
};
