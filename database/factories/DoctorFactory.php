<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Doctor>
 */

class DoctorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [

            'registration_number' => $this->faker->randomNumber(8),
            'user_id' => User::factory()->state([
                'role_id' =>
                    Role::where('name', 'doctor')->first()?->id
            ]),
            'specialty_id' => Specialty::inRandomOrder()->first()?->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
