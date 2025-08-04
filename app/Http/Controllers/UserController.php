<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\UserRequest;
use App\Models\Doctor;
use App\Models\Role;
use App\Models\Specialty;
use App\Models\User;
use DB;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $column = $request->sortDescriptor['column'] ?? null;
        $direction = $request->sortDescriptor['direction'] ?? null;

        if ($request->filterValue) {
            $users = User::where(function ($query) use ($request) {
                $query->where('first_name', 'like', "%{$request->filterValue}%")
                    ->orWhere('last_name', 'like', "%{$request->filterValue}%")
                    ->orWhere('document_number', 'like', "%{$request->filterValue}%");
            });
        } else {
            $users = User::query();
        }

        if ($request->role) {
            $users->where('role_id', $request->role);
        }

        if ($column && $direction) {
            if ($column === 'fullName') {
                $users->orderByRaw("CONCAT(first_name, ' ', last_name) " . ($direction === 'descending' ? 'DESC' : 'ASC'));
            } else {
                $users->orderBy(Str::snake($column), $direction === 'descending' ? 'DESC' : 'ASC');
            }
        }

        $users = $users->where('document_number', '!=', '00000000')->paginate($request->rowsPerPage ?? 5);

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'documentType' => $user->documentType,
                'documentNumber' => $user->documentNumber,
                'createdAt' => $user->createdAt,
                'fullName' => $user->fullName,
                'role' => $user->role->name,
                'specialty' => $user->doctor->specialty->name ?? null,
                'registrationNumber' => $user->doctor->registrationNumber ?? null,
            ];
        });

        return $users;
    }

    public function store(UserRequest $request)
    {
        DB::transaction(function () use ($request) {
            $user = new User();
            $user->firstName = $request->firstName;
            $user->lastName = $request->lastName;
            $user->documentType = $request->documentType;
            $user->documentNumber = $request->documentNumber;
            $user->roleId = $request->roleId;
            $user->password = Hash::make($request->documentNumber);
            $user->save();

            if ($request->roleId === env('DOCTOR_ROLE_ID')) {
                $doctor = new Doctor();
                $doctor->specialtyId = $request->specialtyId;
                $doctor->registrationNumber = $request->registrationNumber;
                $doctor->userId = $user->id;
                $doctor->specialtyId = $request->specialtyId;
                $doctor->save();
            }

            return response(['message' => 'Usuario creado correctamente'], 201);
        });
    }

    public function show($id)
    {
        $user = User::with(['doctor.specialty'])->find($id);

        if ($user) {
            $result = [
                'id' => $user->id,
                'firstName' => $user->firstName,
                'lastName' => $user->lastName,
                'documentType' => $user->documentType,
                'documentNumber' => $user->documentNumber,
                'roleId' => $user->roleId,
                'fullName' => $user->fullName,
            ];

            if (isset($user->doctor)) {
                $result['specialtyId'] = $user->doctor->specialty->id;
                $result['registrationNumber'] = $user->doctor->registrationNumber;
                $result['doctorId'] = $user->doctor->id;
            }

            return $result;
        } else {
            return response([
                'message' => 'Usuario no encontrado',
                'error' => 'El usuario con el ID proporcionado no existe',
                'type' => 'not_found'
            ], 404);
        }
    }

    public function update(UserRequest $request)
    {
        DB::transaction(function () use ($request) {
            $user = User::find($request->id);

            if (!$user) {
                return response([
                    'message' => 'Usuario no encontrado',
                    'error' => 'El usuario con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $user->firstName = $request->firstName;
            $user->lastName = $request->lastName;
            $user->documentType = $request->documentType;
            $user->documentNumber = $request->documentNumber;
            $user->roleId = $request->roleId;
            $user->save();

            if ($request->roleId === env('DOCTOR_ROLE_ID')) {
                $doctor = Doctor::where('user_id', $user->id)->first();
                if ($doctor) {
                    $doctor->specialtyId = $request->specialtyId;
                    $doctor->registrationNumber = $request->registrationNumber;
                    $doctor->save();
                } else {
                    $doctor = new Doctor();
                    $doctor->specialtyId = $request->specialtyId;
                    $doctor->registrationNumber = $request->registrationNumber;
                    $doctor->userId = $user->id;
                    $doctor->save();
                }
            } else {
                Doctor::where('user_id', $user->id)->delete();
            }

            return response(['message' => 'Usuario actualizado correctamente'], 200);
        });
    }

    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $user = User::find($id);
            if ($user) {

                if ($user->doctor) {
                    $user->doctor->delete();
                }

                $user->delete();

                return response(['message' => 'Usuario eliminado correctamente'], 200);
            } else {
                return response([
                    'message' => 'Usuario no encontrado',
                    'error' => 'El usuario con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }
        });
    }

    public function getRoles()
    {
        $roles = Role::all();

        return $roles->transform(function ($role) {
            return [
                'value' => $role->id,
                'label' => $role->name,
            ];
        });
    }

    public function getSpecialties()
    {
        $specialties = Specialty::whereNot('id', env('DENTISTRY_SPECIALTY_ID'))->get();

        return $specialties->transform(function ($specialty) {
            return [
                'value' => $specialty->id,
                'label' => $specialty->name,
            ];
        });
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        DB::transaction(function () use ($request) {
            $user = $request->user();
            if (!$user) {
                return response([
                    'message' => 'Usuario no encontrado',
                    'error' => 'El usuario con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $user->password = \Hash::make($request->newPassword);
            $user->save();

            return response(['message' => 'Contraseña actualizada correctamente'], 200);
        });
    }

    public function resetPassword(Request $request)
    {
        DB::transaction(function () use ($request) {
            $user = User::find($request->id);
            if (!$user) {
                return response([
                    'message' => 'Usuario no encontrado',
                    'error' => 'El usuario con el ID proporcionado no existe',
                    'type' => 'not_found'
                ], 404);
            }

            $user->password = Hash::make($user->documentNumber);
            $user->save();

            return response(['message' => 'Contraseña restablecida correctamente'], 200);
        });
    }
}
