<?php

namespace App\Utils;

class OdontogramGenerator
{
    const PART_STATUS_OPTIONS = [
        "Caries",
        "Curado",
        "Fractura",
        "Desgaste",
        "Atrición",
        "Abfracción",
        "Erosión",
        "Hipoplasia"
    ];

    const TOOTH_STATUS_OPTIONS = [
        "Removido",
        "Corona",
        "Puente",
        "Implante",
        "Endodoncia",
        "Restauración temporal",
    ];

    protected function toothParts()
    {
        return [
            'oclusal' => [
                'name' => "Oclusal",
                'status' => ""
            ],
            'distal' => [
                'name' => "Distal O lingual",
                'status' => ""
            ],
            'palatina' => [
                'name' => "Palatina",
                'status' => ""
            ],
            'mesial' => [
                'name' => "Mesial",
                'status' => ""
            ],
            'vestibular' => [
                'name' => "Vestibular",
                'status' => ""
            ]
        ];
    }

    protected function getOdontogram()
    {
        return [
            [
                [
                    "number" => 18,
                    "quadrant" => 1,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Tercero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 17,
                    "quadrant" => 1,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 16,
                    "quadrant" => 1,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Primero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 15,
                    "quadrant" => 1,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 14,
                    "quadrant" => 1,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Lateral",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 13,
                    "quadrant" => 1,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Central",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 12,
                    "quadrant" => 1,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 11,
                    "quadrant" => 1,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Primero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 21,
                    "quadrant" => 2,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Primero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 22,
                    "quadrant" => 2,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 23,
                    "quadrant" => 2,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 24,
                    "quadrant" => 2,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Lateral",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 25,
                    "quadrant" => 2,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Central",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 26,
                    "quadrant" => 2,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 27,
                    "quadrant" => 2,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 28,
                    "quadrant" => 2,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Tercero",
                    "parts" => $this->toothParts()
                ]
            ],
            [
                [
                    "number" => 55,
                    "quadrant" => 1,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Primero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 54,
                    "quadrant" => 1,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 53,
                    "quadrant" => 1,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 52,
                    "quadrant" => 1,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Lateral",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 51,
                    "quadrant" => 1,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Central",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 61,
                    "quadrant" => 2,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Central",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 62,
                    "quadrant" => 2,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Lateral",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 63,
                    "quadrant" => 2,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 64,
                    "quadrant" => 2,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 65,
                    "quadrant" => 2,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Primero",
                    "parts" => $this->toothParts()
                ]
            ],
            [
                [
                    "number" => 85,
                    "quadrant" => 4,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Tercero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 84,
                    "quadrant" => 4,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 83,
                    "quadrant" => 4,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 82,
                    "quadrant" => 4,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Lateral",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 81,
                    "quadrant" => 4,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Central",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 71,
                    "quadrant" => 3,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Central",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 72,
                    "quadrant" => 3,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Lateral",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 73,
                    "quadrant" => 3,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 74,
                    "quadrant" => 3,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 75,
                    "quadrant" => 3,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Primero",
                    "parts" => $this->toothParts()
                ]
            ],
            [
                [
                    "number" => 48,
                    "quadrant" => 4,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Tercero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 47,
                    "quadrant" => 4,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 46,
                    "quadrant" => 4,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Primero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 45,
                    "quadrant" => 4,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 44,
                    "quadrant" => 4,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Lateral",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 43,
                    "quadrant" => 4,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Central",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 42,
                    "quadrant" => 4,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 41,
                    "quadrant" => 4,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Primero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 31,
                    "quadrant" => 3,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Primero",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 32,
                    "quadrant" => 3,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 33,
                    "quadrant" => 3,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 34,
                    "quadrant" => 3,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Lateral",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 35,
                    "quadrant" => 3,
                    "type" => "Incisivo",
                    "status" => "",
                    "position" => "Incisivo Central",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 36,
                    "quadrant" => 3,
                    "type" => "Canino",
                    "status" => "",
                    "position" => "Canino",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 37,
                    "quadrant" => 3,
                    "type" => "Premolar",
                    "status" => "",
                    "position" => "Premolar Segundo",
                    "parts" => $this->toothParts()
                ],
                [
                    "number" => 38,
                    "quadrant" => 3,
                    "type" => "Molar",
                    "status" => "",
                    "position" => "Molar Tercero",
                    "parts" => $this->toothParts()
                ]
            ]
        ];
    }

    public function generate()
    {
        $odontogram = $this->getOdontogram();
        foreach ($odontogram as &$quadrant) {
            if (rand(0, 100) < 70) {
                foreach ($quadrant as &$tooth) {
                    if (rand(0, 100) < 70) {
                        $tooth['status'] = self::TOOTH_STATUS_OPTIONS[array_rand(self::TOOTH_STATUS_OPTIONS)];
                    } else {
                        foreach ($tooth['parts'] as &$part) {
                            if (rand(0, 100) < 70) {
                                $part['status'] = self::PART_STATUS_OPTIONS[array_rand(self::PART_STATUS_OPTIONS)];
                            }
                        }
                    }
                }
            }
        }
        return json_encode($odontogram);
    }

}