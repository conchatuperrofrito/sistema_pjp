<?php

namespace Database\Factories;

use App\Models\District;
use App\Models\School;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    public function definition(): array
    {
        $documentNumber = $this->faker->unique()->randomNumber(8);
        $sex = $this->faker->randomElement(['Masculino', 'Femenino']);

        return [
            'district_id' => District::inRandomOrder()->first()->id,
            'first_name' => $sex === 'Masculino' 
                ? $this->faker->firstNameMale 
                : $this->faker->firstNameFemale,
            'last_name' => $this->faker->lastName . ' ' . $this->faker->lastName,
            'document_type' => $this->faker->randomElement(['DNI', 'Pasaporte', 'Carnet de extranjería']),
            'document_number' => $documentNumber,   
            'birthdate' => $this->faker->date(),
            'sex' => $sex,
            'contact_number' => $this->faker->phoneNumber,
            'address' => $this->faker->address,
            'password' => Hash::make($documentNumber),
        ];
    }
}
