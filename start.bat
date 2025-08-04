@echo off

REM
set "project_path=%cd%"

REM
start wt ^
-d "%project_path%" cmd /k "php artisan serve" ^; ^
split-pane -V -d "%project_path%" cmd /k "php artisan queue:work" ^; ^
split-pane -H -d "%project_path%" cmd /k "npm run dev"