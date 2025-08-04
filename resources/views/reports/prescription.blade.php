<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Receta Médica – {{ $patient->fullName }} – {{ $appointment->date }}</title>
    <style>
        @page {
            size: A4;
            margin: 1cm 1.5cm;
        }

        body {
            margin: 0;
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #222;
        }

        .header {
            text-align: center;
        }

        .header .logo {
            max-height: 1.5cm;
        }

        .header .title {
            font-size: 18pt;
            font-weight: bold;
            margin-top: 0.2cm;
        }

        .content {
            margin: 0 1cm;
        }

        .sectionTitle {
            font-size: 12pt;
            font-weight: bold;
            color: #333;
            text-decoration: underline;
            margin-bottom: 0.2cm;
        }

        .prescriptionList {
            margin-left: 1cm;
        }

        .prescriptionItem {
            margin-bottom: 0.2cm;
        }

        .prescriptionItem span {
            display: block;
        }

        .medName {
            font-weight: bold;
            font-size: 11pt;
        }

        .dosageInfo {
            margin-left: 0.5cm;
        }

        .doctorInfo {
            margin-top: 3cm;
            text-align: center;
        }

        .signatureLine {
            display: inline-block;
            border-top: 1px solid #000;
            padding-top: 0.2cm;
            font-size: 10pt;
            color: #333;
            width: 7cm;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9pt;
            color: #555;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src="{{ public_path('logo-horizontal.png') }}" alt="Logo" class="logo">
        <div class="title">RECETA MÉDICA</div>
    </div>

    <div class="content">
        <div>
            <p style="margin-top: 0.2cm;">
                <strong>Paciente:</strong> {{ $patient->fullName }}<br>
                <strong>Documento:</strong> {{ $patient->documentType }} – {{ $patient->documentNumber }}<br>
                <strong>Edad/Sexo:</strong> {{ $patient->age }} años / {{ $patient->sex }}
            </p>
            <p>
                <strong>Fecha:</strong> {{ \Carbon\Carbon::parse($appointment->date)->format('d/m/Y') }}
                &nbsp;|&nbsp;
                <strong>Hora:</strong> {{ \Carbon\Carbon::parse($appointment->hour)->format('h:i A') }}<br>
                <strong>Motivo:</strong> {{ $appointment->reason }}
            </p>
        </div>

        <div>
            <div class="sectionTitle">Prescripción</div>
            <div class="prescriptionList">
                @foreach($prescription->medications as $med)
                    <div class="prescriptionItem">
                        <span class="medName">
                            {{ $med['genericName'] }} {{ $med['concentration'] }} 
                            @if(!empty($med['presentation']))
                                ({{ $med['presentation'] }})
                            @endif
                            — {{ $med['dosageDescription'] }}
                        </span>
                        <span class="dosageInfo">
                            Dosificación: {{ $med['frequency'] }} veces al día, por
                            {{ $med['duration'] == 1 ? '1 día' : $med['duration'] . ' días' }}.
                        </span>
                        <span class="dosageInfo">
                            Indicaciones: {{ $med['instructions'] }}
                        </span>
                    </div>
                @endforeach
            </div>

            @if(!empty($prescription->notes))
                <p><strong>Nota:</strong> {{ $prescription->notes }}</p>
            @endif
        </div>

        <div class="doctorInfo">
            <div class="signatureLine">
                Dr(a). {{ $doctor->fullName }}<br>
                CMP N° {{ $doctor->registrationNumber }}
            </div>
        </div>

    </div>

    <div class="footer">
        Este documento es confidencial y de uso exclusivo para la dispensación farmacéutica.
    </div>

</body>

</html>