<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\Traits\CsvImportTrait;
use App\Models\Medication;
use App\Models\DosageForm;

class MedicationSeeder extends Seeder
{
    use CsvImportTrait;

    public function run(): void
    {
        $dosageForms = [
            ['code' => 'INY', 'description' => 'Inyectable (inyección)'],
            ['code' => 'TAB', 'description' => 'Tableta'],
            ['code' => 'AER INH', 'description' => 'Aerosol para inhalación'],
            ['code' => 'LIQ ORAL', 'description' => 'Líquido oral'],
            ['code' => 'GAS', 'description' => 'Gas medicinal (forma gaseosa)'],
            ['code' => 'BARRA/LAPIZ', 'description' => 'Barra o lápiz (stick)'],
            ['code' => 'SOL OFT', 'description' => 'Solución oftálmica'],
            ['code' => 'TAB LIB MODIF', 'description' => 'Tableta de liberación modificada'],
            ['code' => 'PLV', 'description' => 'Polvo'],
            ['code' => 'CRM TOP', 'description' => 'Crema tópica'],
            ['code' => 'SOL DIA', 'description' => 'Solución para diálisis'],
            ['code' => 'TAB DISP', 'description' => 'Tableta dispersable'],
            ['code' => 'CRM TOP/POM/PAS', 'description' => 'Crema tópica / Pomada / Pasta'],
            ['code' => 'TAB SL', 'description' => 'Tableta sublingual'],
            ['code' => 'SPR NAS', 'description' => 'Spray nasal'],
            ['code' => 'IMPLANTE', 'description' => 'Implante subdérmico'],
            ['code' => 'SOL INTRAT/SUS INTRAT', 'description' => 'Solución intratecal / Suspensión intratecal'],
            ['code' => 'SUP', 'description' => 'Supositorio'],
            ['code' => 'CRM VAG', 'description' => 'Crema vaginal'],
            ['code' => 'LIQ INH', 'description' => 'Líquido para inhalación'],
            ['code' => 'GEL TOP', 'description' => 'Gel tópico'],
            ['code' => 'GRAN LIB PRO', 'description' => 'Granulado de liberación prolongada'],
            ['code' => 'SOL TOP', 'description' => 'Solución tópica'],
            ['code' => 'SUS OFT', 'description' => 'Suspensión oftálmica'],
            ['code' => 'GEL OFT', 'description' => 'Gel oftálmico'],
            ['code' => 'SOL', 'description' => 'Solución'],
            ['code' => 'LOC', 'description' => 'Loción'],
            ['code' => 'POM', 'description' => 'Pomada'],
            ['code' => 'SOL REC', 'description' => 'Solución rectal'],
            ['code' => 'SUS REC', 'description' => 'Suspensión rectal'],
            ['code' => 'SOL NBZ', 'description' => 'Solución para nebulización'],
            ['code' => 'UNG OFT', 'description' => 'Ungüento oftálmico'],
            ['code' => 'PARCHE TRANS', 'description' => 'Parche transdérmico'],
            ['code' => 'TAB VAG', 'description' => 'Tableta vaginal'],
            ['code' => 'UNG TOP', 'description' => 'Ungüento tópico'],
            ['code' => 'AER TOP', 'description' => 'Aerosol tópico'],
            ['code' => 'GEL TOP/JAL TOP', 'description' => 'Gel tópico / Jalea tópica'],
            ['code' => 'SOL OTI', 'description' => 'Solución ótica'],
            ['code' => 'SOL INTRAO', 'description' => 'Solución intraocular'],
            ['code' => 'OVU/TAB VAG', 'description' => 'Óvulo / Tableta vaginal'],
            ['code' => 'CRM', 'description' => 'Genérico'],
            ['code' => 'GRAN', 'description' => 'Gránulos'],
            ['code' => 'JALEA', 'description' => 'Jalea'],
            ['code' => 'SPR', 'description' => 'Spray para aplicación tópica'],
            ['code' => 'OVU', 'description' => 'Óvulo'],
            ['code' => 'TAB LIB PRO', 'description' => 'Tableta/cápsula de liberación prolongada/retardada/extendida'],
            ['code' => 'TAB RAN', 'description' => 'Tableta/comprimido ranurado'],
            ['code' => 'UNG', 'description' => 'Ungüento de aplicación tópica'],
            ['code' => 'SOL', 'description' => 'Solución genérica'],
        ];

        foreach ($dosageForms as $dosageForm) {
            DosageForm::firstOrCreate([
                'code' => $dosageForm['code'],
                'description' => $dosageForm['description'],
            ]);
        }

        $csvMedicines = storage_path('csv/PNUME_2023.csv');
        $countMedicines = $this->importCSV($csvMedicines, ';', function ($row) {
            $genericName = isset($row['Denominación Común Internacional / Principio Activo']) ?
                trim($row['Denominación Común Internacional / Principio Activo']) : null;
            $concentration = isset($row['Concentración']) ? trim($row['Concentración']) : null;
            $dosageForm = isset($row['Forma Farmacéutica']) ? trim($row['Forma Farmacéutica']) : null;
            $presentation = isset($row['Presentación']) ? trim($row['Presentación']) : null;

            if (!$genericName || !$dosageForm) {
                return false;
            }

            $dosageForm = DosageForm::where('code', $dosageForm)->first();
            if (!$dosageForm) {
                return false;
            }

            Medication::firstOrCreate([
                'generic_name' => $genericName,
                'concentration' => $concentration,
                'presentation' => $presentation,
                'dosage_form_id' => $dosageForm->id,
                'is_custom' => false
            ]);

            return true;
        }, $this);

        $this->command->info("Importados $countMedicines registros de PNUME_2023.");
    }
}
