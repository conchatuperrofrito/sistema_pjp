<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cie10Chapter;
use App\Models\Cie10Group;
use App\Models\Cie10Category;
use App\Models\Cie10Subcategory;
use Database\Seeders\Traits\CsvImportTrait;

class Cie10Seeder extends Seeder
{
    use CsvImportTrait;

    public function run(): void
    {
        $csvCie10 = storage_path('csv/cie10.csv');

        $countCie10 = $this->importCSV($csvCie10, ';', function ($row) {
            $chapterName = isset($row['CAPITULO_NOMBRE']) ? trim($row['CAPITULO_NOMBRE']) : null;
            $chapterDesc = isset($row['CAPITULO_DESCRIPCION']) ? trim($row['CAPITULO_DESCRIPCION']) : null;
            $groupCode = isset($row['GRUPO_CODIGO']) ? trim($row['GRUPO_CODIGO']) : null;
            $groupDesc = isset($row['GRUPO_DESCRIPCION']) ? trim($row['GRUPO_DESCRIPCION']) : null;
            $categoryCode = isset($row['CATEGORIA_CODIGO']) ? trim($row['CATEGORIA_CODIGO']) : null;
            $categoryDesc = isset($row['CATEGORIA_DESCRIPCION']) ? trim($row['CATEGORIA_DESCRIPCION']) : null;
            $subCategoryCode = isset($row['SUBCATEGORIA_CODIGO']) ? trim($row['SUBCATEGORIA_CODIGO']) : null;
            $subCategoryDesc = isset($row['SUBCATEGORIA_DESCRIPCION']) ? trim($row['SUBCATEGORIA_DESCRIPCION']) : null;

            if (
                !$chapterName || !$chapterDesc ||
                !$groupCode || !$groupDesc ||
                !$categoryCode || !$categoryDesc ||
                !$subCategoryCode || !$subCategoryDesc
            ) {
                return false;
            }

            $chapter = Cie10Chapter::firstOrCreate([
                'name' => $chapterName,
                'description' => $chapterDesc,
            ]);

            $group = Cie10Group::firstOrCreate([
                'chapter_id' => $chapter->id,
                'code' => $groupCode,
                'description' => $groupDesc,
            ]);

            $category = Cie10Category::firstOrCreate([
                'group_id' => $group->id,
                'code' => $categoryCode,
                'description' => $categoryDesc,
            ]);

            Cie10Subcategory::firstOrCreate([
                'category_id' => $category->id,
                'code' => $subCategoryCode,
                'description' => $subCategoryDesc,
            ]);

            return true;
        }, $this);

        $this->command->info("Importados $countCie10 registros de CIE10.");
    }
}
