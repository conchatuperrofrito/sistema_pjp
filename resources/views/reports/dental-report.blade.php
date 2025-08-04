<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte Odontologico - {{ $patient->fullName }} - {{$appointment->date}}</title>
    <style>
        @page {
            size: A4;
            margin: 5cm 1.5cm 2cm 1.5cm;
        }

        body {
            font-family: helvetica, sans-serif;
            font-size: 10pt;
            line-height: 1.3;
            color: #000;
        }

        .header {
        border-bottom: 2px solid #000;
        margin-bottom: 20px;
        padding-bottom: 10px;
        position: fixed;
        top: -110px;
        left: 0;
        right: 0;
        height: 80px;
        background-color: #fff;
        z-index: 1000;
        }

        .header-left {
            position: absolute;
            left: 0;
            top: 0;
        }

        .header-right {
            position: absolute;
            right: 0;
            top: 0;
            text-align: right;
        }

        .logo {
            max-width: 150px;
            max-height: 70px;
        }

        h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0 0 5px 0;
        }

        .section {
            margin-bottom: 15px;
        }

        .section-title {
            background-color: #333;
            color: white;
            font-size: 11pt;
            padding: 5px 10px;
            margin-bottom: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        th,
        td {
            border: 0.5px solid #666;
            padding: 5px 8px;
            font-size: 9pt;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
            width: 25%;
            text-align: left;
        }

        .odontogram {
            page-break-inside: avoid;
            margin: 15px 0;
        }

        .odontogram img {
            width: 100%;
            max-height: 400px;
            object-fit: contain;
        }

        .vital-signs {
            width: 100%;
            margin-bottom: 10px;
        }

        .vital-signs td {
            width: 25%;
            text-align: center;
            padding: 8px;
            background-color: #f9f9f9;
        }

        .vital-signs .label {
            font-weight: bold;
            font-size: 8pt;
            color: #666;
            display: block;
        }

        .vital-signs .value {
            font-size: 10pt;
            color: #000;
            margin-top: 3px;
        }

        .signature-area {
            margin-top: 100px;
            page-break-inside: avoid;
        }

        .signature-box {
            width: 200px;
            margin: 0 auto;
            text-align: center;
        }

        .signature-line {
            border-top: 1px solid #000;
            padding-top: 5px;
            font-size: 9pt;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            border-top: 1px solid #999;
            padding-top: 5px;
            font-size: 8pt;
            text-align: center;
            background: white;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .font-bold {
            font-weight: bold;
        }

        .no-break {
            page-break-inside: avoid;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="header-left">
            <img src="{{ public_path('logo.png') }}" alt="Logo de la Clínica" class="logo">
        </div>
        <div class="header-right">
            <h1>Reporte Dental</h1>
            <p>Fecha: {{ date('d/m/Y') }}</p>
            <p>Hora: {{ date('H:i') }}</p>
        </div>
    </div>

    <div class="section no-break">
        <div class="section-title">Información de la Cita</div>
        <table>
            <tr>
                <th>Fecha y Hora:</th>
                <td>{{ $appointment->date }} - {{ $appointment->hour }}</td>
                <th>Estado:</th>
                <td>{{ $appointment->status }}</td>
            </tr>
            <tr>
                <th>Motivo de Consulta:</th>
                <td colspan="3">{{ $appointment->reason }}</td>
            </tr>
        </table>
    </div>

    <div class="section no-break">
        <div class="section-title">Información del Paciente</div>
        <table>
            <tr>
                <th>Nombre Completo:</th>
                <td colspan="3">{{ $patient->fullName }}</td>
            </tr>
            <tr>
                <th>Identificación:</th>
                <td>{{ $patient->documentType }} - {{ $patient->documentNumber }}</td>
                <th>Fecha Nacimiento:</th>
                <td>{{ $patient->birthdate }}</td>
            </tr>
            <tr>
                <th>Teléfono:</th>
                <td>{{ $patient->contactNumber }}</td>
                <th>Sexo:</th>
                <td>{{ $patient->sex }}</td>
            </tr>
            <tr>
                <th>Dirección:</th>
                <td colspan="3">{{ $patient->address }}</td>
            </tr>
        </table>
    </div>

    <div class="section no-break">
        <div class="section-title">Información del Odontólogo</div>
        <table>
            <tr>
                <th>Nombre:</th>
                <td>{{ $doctor->fullName }}</td>
                <th>N° de Registro:</th>
                <td>{{ $doctor->registrationNumber }}</td>
            </tr>
        </table>
    </div>
    <div class="section no-break">
        <div class="section-title">Signos Vitales</div>
        <table class="vital-signs">
            <tr>
                <td>
                    <span class="label">Frecuencia Respiratoria</span>
                    <span class="value">{{ $physicalExam->respiratoryRate }} rpm</span>
                </td>
                <td>
                    <span class="label">Frecuencia Cardíaca</span>
                    <span class="value">{{ $physicalExam->heartRate }} lpm</span>
                </td>
                <td>
                    <span class="label">Temperatura</span>
                    <span class="value">{{ $physicalExam->temperature }} °C</span>
                </td>
                <td>
                    <span class="label">Presión Arterial</span>
                    <span class="value">{{ $physicalExam->bloodPressure }} mmHg</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="section no-break">
        <div class="section-title">Medidas Corporales</div>
        <table>
            <tr>
                <th>Peso:</th>
                <td>{{ $physicalExam->weight }} kg</td>
                <th>Talla:</th>
                <td>{{ $physicalExam->height }} cm</td>
            </tr>
            <tr>
                <th>IMC:</th>
                <td colspan="3">{{ $physicalExam->bodyMassIndex }} kg/m² </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Este documento es confidencial y está protegido por el secreto profesional médico</p>
        <p>Página 1 de 2</p>
    </div>

    <div class="section no-break">
        <div class="section-title">Odontograma de Evolución</div>
        <div class="odontogram">
            <img src="{{ storage_path('app/odontograms/' . $dentalEvolution->id . '.png') }}"
                alt="Odontograma de evolución">
        </div>
        <table>
            <tr>
                <th>Especificaciones:</th>
                <td colspan="3">{{ $dentalEvolution->specifications }}</td>
            </tr>
            <tr>
                <th>Observaciones:</th>
                <td colspan="3">{{ $dentalEvolution->observations }}</td>
            </tr>
            <tr>
                <th>Fecha de Alta:</th>
                <td colspan="3">{{ $dentalEvolution->basicDentalDischarge }}</td>
            </tr>
        </table>
    </div>

    <div class="signature-area">
        <div class="signature-box">
            <div class="signature-line">
                <strong>Dr(a). {{ $doctor->fullName }}</strong><br>
                COP: {{ $doctor->registrationNumber }}
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Este documento es confidencial y está protegido por el secreto profesional médico</p>
        <p>Página 2 de 2</p>
    </div>
</body>

</html>