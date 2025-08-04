<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte de Entrega de EPP - {{ $patientFullName }} - {{ $date }}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm 1.5cm;
        }

        body {
            font-family: helvetica, sans-serif;
            font-size: 9pt;
            line-height: 1.2;
            margin-top: 60px;
        }

        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            border-bottom: 1.5px solid #000;
            background: #fff;
            z-index: 1000;
            padding-bottom: 6px;
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
            color: #fff;
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
            vertical-align: top;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: left;
            width: 20%;
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

        .no-break {
            page-break-inside: avoid;
        }

        .text-justify {
            text-align: justify;
        }
    </style>
</head>

<body>
    <div class="header no-break">
        <img src="{{ public_path('logo-horizontal.png') }}" alt="Logo" class="logo">
        <div class="info">
            <strong>REGISTRO DE ENTREGA DE EQUIPOS DE PROTECCIÓN PERSONAL (EPP)</strong><br>
            Emitido: {{ now()->format('d/m/Y h:i a') }}
        </div>
    </div>
    <div class="section">
        <div class="section-title">Información de la Entrega</div>
        <table>
            <tr>
                <th>Fecha de Entrega</th>
                <td>{{ $date }}</td>
                <th>Ítem EPP</th>
                <td>{{ $eppItem }}</td>
            </tr>
            <tr>
                <th>Cantidad</th>
                <td>{{ $quantity }}</td>
                <th>Condición</th>
                <td>{{ $condition }}</td>
            </tr>
            <tr>
                <th>Observaciones</th>
                <td colspan="3">{{ $observations ?? 'Ninguna' }}</td>
            </tr>
        </table>
    </div>
    <div class="section">
        <div class="section-title">Información del Trabajador</div>
        <table>
            <tr>
                <th style="width: 21%">Nombre Completo</th>
                <td>{{ $patientFullName }}</td>
                <th style="width: 13%">Documento</th>
                <td style="width: 20%">{{ $patientDocument }}</td>
            </tr>
            <tr>
                <th>Fecha de Nacimiento</th>
                <td>
                    @if (!empty($patientBirthdate))
                        {{ $patientBirthdate }}
                    @endif
                </td>
                <th>Edad</th>
                <td>
                    @if (!empty($patientAge))
                        {{ $patientAge }} años
                    @endif
                </td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{{ $patientEmail }}</td>
                <th>Sexo</th>
                <td>{{ $patientSex }}</td>
            </tr>
            <tr>
                <th>Dirección</th>
                <td>{{ $patientAddress }}</td>
                <th>Teléfono</th>
                <td>{{ $patientContactNumber }}</td>
            </tr>
            <tr>
                <th>Lugar de Nacimiento</th>
                <td colspan="3">{{ $patientPlaceOfBirth }}</td>
            </tr>
            <tr>
                <th>Cargo</th>
                <td colspan="3">{{ $patientPosition }}</td>
            </tr>
            <tr>
                <th>Dependencia</th>
                <td colspan="3">{{ $patientDependence }}</td>
            </tr>
        </table>
    </div>
    <div class="signature-area">
        <div class="signature-box">
            <div class="signature-line">
                {{ $patientFullName }}
            </div>
            <div style="font-size: 8pt; margin-top: 5px;">
                Firma del Trabajador
            </div>
        </div>
    </div>

    <script type="text/php">
        if (isset($pdf)) {
            $font = $fontMetrics->get_font("helvetica, sans-serif", "normal");
            $size = 8;
            $x = $pdf->get_width() - 60;
            $y = $pdf->get_height() - 30;
            $pdf->page_text($x, $y, "Página {PAGE_NUM} de {PAGE_COUNT}", $font, $size);
        }
    </script>
</body>

</html>