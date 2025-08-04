<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>PJP - Sistema de Gestión de Salud Ocupacional y Clínica</title>
    @viteReactRefresh
    @vite('resources/app/main.tsx')
</head>

<body>
    <div id="root">
    </div>
</body>

</html>