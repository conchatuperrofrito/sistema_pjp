<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte de Evento - {{ $event['title'] }} - {{ now()->format('Y-m-d') }}</title>
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
    </style>
</head>

<body>
    <div class="header no-break">
        <img src="{{ public_path('logo-horizontal.png') }}" alt="Logo" class="logo">
        <div class="info">
            <strong>REGISTRO DE CAPACITACIONES, ENTRENAMIENTOS Y SIMULACROS</strong><br>
            Emitido: {{ now()->format('d/m/Y h:i a') }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Información del Evento</div>
        <table>
            <tr>
                <th>Título</th>
                <td colspan="3">{{ $event['title'] }}</td>
            </tr>
            <tr>
                <th>Subtítulo</th>
                <td colspan="3">{{ $event['subtitle'] }}</td>
            </tr>
            <tr>
                <th>Descripción</th>
                <td colspan="3">{{ $event['description'] }}</td>
            </tr>
            <tr>
                <th>Recinto</th>
                <td colspan="3">{{ $event['venueName'] }}</td>
            </tr>
            <tr>
                <th>Dirección</th>
                <td colspan="3">{!! nl2br(e($event['venueAddress'])) !!}</td>
            </tr>
            <tr>
                <th>Público Objetivo</th>
                <td colspan="3">{{ $event['targetAudience'] }}</td>
            </tr>
            <tr>
                <th>Organizador</th>
                <td colspan="3">{{ $event['organizer'] }}</td>
            </tr>
            <tr>
                <th>Área Organizadora</th>
                <td colspan="3">{{ $event['organizingArea'] }}</td>
            </tr>
            <tr>
                <th>Registrado por</th>
                <td colspan="3">{{ $user['fullName'] }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Lista de Participantes</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 2%; text-align: center;">#</th>
                    <th>Nombre Completo</th>
                    <th style="width: 10%;">Documento</th>
                    <th>Cargo</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($participants as $idx => $p)
                    <tr>
                        <td class="text-center">{{ $idx + 1 }}</td>
                        <td>{{ $p['fullName'] }}</td>
                        <td>{{ $p['documentTypeAbreviated'] }} - {{ $p['documentNumber'] }}</td>
                        <td>{{ $p['position'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
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