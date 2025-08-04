<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\Traits\CsvImportTrait;
use App\Models\Patient;
use App\Models\Position;
use App\Models\Dependence;
use Illuminate\Support\Facades\Hash;

class PatientSeeder extends Seeder
{
    use CsvImportTrait;
   
    public function run(): void
    {
        $csvPatients = storage_path('csv/cap_abril.csv');

        $countPatients = $this->importCSV($csvPatients, ';', function ($row) {
            $fullName = isset($row['APELLIDOS_Y_NOMBRES']) ? trim($row['APELLIDOS_Y_NOMBRES']) : null;
            $lastName = implode(' ', array_slice(explode(' ', $fullName), 0, 2));
            $firstName = implode(' ', array_slice(explode(' ', $fullName), 2));
            $documentType = 'DNI';
            $documentNumber = isset($row['DNI']) ? trim($row['DNI']) : null;
            $email = isset($row['CORREO_INSTITUCIONAL']) ? trim($row['CORREO_INSTITUCIONAL']) : null;
            $dependenceName = isset($row['DEPENDENCIA']) ? trim($row['DEPENDENCIA']) : null;
            $positionName = isset($row['CARGO']) ? trim($row['CARGO']) : null;
            $password = Hash::make($documentNumber);

            $dependence = Dependence::firstOrCreate([
                'name' => $dependenceName,
            ]);

            $position = Position::firstOrCreate([
                'name' => $positionName,
            ]);

           Patient::firstOrCreate(
               [
                   'document_number' => $documentNumber,
               ],
               [
                   'first_name' => $firstName,
                   'last_name' => $lastName,
                   'document_type' => $documentType,
                   'email' => $email,
                   'position_id' => $position->id,
                   'dependence_id' => $dependence->id,
                   'password' => $password,
               ]
           );

            return true;
        }, $this);

        $this->command->info("Importados $countPatients registros de cap_abril.");
    }
}
