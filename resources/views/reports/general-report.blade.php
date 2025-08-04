<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte Médico – {{ $patient->fullName }} – {{ $appointment->date }}</title>
    <style>
        @page {
            size: A4;
            margin: 1.8cm 1.2cm;
        }

        body {
            font-family: Helvetica, sans-serif;
            font-size: 9pt;
            line-height: 1.2;
            color: #000;
            margin-top: 60px;
        }

        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            border-bottom: 1.5px solid #000;
            margin-bottom: 12px;
            padding-bottom: 6px;
            background: #fff;
            z-index: 1000;
        }

        .logo {
            max-width: 100px;
            float: left;
        }

        .header .info {
            float: right;
            text-align: right;
            font-size: 8pt;
        }

        .header:after {
            content: "";
            display: block;
            clear: both;
        }

        .section {
            margin-bottom: 10px;
        }

        .section-title {
            background: #333;
            color: #fff;
            padding: 3px 6px;
            font-size: 10pt;
            margin-bottom: 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 6px;
        }

        th,
        td {
            border: 0.5px solid #666;
            padding: 2px 4px;
            vertical-align: top;
        }

        th {
            background: #f2f2f2;
            font-weight: bold;
            font-size: 8.5pt;
        }

        td {
            font-size: 8.5pt;
        }

        .vitals td {
            text-align: center;
            background: #f9f9f9;
            padding: 3px;
        }

        .vitals .label {
            display: block;
            font-size: 7.5pt;
            color: #555;
        }

        .vitals .value {
            font-size: 9pt;
            margin-top: 1px;
            color: #000;
        }

        .signature {
            margin-top: 40px;
            text-align: center;
            page-break-inside: avoid;
        }

        .signature-line {
            display: inline-block;
            border-top: 1px solid #000;
            padding-top: 3px;
            font-size: 8.5pt;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            border-top: 1px solid #999;
            font-size: 7.5pt;
            text-align: center;
            padding-top: 3px;
            background: #fff;
        }

        .no-break {
            page-break-inside: avoid;
        }
    </style>
</head>

