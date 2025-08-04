<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Historial de citas médicas - {{$patient["fullName"]}} - {{now()->format('Y-m-d')}}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm 1.5cm;
        }

        body {
            font-family: helvetica, sans-serif;
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
            text-align: left;
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
    <div class="header no-break">
        <img src="{{ public_path('logo-horizontal.png') }}" alt="Logo" class="logo">
        <div class="info">
            <strong>HISTORIAL DE CITAS MÉDICAS</strong><br>
            Emitido: {{ date('d/m/Y h:i a') }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Información del Paciente</div>
        <table>
            <tr>
                <th style="width: 21%">Nombre Completo</th>
                <td>{{ $patient['fullName'] }}</td>
                <th style="width: 13%">Documento</th>
                <td style="width: 20%">{{ $patient['documentTypeAbreviated'] }} - {{ $patient['documentNumber'] }}</td>
            </tr>
            <tr>
                <th>Fecha de Nacimiento</th>
                <td>
                    @if (!empty($patient['birthdate']))
                        {{ \Carbon\Carbon::parse($patient['birthdate'])->format('d/m/Y') }}
                    @endif
                </td>
                <th>Edad</th>
                <td>
                    @if (!empty($patient['birthdate']))
                        {{ $patient['age'] }} años
                    @endif
                </td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{{ $patient['email'] }}</td>
                <th>Sexo</th>
                <td>{{ $patient['sex'] }}</td>
            </tr>
            <tr>
                <th>Dirección</th>
                <td>{{ $patient['address'] }}</td>
                <th>Teléfono</th>
                <td>{{ $patient['contactNumber'] }}</td>
            </tr>
            <tr>
                <th>Lugar de Nacimiento</th>
                <td colspan="3">{{ $patient['placeOfBirth'] }}</td>
            </tr>
            <tr>
                <th>Cargo</th>
                <td colspan="3">{{ $patient['position'] }}</td>
            </tr>
            <tr>
                <th>Dependencia</th>
                <td colspan="3">{{ $patient['dependence'] }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Historial de Citas</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 120px;">Fecha y Hora</th>
                    <th>Especialidad</th>
                    <th>Médico</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($appointments as $appointment)
                    <tr>
                        <td>{{ $appointment['date'] }} {{ $appointment['hour'] }}</td>
                        <td>{{ $appointment['specialty'] }}</td>
                        <td>{{ $appointment['doctor'] }}</td>
                        <td>{{ $appointment['reason'] }}</td>
                        <td>{{ $appointment['status'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <script type="text/php">
        if (isset($pdf)) {
            $font = $fontMetrics->get_font("helvetica, sans-serif", "normal");
            $size = 8;

            $marginLeft = 42.525;
            $marginRight = 42.525;

            $usableWidth = $pdf->get_width() - $marginLeft - $marginRight;

            $pdf->page_text($usableWidth, 800, "Página {PAGE_NUM} de {PAGE_COUNT}", $font, $size);
        }
    </script>
</body>

</html>