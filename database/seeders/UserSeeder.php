<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\Traits\CsvImportTrait;
use App\Models\Role;
use App\Models\Specialty;
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;
use Dotenv\Dotenv;

class UserSeeder extends Seeder
{
    use CsvImportTrait;

    public function run(): void
    {
        $dotenv = Dotenv::createImmutable(base_path());
        $dotenv->load();

        $envFilePath = base_path('.env');
        $envFile = file_get_contents($envFilePath);

        $roles = [
            'admin' => 'Este rol es para los administradores del sistema',
            'doctor' => 'Este rol es para los doctores del sistema'
        ];

        foreach ($roles as $name => $description) {
            $role = Role::updateOrCreate(compact('name'), compact('description'));
            $envKey = strtoupper($name) . '_ROLE_ID';
            $envFile = preg_replace("/^{$envKey}=.*$/m", "{$envKey}={$role->id}", $envFile);
        }

        $specialties = [
            'GENERAL_MEDICINE' => ['Medicina General', 'Especialidad que estudia el diagnóstico, prevención y tratamiento de enfermedades comunes.'],
            'PSYCHOLOGY' => ['Psicología', 'Especialidad que estudia la conducta y los procesos mentales de los individuos en sociedad.'],
            'TOPIC' => ['Tópico', 'Área de atención donde se realizan procedimientos y tratamientos localizados.'],
            'DENTISTRY' => ['Odontología', 'Especialidad que estudia el diagnóstico, prevención y tratamiento de enfermedades bucodentales.']
        ];

        foreach ($specialties as $key => [$name, $description]) {
            $specialty = Specialty::updateOrCreate(compact('name'), compact('description'));
            $envKey = strtoupper($key) . '_SPECIALTY_ID';
            $envFile = preg_replace("/^{$envKey}=.*$/m", "{$envKey}={$specialty->id}", $envFile);
        }

        file_put_contents($envFilePath, $envFile);
        $dotenv->load();

        $rolesMap = Role::whereIn('name', array_keys($roles))->pluck('id', 'name');
        $specialtiesMap = Specialty::whereIn('name', array_column($specialties, 0))->pluck('id', 'name');

        User::factory()->create([
            'role_id' => $rolesMap['admin'],
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'document_type' => 'DNI',
            'document_number' => '00000000',
            'password' => Hash::make('12345678')
        ]);

        $doctors = [
            ['Doctor', 'Doctor', '11111111', 'Medicina General', 12345678],
            ['Psychologist', 'Psychologist', '22222222', 'Psicología', 12348765],
            ['Topical', 'Topical', '33333333', 'Tópico', 12348678],
            ['Dentist', 'Dentist', '44444444', 'Odontología', 87654321]
        ];

        foreach ($doctors as [$first_name, $last_name, $document_number, $specialty_name, $registration_number]) {
            $user = User::factory()->create([
                'role_id' => $rolesMap['doctor'],
                'first_name' => $first_name,
                'last_name' => $last_name,
                'document_type' => 'DNI',
                'document_number' => $document_number,
                'password' => Hash::make('12345678')
            ]);

            Doctor::create([
                'registration_number' => $registration_number,
                'user_id' => $user->id,
                'specialty_id' => $specialtiesMap[$specialty_name]
            ]);
        }
    }
}
