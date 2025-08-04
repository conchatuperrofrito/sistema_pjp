<?php

namespace App\Http\Controllers;

use App\Models\Cie10Category;
use App\Models\Cie10Subcategory;
use Illuminate\Http\Request;

class DiagnosisController extends Controller
{
    public function getDiagnosisCodes(Request $request)
    {
        $search = $request->search;
        $limit = $request->limit ?? 7;
        $search = preg_replace('/[^a-zA-Z0-9\s]/', '', $search);

        if (empty($search)) {
            $categories = Cie10Category::all()->take($limit);
            $subcategories = Cie10Subcategory::all()->take($limit);
        } else {

            $isCodeSearch = is_numeric($search) ||
                preg_match('/^[A-Za-z][0-9][A-Za-z0-9]*$/', $search);

            if ($isCodeSearch) {
                $categories = Cie10Category::searchByCode($search);
                $subcategories = Cie10Subcategory::searchByCode($search);
            } else {
                $categories = Cie10Category::search($search);
                $subcategories = Cie10Subcategory::search($search);
            }
            
            $categories = $categories->get();
            $subcategories = $subcategories->get();
        }
        
        $diagnosisCodes = $categories->concat($subcategories);

        $sortedDiagnosisCodes = $diagnosisCodes->sortBy(function ($diagnosisCode) use ($search) {
            return levenshtein(
                strtolower($search),
                strtolower($diagnosisCode->description)
            );
        });

        return $sortedDiagnosisCodes->values()->transform(function ($diagnosisCode) {
            return [
                'value' => $diagnosisCode->id,
                'label' => $diagnosisCode->code . ' - ' . $diagnosisCode->description,
                'data' => [
                    'code' => $diagnosisCode->code,
                    'description' => $diagnosisCode->description,
                    'classification' => $diagnosisCode->classification,
                ]
            ];
        });

    }
}
