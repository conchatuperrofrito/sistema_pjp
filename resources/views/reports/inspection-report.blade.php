<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte de Inspección - {{ $area }} - {{ $date }}</title>
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

        .severity-high {
            color: #d32f2f;
            font-weight: bold;
        }

        .severity-medium {
            color: #f57c00;
            font-weight: bold;
        }

        .severity-low {
            color: #388e3c;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header no-break">
        <img src="{{ public_path('logo-horizontal.png') }}" alt="Logo" class="logo">
        <div class="info" style="max-width: 50%;">
            <strong>REGISTRO DE INSPECCIONES INTERNAS DE SEGURIDAD Y SALUD EN EL TRABAJO</strong><br>
            Emitido: {{ now()->format('d/m/Y h:i a') }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Información de la Inspección</div>
        <table>
            <tr>
                <th>Fecha de Inspección</th>
                <td>{{ $date }}</td>
                <th>Área Inspeccionada</th>
                <td>{{ $area }}</td>
            </tr>
            <tr>
                <th>Inspector</th>
                <td colspan="3">{{ $inspector }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Hallazgos de la Inspección</div>
        <table>
            <tr>
                <th>Hallazgos Identificados</th>
                <td class="text-justify">{{ $findings }}</td>
            </tr>
            <tr>
                <th>Nivel de Severidad</th>
                <td>
                    {{ $severity }}
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Recomendaciones y Acciones Correctivas</div>
        <table>
            <tr>
                <th>Recomendaciones</th>
                <td class="text-justify">{{ $recommendations }}</td>
            </tr>
            <tr>
                <th>Responsable de Corrección</th>
                <td>{{ $correctionResponsible }}</td>
            </tr>
            <tr>
                <th>Fecha Límite de Corrección</th>
                <td>
                    @if (!empty($correctionDeadline))
                        {{ $correctionDeadline }}
                    @else
                        No especificada
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <div class="signature-area">
        <div class="signature-box">
            <div class="signature-line">
                {{ $inspector }}
            </div>
            <div style="font-size: 8pt; margin-top: 5px;">
                Inspector Responsable
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