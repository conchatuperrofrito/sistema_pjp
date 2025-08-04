<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\MedicalRecord;
use App\Models\School;
use App\Models\Specialty;
use DB;
use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function generalSummary(Request $request)
    {
        $totalPatients = Patient::count();

        $patientsBySex = [
            'male' => 0,
            'female' => 0,
            'unassigned' => 0
        ];

        Patient::select('sex', DB::raw('count(*) as total'))
            ->groupBy('sex')
            ->get()
            ->each(function ($item) use (&$patientsBySex) {
                if (is_null($item->sex)) {
                    $patientsBySex['unassigned'] += $item->total;
                } else {
                    $sex = strtolower($item->sex);
                    if ($sex === 'masculino') {
                        $patientsBySex['male'] += $item->total;
                    } elseif ($sex === 'femenino') {
                        $patientsBySex['female'] += $item->total;
                    } else {
                        $patientsBySex['unassigned'] += $item->total;
                    }
                }
            });

        if ($request->user()->role_id === env("ADMIN_ROLE_ID")) {
            $todayAppointments = Appointment::whereDate('date', Carbon::today())->count();
            $todayAttendedAppointments = Appointment::whereDate('date', Carbon::today())->where('status', 'Realizada')->count();
        } else {
            $todayAppointments = Appointment::where('user_id', $request->user()->id)
                ->whereDate('date', Carbon::today())
                ->count();
            $todayAttendedAppointments = Appointment::where('user_id', $request->user()->id)
                ->whereDate('date', Carbon::today())
                ->where('status', 'Realizada')->count();
        }

        $specialtySummary = MedicalRecord::whereHas('appointment', function ($query) {
            $query->where('date', Carbon::today());
        })->get()
            ->groupBy('doctor.specialty.name')
            ->map(function ($item) {
                return [
                    'specialty' => $item->first()->doctor->specialty->name,
                    'total' => $item->count(),
                    'attended' => $item->where('appointment.status', 'Realizada')->count()
                ];
            })->values();

        return [
            'totalPatients' => $totalPatients,
            'patientsBySex' => $patientsBySex,
            'todayAppointments' => $todayAppointments,
            'todayAttendedAppointments' => $todayAttendedAppointments,
            'specialtySummary' => $specialtySummary
        ];
    }

    public function lastPatients()
    {
        $patients = Patient::orderBy('created_at', 'desc')->paginate(5);

        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'abreviatedFullName' => $patient->abreviated_full_name,
                'fullName' => $patient->full_name,
                'documentType' => $patient->document_type,
                'documentNumber' => $patient->document_number,
                'sex' => $patient->sex,
                'position' => $patient->position,
                'date' => $patient->created_at->format('Y-m-d'),
                'hour' => $patient->created_at->format('h:i A')
            ];
        });

        return $patients;
    }

    public function lastAppointments()
    {
        $appointments = Appointment::with('patient')
            ->when(auth()->user()->role_id !== env("ADMIN_ROLE_ID"), function ($query) {
                return $query->where('user_id', auth()->user()->id);
            })
            ->orderBy('date', 'desc')
            ->orderBy('hour', 'desc')->paginate(5);

        $appointments->getCollection()->transform(function ($appointment) {
            return [
                'id' => $appointment->id,
                'date' => $appointment->date,
                'hour' => $appointment->hour,
                'status' => $appointment->status,
                'patientFullName' => $appointment->patient->fullName,
                'doctorAbreviatedFullName' => $appointment->medicalRecord->doctor->abreviated_full_name,
                'doctor' => $appointment->medicalRecord->doctor->full_name,
                "specialty" => $appointment->medicalRecord->doctor->specialty->name,
                "reason" => $appointment->reason
            ];
        });

        return $appointments;
    }

    public function getAppointmentsByPeriod(Request $request)
    {
        $period = $request->period;
        $sex = $request->sex;
        $groupBy = $request->groupBy;

        if (!in_array($period, ['today', 'week', 'month', 'year'])) {
            return response()->json(['error' => 'Invalid period'], 400);
        }

        if (!in_array($groupBy, ['specialty', 'status'])) {
            return response()->json(['error' => 'Invalid groupBy parameter'], 400);
        }

        $now = Carbon::now();

        switch ($period) {
            case 'today':
                $start = $now->copy()->startOfDay();
                $end = $now->copy()->endOfDay();
                $timeGroupBy = 'HOUR(hour)';
                $labels = [];
                for ($i = 0; $i < 24; $i++) {
                    $labels[] = Carbon::createFromTime($i, 0)->format('gA');
                }
                $indexAdjustment = 0;
                break;
            case 'week':
                $start = $now->copy()->startOfWeek();
                $end = $now->copy()->endOfWeek();
                $timeGroupBy = 'DAYOFWEEK(date)';
                $labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                $indexAdjustment = 1;
                break;
            case 'month':
                $start = $now->copy()->startOfMonth();
                $end = $now->copy()->endOfMonth();
                $timeGroupBy = 'DAY(date)';
                $labels = range(1, $now->daysInMonth);
                $indexAdjustment = 1;
                break;
            case 'year':
                $start = $now->copy()->startOfYear();
                $end = $now->copy()->endOfYear();
                $timeGroupBy = 'MONTH(date)';
                $labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                $indexAdjustment = 1;
                break;
        }

        try {
            if ($groupBy === 'specialty') {
                if ($request->user()->role_id === env("ADMIN_ROLE_ID")) {
                    $groups = Specialty::whereNot('id', env("DENTISTRY_SPECIALTY_ID"))->get();
                } else {
                    $groups = Specialty::where('id', $request->user()->doctor->specialty_id)->get();
                }
                $groupField = 'doctors.specialty_id';
                $groupNameField = 'specialty_name';
            } else {
                $groups = collect([
                    ['id' => 'Programada', 'name' => 'Programada'],
                    ['id' => 'Pendiente', 'name' => 'Pendiente'],
                    ['id' => 'Realizada', 'name' => 'Realizada'],
                    ['id' => 'Cancelada', 'name' => 'Cancelada']
                ]);
                $groupField = 'appointments.status';
                $groupNameField = 'status';
            }

            $appointments = Appointment::select([
                $groupField,
                DB::raw("{$timeGroupBy} as time_group"),
                DB::raw('COUNT(*) as count')
            ])
                ->join('medical_records', 'appointments.medical_record_id', '=', 'medical_records.id')
                ->join('doctors', 'medical_records.doctor_id', '=', 'doctors.id')
                ->join('patients', 'appointments.patient_id', '=', 'patients.id')
                ->when($sex, function ($query, $sex) {
                    if (!$sex) {
                        return $query;
                    }
                    if ($sex === 'Unassigned') {
                        return $query->whereNull('patients.sex');
                    }
                    return $query->where('patients.sex', $sex);
                })
                ->whereBetween('date', [$start, $end])
                ->when($request->user(), function ($query, $user) {
                    if ($user->role_id === env("ADMIN_ROLE_ID")) {
                        return $query;
                    }
                    return $query->where('appointments.user_id', $user->id);
                })
                ->groupBy([$groupField, DB::raw('time_group')])
                ->get();

            $datasets = [];
            foreach ($groups as $group) {
                $counts = array_combine(
                    range($indexAdjustment, count($labels) + $indexAdjustment - 1),
                    array_fill(0, count($labels), 0)
                );

                foreach ($appointments->where($groupField === 'doctors.specialty_id' ? 'specialty_id' : 'status', $group['id']) as $item) {
                    $timeGroup = (int) $item->time_group;
                    if (isset($counts[$timeGroup])) {
                        $counts[$timeGroup] = (int) $item->count;
                    }
                }

                $datasets[] = [
                    'label' => $group['name'],
                    'data' => array_values($counts),
                ];
            }

            return response()->json([
                'labels' => $labels,
                'datasets' => $datasets,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error processing request',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getSummaryByPeriod(Request $request)
    {
        $period = $request->period;
        $sex = $request->sex;
        $groupBy = $request->groupBy;

        if (!in_array($period, ['today', 'week', 'month', 'year'])) {
            return response()->json(['error' => 'Invalid period'], 400);
        }

        if (!in_array($groupBy, ['specialty', 'status'])) {
            return response()->json(['error' => 'Invalid groupBy parameter'], 400);
        }

        $now = Carbon::now();

        switch ($period) {
            case 'today':
                $start = $now->copy()->startOfDay();
                $end = $now->copy()->endOfDay();
                break;
            case 'week':
                $start = $now->copy()->startOfWeek();
                $end = $now->copy()->endOfWeek();
                break;
            case 'month':
                $start = $now->copy()->startOfMonth();
                $end = $now->copy()->endOfMonth();
                break;
            case 'year':
                $start = $now->copy()->startOfYear();
                $end = $now->copy()->endOfYear();
                break;
        }

        try {
            if ($groupBy === 'specialty') {
                if ($request->user()->role_id === env("ADMIN_ROLE_ID")) {
                    $groups = Specialty::whereNot('id', env("DENTISTRY_SPECIALTY_ID"))->get();
                } else {
                    $groups = Specialty::where('id', $request->user()->doctor->specialty_id)->get();
                }

                $appointments = Appointment::select([
                        'doctors.specialty_id',
                        DB::raw('COUNT(*) as count')
                    ])
                    ->join('medical_records', 'appointments.medical_record_id', '=', 'medical_records.id')
                    ->join('doctors', 'medical_records.doctor_id', '=', 'doctors.id')
                    ->join('patients', 'appointments.patient_id', '=', 'patients.id')
                    ->when($sex, function ($query, $sex) {
                        if (!$sex) {
                            return $query;
                        }
                        if ($sex === 'Unassigned') {
                            return $query->whereNull('patients.sex');
                        }
                        return $query->where('patients.sex', $sex);
                    })
                    ->whereBetween('date', [$start, $end])
                    ->groupBy('doctors.specialty_id')
                    ->get();

                $summary = [];
                foreach ($groups as $specialty) {
                    $appointmentCount = $appointments->where('specialty_id', $specialty->id)->first();
                    $summary[] = [
                        'label' => $specialty->name,
                        'totalAppointments' => $appointmentCount ? (int)$appointmentCount->count : 0,
                    ];
                }

                return response()->json($summary);
            } else {
                $statuses = ['Programada', 'Pendiente', 'Realizada', 'Cancelada'];

                $appointments = Appointment::select([
                        'appointments.status',
                        DB::raw('COUNT(*) as count')
                    ])
                    ->join('patients', 'appointments.patient_id', '=', 'patients.id')
                    ->when($sex, function ($query, $sex) {
                        if (!$sex) {
                            return $query;
                        }
                        if ($sex === 'Unassigned') {
                            return $query->whereNull('patients.sex');
                        }
                        return $query->where('patients.sex', $sex);
                    })
                    ->whereBetween('date', [$start, $end])
                    ->when($request->user(), function ($query, $user) {
                        if ($user->role_id === env("ADMIN_ROLE_ID")) {
                            return $query;
                        }
                        return $query->where('appointments.user_id', $user->id);
                    })
                    ->groupBy('appointments.status')
                    ->get();

                $summary = [];
                foreach ($statuses as $status) {
                    $appointmentCount = $appointments->where('status', $status)->first();
                    $summary[] = [
                        'label' => $status,
                        'totalAppointments' => $appointmentCount ? (int)$appointmentCount->count : 0,
                    ];
                }

                return response()->json($summary);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error processing request',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
