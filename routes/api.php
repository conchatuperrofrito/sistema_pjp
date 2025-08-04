<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DentalEvolutionController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\DependenceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AccidentController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\OccupationalExamController;
use App\Http\Controllers\EppDeliveryController;
use App\Http\Controllers\EnvironmentalMonitoringController;
use App\Http\Controllers\CommitteeMinuteController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::controller(AppointmentController::class)
        ->prefix('appointments')
        ->group(function () {
            Route::get('/doctors', 'getDoctors');
            Route::post('/patient-appointment', 'storePatientAppointment');
            Route::get('/patient-appointments', 'getPatientAppointments');
            Route::get('/basic-patient-info', 'getBasicPatientInfo');
        });
});

Route::middleware(['auth:sanctum', 'role:' . Config::get('roles.admin') . ',' . Config::get('roles.doctor')])
    ->group(function () {
        Route::controller(UserController::class)
            ->prefix('users')
            ->group(function () {
                Route::get('/', 'index');
                Route::get('/roles', 'getRoles');
                Route::get('/specialties', 'getSpecialties');
                Route::get('/{id}', 'show');
                Route::post('/create', 'store');
                Route::post('/update', 'update');
                Route::post('/reset-password', 'resetPassword');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(PositionController::class)
            ->prefix('positions')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/create', 'store');
                Route::post('/update', 'update');
                Route::get('/options', 'getOptions');
                Route::get('/{id}', 'show');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(DependenceController::class)
            ->prefix('dependences')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/create', 'store');
                Route::post('/update', 'update');
                Route::get('/options', 'getOptions');
                Route::get('/{id}', 'show');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(PatientController::class)
            ->prefix('patients')
            ->group(function () {
                Route::get('/', 'index');
                Route::get('/options', 'getPatientOptions');
                Route::get('/departments', 'getDepartments');
                Route::get('/{id}/appointments', 'getAppointments');
                Route::get('/{id}', 'show');
                Route::post('/update', 'update');
                Route::post('/create', 'store');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(AppointmentController::class)
            ->prefix('appointments')
            ->group(function () {
                Route::get('/{id}', 'show');
                Route::post('/create', 'store');
                Route::post('/update', 'update');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(EventController::class)
            ->prefix('events')
            ->group(function () {
                Route::get('/', 'index');
                Route::get('/participants', 'getParticipants');
                Route::post('/create', 'store');
                Route::post('/update', 'update');
                Route::post('/add-participant', 'addParticipant');
                Route::post('/remove-participant', 'removeParticipant');
                Route::get('/{id}', 'show');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(AccidentController::class)
            ->prefix('accidents')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/create', 'store');
                Route::get('/{id}', 'show');
                Route::post('/update', 'update');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(InspectionController::class)
            ->prefix('inspections')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/create', 'store');
                Route::get('/{id}', 'show');
                Route::post('/update', 'update');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(OccupationalExamController::class)
            ->prefix('occupational-exams')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/create', 'store');
                Route::get('/{id}', 'show');
                Route::post('/update', 'update');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(EppDeliveryController::class)
            ->prefix('epp-deliveries')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/create', 'store');
                Route::get('/{id}', 'show');
                Route::post('/update', 'update');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(EnvironmentalMonitoringController::class)
            ->prefix('environmental-monitorings')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/create', 'store');
                Route::get('/{id}', 'show');
                Route::post('/update', 'update');
                Route::delete('/{id}', 'destroy');
            });

        Route::controller(CommitteeMinuteController::class)
            ->prefix('committee-minutes')
            ->group(function () {
                Route::get('/', 'index');
                Route::post('/create', 'store');
                Route::get('/{id}', 'show');
                Route::post('/update', 'update');
                Route::delete('/{id}', 'destroy');
            });
    });

Route::middleware([
    'auth:sanctum',
    'role:' . Config::get('roles.admin') . ',' . Config::get('roles.doctor')
])->group(function () {
    Route::controller(AppointmentController::class)
        ->prefix('appointments')
        ->group(function () {
            Route::get('/', 'index');
        });

    Route::controller(DentalEvolutionController::class)
        ->prefix('dental-evolutions')
        ->group(function () {
            Route::get('/{id}', 'show');
            Route::post('/create', 'store');
            Route::post('/update', 'update');
        });

    Route::controller(DashboardController::class)
        ->prefix('dashboard')
        ->group(function () {
            Route::get('/general-summary', 'generalSummary');
            Route::get('/last-patients', 'lastPatients');
            Route::get('/last-appointments', 'lastAppointments');
            Route::get('/report-by-period', 'getAppointmentsByPeriod');
            Route::get('/summary-by-period', 'getSummaryByPeriod');
        });

    Route::controller(DiagnosisController::class)
        ->prefix('diagnosis')
        ->group(function () {
            Route::get('/codes', 'getDiagnosisCodes');
        });

    Route::controller(MedicationController::class)
        ->prefix('medications')
        ->group(function () {
            Route::get('/', 'index');
            Route::post('/create', 'store');
            Route::post('/update', 'update');
            Route::get('/options', 'getMedicationOptions');
            Route::get('/dosage-forms', 'getDosageForms');
            Route::get('/{id}', 'show');
            Route::delete('/{id}', 'destroy');
        });

    Route::controller(MedicalRecordController::class)
        ->prefix('medical-records')
        ->group(function () {
            Route::get('/medical-evaluations/{id}', 'getMedicalEvaluation');
            Route::post('/medical-evaluations/create', 'storeMedicalEvaluation');
            Route::post('/medical-evaluations/update', 'updateMedicalEvaluation');
        });
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('users/change-password', [UserController::class, 'changePassword']);
});

Route::middleware(['web', 'auth:sanctum', 'role:' . Config::get('roles.admin') . ',' . Config::get('roles.doctor')])
    ->group(function () {
        Route::get('appointments/general-report/{id}', [AppointmentController::class, 'generalReport']);
        Route::get('appointments/dental-report/{id}', [AppointmentController::class, 'dentalReport']);
        Route::get('appointments/prescription/{id}', [AppointmentController::class, 'getPrescription']);
        Route::get('patients/{id}/appointments-report', [PatientController::class, 'getAppointmentsReport']);
        Route::get('events/report/{id}', [EventController::class, 'eventReport']);
        Route::get('accidents/{id}/report', [AccidentController::class, 'getAccidentReport']);
        Route::get('inspections/{id}/report', [InspectionController::class, 'getInspectionReport']);
        Route::get('occupational-exams/{id}/report', [OccupationalExamController::class, 'getOccupationalExamReport']);
        Route::get('epp-deliveries/{id}/report', [EppDeliveryController::class, 'getEppDeliveryReport']);
        Route::get('environmental-monitorings/{id}/report', [EnvironmentalMonitoringController::class, 'getEnvironmentalMonitoringReport']);
        Route::get('committee-minutes/{id}/report', [CommitteeMinuteController::class, 'getCommitteeMinuteReport']);
    });
