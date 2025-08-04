<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $this->call([
                UserSeeder::class,
                MedicationSeeder::class,
                UbigeoSeeder::class,
                Cie10Seeder::class,
                PatientSeeder::class,
            ]);

        });
    }
}