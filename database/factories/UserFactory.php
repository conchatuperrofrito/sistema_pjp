<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        return [
            'first_name' => $this->faker->boolean(30) ? $this->faker->firstName . ' ' . $this->faker->firstName : $this->faker->firstName,
            'last_name' => $this->faker->lastName . ' ' . $this->faker->lastName,
            'document_type' => $this->faker->randomElement(['DNI', 'Pasaporte', 'Carnet de extranjería']),
            'document_number' => $this->faker->randomNumber(8),
            'password' => Hash::make('12345678'),
            'role_id' => Role::where('name', 'admin')->first()?->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