<body>

    <div class="header no-break">
        <img src="{{ public_path('logo-horizontal.png') }}" alt="Logo" class="logo">
        <div class="info">
            <strong>REPORTE MÉDICO GENERAL</strong><br>
            Emitido: {{ date('d/m/Y h:i a') }}
        </div>
    </div>

    <div class="section no-break">
        <div class="section-title">1. Información de la Cita</div>
        <table>
            <tr>
                <th style="width:15%">Fecha</th>
                <td style="width:25%">{{ $appointment->date }}</td>
                <th style="width:15%">Hora</th>
                <td style="width:25%">{{ $appointment->hour}}
                </td>
            </tr>
            <tr>
                <th>Médico</th>
                <td>{{ $doctor->fullName }}</td>
                <th>Especialidad</th>
                <td>{{ $doctor->specialty->name }}</td>
            </tr>
            <tr>
                <th>Motivo</th>
                <td colspan="3">{{ $appointment->reason }}</td>
            </tr>
        </table>
    </div>

    <div class="section no-break">
        <div class="section-title">2. Información del Paciente</div>
        <table>
            <tr>
                <th style="width:15%">Nombre</th>
                <td style="width:35%" colspan="3">{{ $patient->fullName }}</td>
                <th style="width:15%">Documento</th>
                <td style="width:35%" colspan="3">{{ $patient->documentType }} – {{ $patient->documentNumber }}</td>
            </tr>
            <tr>
                <th>Sexo</th>
                <td>{{ $patient->sex }}</td>
                <th>Edad</th>
                <td>
                    @if (!empty($patient->birthdate))
                        {{ $patient->age }} años
                    @endif
                </td>
                <th>F. Nac.</th>
                <td>
                    @if (!empty($patient->birthdate))
                        {{ $patient->age }} años
                    @endif
                </td>
                <th>Teléfono</th>
                <td>{{ $patient->contactNumber }}</td>
            </tr>
            <tr>
                <th>Dirección</th>
                <td colspan="7">{{ $patient->address }}</td>
            </tr>
            <tr>
                <th>L. Nacimiento</th>
                <td colspan="7">
                    {{ $patient->placeOfBirth }}
                </td>
            </tr>
            <tr>
                <th>Cargo</th>
                <td colspan="7">{{ $patient->position->name }}</td>
            </tr>

        </table>
    </div>

    <div class="section no-break">
        <div class="section-title">3. Examen Clínico</div>

        <div class="vital-signs">
            <table style="margin-bottom:6px;">
                <tr>
                    <th colspan="8" style="text-align:center">Examen Físico</th>
                </tr>
                <tr>
                    <th style="width: 15%;">Frec. Respiratoria</th>
                    <td>{{ $clinicalExam->physicalExam->respiratoryRate }} rpm</td>
                    <th style="width: 15%;">Frec. Cardiaca</th>
                    <td>{{ $clinicalExam->physicalExam->heartRate }} lpm</td>
                    <th style="width: 15%;">Temperatura</th>
                    <td colspan="3">{{ $clinicalExam->physicalExam->temperature }} °C</td>
                </tr>
                <tr>
                    <th>Presión Arterial</th>
                    <td>{{ $clinicalExam->physicalExam->bloodPressure }}</td>
                    <th>Peso</th>
                    <td>{{ $clinicalExam->physicalExam->weight }} kg</td>
                    <th>Talla</th>
                    <td>{{ $clinicalExam->physicalExam->height }} cm</td>
                    <th>IMC</th>
                    <td>{{ $clinicalExam->physicalExam->bodyMassIndex }} kg/m²</td>
                </tr>
            </table>
        </div>

        <table>
            <tr>
                <th style="width:15%">Examen General</th>
                <td>{{ $clinicalExam->generalExam }}</td>
            </tr>
            <tr>
                <th style="width:15%">Examen Regional</th>
                <td>{{ $clinicalExam->regionalExam->regionalExam }}</td>
            </tr>
            <tr>
                <th>Piel</th>
                <td>{{ $clinicalExam->regionalExam->skin }}</td>
            </tr>
            <tr>
                <th>Ojos</th>
                <td>{{ $clinicalExam->regionalExam->eyes }}</td>
            </tr>
            <tr>
                <th>Oídos</th>
                <td>{{ $clinicalExam->regionalExam->ears }}</td>
            </tr>
            <tr>
                <th>Nariz</th>
                <td>{{ $clinicalExam->regionalExam->nose }}</td>
            </tr>
            <tr>
                <th>Boca</th>
                <td>{{ $clinicalExam->regionalExam->mouth }}</td>
            </tr>
            <tr>
                <th>Garganta</th>
                <td>{{ $clinicalExam->regionalExam->throat }}</td>
            </tr>
            <tr>
                <th>Dientes</th>
                <td>{{ $clinicalExam->regionalExam->teeth }}</td>
            </tr>
            <tr>
                <th>Cuello</th>
                <td>{{ $clinicalExam->regionalExam->neck }}</td>
            </tr>
            <tr>
                <th>Tórax</th>
                <td>{{ $clinicalExam->regionalExam->thorax }}</td>
            </tr>
            <tr>
                <th>Pulmones</th>
                <td>{{ $clinicalExam->regionalExam->lungs }}</td>
            </tr>
            <tr>
                <th>Corazón</th>
                <td>{{ $clinicalExam->regionalExam->heart }}</td>
            </tr>
            <tr>
                <th>Mamas</th>
                <td>{{ $clinicalExam->regionalExam->breasts }}</td>
            </tr>
            <tr>
                <th>Abdomen</th>
                <td>{{ $clinicalExam->regionalExam->abdomen }}</td>
            </tr>
            <tr>
                <th>Urinario</th>
                <td>{{ $clinicalExam->regionalExam->urinary }}</td>
            </tr>
            <tr>
                <th>Linfáticos</th>
                <td>{{ $clinicalExam->regionalExam->lymphatic }}</td>
            </tr>
            <tr>
                <th>Vasos</th>
                <td>{{ $clinicalExam->regionalExam->vascular }}</td>
            </tr>
            <tr>
                <th>Locomotor</th>
                <td>{{ $clinicalExam->regionalExam->locomotor }}</td>
            </tr>
            <tr>
                <th>Extremidades</th>
                <td>{{ $clinicalExam->regionalExam->extremities }}</td>
            </tr>
            <tr>
                <th>Func. Sup.</th>
                <td>{{ $clinicalExam->regionalExam->higherFunctions }}</td>
            </tr>
            <tr>
                <th>Func. Inf.</th>
                <td>{{ $clinicalExam->regionalExam->lowerFunctions }}</td>
            </tr>
            <tr>
                <th>Necrológicos</th>
                <td>{{ $clinicalExam->regionalExam->obituaries }}</td>
            </tr>
            <tr>
                <th>Rectal</th>
                <td>{{ $clinicalExam->regionalExam->rectal }}</td>
            </tr>
            <tr>
                <th>Ginecológico</th>
                <td>{{ $clinicalExam->regionalExam->gynecological }}</td>
            </tr>
        </table>
    </div>


    <div class="section no-break">
        <div class="section-title">5. Anamnesis</div>
        <table>
            <tr>
                <th style="width:15%">Duración</th>
                <td style="width:20%">{{ $anamnesis->diseaseDuration }}</td>
                <th style="width:15%">Inicio</th>
                <td style="width:20%">{{ $anamnesis->onsetType }}</td>
                <th style="width:15%">Curso</th>
                <td style="width:15%">{{ $anamnesis->course }}</td>
            </tr>
            <tr>
                <th>Historia Clínica</th>
                <td colspan="5">{{ $anamnesis->clinicalStory }}</td>
            </tr>
            <tr>
                <th>Síntomas</th>
                <td colspan="5">{{ $anamnesis->symptomsSigns }}</td>
            </tr>
            <tr>
                <th colspan="6" style="text-align:center">Funciones Biológicas</th>
            </tr>
            <tr>
                <th style="width:15%">Apetito</th>
                <td style="width:20%">{{ $anamnesis->appetite }}</td>
                <th style="width:15%">Sed</th>
                <td style="width:20%">{{ $anamnesis->thirst }}</td>
                <th style="width:15%">Orina</th>
                <td style="width:15%">{{ $anamnesis->urine }}</td>
            </tr>
            <tr>
                <th>Deposiciones</th>
                <td>{{ $anamnesis->stool }}</td>
                <th>Peso</th>
                <td>{{ $anamnesis->weight }} kg</td>
                <th>Sueño</th>
                <td>{{ $anamnesis->sleep }}</td>
            </tr>
        </table>
    </div>

    <div class="section no-break">
        <div class="section-title">6. Diagnóstico</div>
        <table>
            <tr>
                <th style="width:18%">Descripción</th>
                <td style="width:82%">{{ $diagnosis->description }}</td>
            </tr>
            <tr>
                <th>Criterios Clínicos</th>
                <td colspan="3">{{ $diagnosis->clinicalCriteria }}</td>
            </tr>
        </table>
        <table>
            <tr>
                <th style="width:10%">Código</th>
                <th style="width:12%">Tipo</th>
                <th style="width:12%">Caso</th>
                <th style="width:6%">Alta</th>
                <th style="width:60%">Descripción CIE-10</th>
            </tr>
            @if(count($diagnosis->diagnosisCodes) > 0)
                @foreach($diagnosis->diagnosisCodes as $code)
                    <tr>
                        <td>{{ $code["code"] }}</td>
                        <td>{{ $code["type"] }}</td>
                        <td>{{ $code["case"] }}</td>
                        <td>{{ $code["dischargeFlag"] }}</td>
                        <td>{{ $code["description"] }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="5" style="text-align: center;">No se han registrado códigos de diagnóstico para esta
                        consulta.</td>
                </tr>
            @endif
        </table>
    </div>

    <div class="section no-break">
        <div class="section-title">7. Plan Terapéutico</div>
        <table>
            <tr>
                <th style="width:20%">Tratamiento</th>
                <td style="width:80%">{{ $therapeuticPlan->treatment }}</td>
            </tr>
            <tr>
                <th>Estilo de Vida</th>
                <td>{{ $therapeuticPlan->lifeStyleInstructions }}</td>
            </tr>
        </table>
    </div>

    <div class="section no-break">
        <div class="section-title">8. Prescripción</div>
        @if(isset($prescription) && $prescription)
            <table>
                <tr>
                    <th style="width:20%">Notas</th>
                    <td style="width:80%">{{ $prescription->notes }}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th style="width:35%">Medicamento y Concentración</th>
                    <th style="width:15%">Presentación</th>
                    <th style="width:25%">Dosis</th>
                    <th style="width:30%">Instrucciones</th>
                </tr>
                @foreach($prescription->medications as $med)
                    <tr>
                        <td>
                            {{ $med['genericName'] }} {{ $med['concentration'] }}
                            @if(!empty($med['presentation']))
                                ({{ $med['presentation'] }})
                            @endif
                        </td>
                        <td>{{ $med['dosageDescription'] }}</td>
                        <td>{{ $med['frequency'] }} veces al día. Por
                            {{ $med['duration'] == 1 ? '1 día' : $med['duration'] . ' días' }}.
                        </td>
                        <td>{{ $med['instructions'] }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p>No se ha registrado ninguna prescripción médica para esta consulta.</p>
        @endif
    </div>

    <div class="section no-break">
        <div class="section-title">9. Cierre de Consulta</div>
        <table>
            <tr>
                <th style="width:20%">Resumen</th>
                <td style="width:80%">{{ $consultationClosure->summary }}</td>
            </tr>
            <tr>
                <th>Instrucciones</th>
                <td>{{ $consultationClosure->instructions }}</td>
            </tr>
            <tr>
                <th>Próxima Cita</th>
                <td>{{ \Carbon\Carbon::parse($consultationClosure->nextAppointmentDate)->format('d/m/Y') }}</td>
            </tr>
        </table>
    </div>

    <div class="signature" style="margin-top: 120px;">
        <div class="signature-line">
            Dr(a). {{ $doctor->fullName }}<br>
            CMP: {{ $doctor->registrationNumber }}
        </div>
    </div>

    <script type="text/php">
        if (isset($pdf)) {
            $font = $fontMetrics->get_font("helvetica, sans-serif", "normal");
            $size = 8;
            
            $text = "Documento confidencial – Secreto profesional médico. | Página {PAGE_NUM} de {PAGE_COUNT}";
            $width = $fontMetrics->get_text_width($text, $font, $size);
            $x = ($pdf->get_width() - $width) / 2;
            
            $y = 800;
            
            $pdf->page_text($x + 45, $y, $text, $font, $size);
        }
    </script>

</body>

</html>