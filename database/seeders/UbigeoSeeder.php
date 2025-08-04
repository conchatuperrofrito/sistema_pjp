<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\Traits\CsvImportTrait;
use App\Models\Department;
use App\Models\Province;
use App\Models\District;

class UbigeoSeeder extends Seeder
{
    use CsvImportTrait;

    public function run(): void
    {
        $csvUbigeos = storage_path('csv/TB_UBIGEOS.csv');

        $countUbigeos = $this->importCSV($csvUbigeos, ';', function ($row) {
            $departmentName = isset($row['departamento']) ? trim($row['departamento']) : null;
            $provinceName = isset($row['provincia']) ? trim($row['provincia']) : null;
            $districtName = isset($row['distrito']) ? trim($row['distrito']) : null;

            if (!$departmentName || !$provinceName || !$districtName) {
                return false;
            }

            $department = Department::firstOrCreate([
                'name' => $departmentName,
            ]);

            $province = Province::firstOrCreate([
                'name' => $provinceName,
                'department_id' => $department->id,
            ]);

            District::firstOrCreate([
                'name' => $districtName,
                'province_id' => $province->id,
            ]);

            return true;
        }, $this);

        $this->command->info("Importados $countUbigeos registros de TB_UBIGEOS.");
    }
}
