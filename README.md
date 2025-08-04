# DOCUMENTACIÓN 
# Sistema de Gestión de Salud y Ocupacional

Repositorio: [https://github.com/lalechelml/clinical\_appointment\_PJP-app.git](https://github.com/lalechelml/clinical_appointment_PJP-app.git](https://github.com/lalechelml/clinical_appointment_PJP-app).

Este proyecto es una aplicación web para la gestión integral de pacientes, citas médicas y los módulos de Seguridad y Salud en el Trabajo (SST), desarrollado con **Laravel 11** en el backend y **React** en el frontend.

## Requisitos

* **PHP** ≥ 8.2 con extensiones habilitadas mínimas:

  * `pdo_mysql` (conector MySQL), `mbstring`, `openssl`, `xml`, `gd` (para DomPDF) y `sqlite3`/`pdo_sqlite` (para TNTSearch).
* **Composer**
* **Node.js** ≥ 14.x y **npm** o **Yarn**
* **MySQL** (u otro motor compatible con PDO)

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/lalechelml/clinical_appointment_PJP-app.git
   cd clinical_appointment_PJP-app
   ```

2. **Instalar dependencias de PHP**

   ```bash
   composer install
   ```

3. **Configurar entorno**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Modificar en `.env` únicamente las variables que difieren entre local y producción**

Ajusta en el archivo `.env` las siguientes variables:

| Variable         | Local                 | Producción             |   
| ---------------- | --------------------- | ---------------------- | 
| `DB_DATABASE`    | `<nombre_bd_local>`   | `<nombre_bd_prod>`     |   
| `DB_USERNAME`    | `<usuario_bd_local>`  | `<usuario_bd_prod>`    |   
| `DB_PASSWORD`    | `<tu_contraseña_db>`  | `<tu_contraseña_prod>` |   
| `SESSION_DOMAIN` | `localhost`           | `.dominio.com`         |   
| `VITE_API_URL`   | `${APP_URL}:8000/api` | `${APP_URL}/api`       |



5. **Instalar y compilar frontend**

   ```bash
   npm install        # o yarn install
   npm run dev        # desarrollo
   npm run build      # producción
   ```

6. **Migrar base de datos y ejecutar seeders**

   ```bash
   php artisan migrate
   php artisan db:seed
   ```

## Comandos útiles

* `php artisan migrate:fresh --seed`: limpia y vuelve a ejecutar migraciones y seeders.
* `php artisan scout:import`: (re)indexa modelos para la búsqueda full-text.
* `npm run dev` / `npm run build`: compila los assets de React.

---

Con estos pasos tendrás tu entorno listo tanto en local como en producción. Asegúrate de habilitar las extensiones PHP requeridas (incluyendo `sqlite3` y `pdo_sqlite` para TNTSearch) antes de ejecutar las migraciones y los seeders.
