@echo off
REM setup.bat - Windows version of project structure setup

echo Creating BI Dashboard System project structure...

REM Create root directory
mkdir bi-dashboard-system
cd bi-dashboard-system

REM ============================================
REM ETL PIPELINE APPLICATION
REM ============================================
echo Setting up ETL Pipeline structure...

REM Create ETL directories
mkdir etl-pipeline\app\api
mkdir etl-pipeline\app\models
mkdir etl-pipeline\app\schemas
mkdir etl-pipeline\app\services
mkdir etl-pipeline\app\utils
mkdir etl-pipeline\alembic\versions
mkdir etl-pipeline\uploads

REM Create ETL files
type nul > etl-pipeline\requirements.txt
type nul > etl-pipeline\.env.example
type nul > etl-pipeline\.env
type nul > etl-pipeline\.gitignore
type nul > etl-pipeline\alembic.ini
type nul > etl-pipeline\README.md

REM App package files
type nul > etl-pipeline\app\__init__.py
type nul > etl-pipeline\app\main.py
type nul > etl-pipeline\app\config.py
type nul > etl-pipeline\app\database.py

REM Models
type nul > etl-pipeline\app\models\__init__.py
type nul > etl-pipeline\app\models\user.py
type nul > etl-pipeline\app\models\role.py
type nul > etl-pipeline\app\models\organization.py
type nul > etl-pipeline\app\models\dashboard.py
type nul > etl-pipeline\app\models\data_model.py
type nul > etl-pipeline\app\models\upload.py
type nul > etl-pipeline\app\models\audit.py

REM Schemas
type nul > etl-pipeline\app\schemas\__init__.py
type nul > etl-pipeline\app\schemas\user.py
type nul > etl-pipeline\app\schemas\role.py
type nul > etl-pipeline\app\schemas\data_model.py
type nul > etl-pipeline\app\schemas\upload.py
type nul > etl-pipeline\app\schemas\dashboard.py

REM Services
type nul > etl-pipeline\app\services\__init__.py
type nul > etl-pipeline\app\services\auth_service.py
type nul > etl-pipeline\app\services\user_service.py
type nul > etl-pipeline\app\services\data_model_service.py
type nul > etl-pipeline\app\services\upload_service.py

REM Utils
type nul > etl-pipeline\app\utils\__init__.py
type nul > etl-pipeline\app\utils\security.py
type nul > etl-pipeline\app\utils\file_handler.py
type nul > etl-pipeline\app\utils\audit.py

REM API
type nul > etl-pipeline\app\api\__init__.py
type nul > etl-pipeline\app\api\dependencies.py
type nul > etl-pipeline\app\api\auth.py
type nul > etl-pipeline\app\api\users.py
type nul > etl-pipeline\app\api\data_models.py
type nul > etl-pipeline\app\api\uploads.py

REM Alembic
type nul > etl-pipeline\alembic\env.py
type nul > etl-pipeline\alembic\script.py.mako

REM ============================================
REM DASHBOARD APPLICATION
REM ============================================
echo Setting up Dashboard Application structure...

REM Create Dashboard directories
mkdir dashboard-app\app\api\auth\[...nextauth]
mkdir dashboard-app\app\api\users\[id]\approve
mkdir dashboard-app\app\api\data-models
mkdir dashboard-app\app\api\dashboards
mkdir dashboard-app\app\api\uploads
mkdir dashboard-app\app\auth\signin
mkdir dashboard-app\app\auth\signup
mkdir dashboard-app\app\auth\forgot-password
mkdir dashboard-app\app\auth\error
mkdir dashboard-app\app\dashboard\analytics
mkdir dashboard-app\app\dashboard\data-models
mkdir dashboard-app\app\dashboard\organization
mkdir dashboard-app\app\dashboard\reports
mkdir dashboard-app\app\dashboard\roles
mkdir dashboard-app\app\dashboard\settings
mkdir dashboard-app\app\dashboard\uploads
mkdir dashboard-app\app\dashboard\users
mkdir dashboard-app\app\dashboard\profile
mkdir dashboard-app\components\layout
mkdir dashboard-app\components\providers
mkdir dashboard-app\components\ui
mkdir dashboard-app\components\dashboard
mkdir dashboard-app\components\forms
mkdir dashboard-app\lib
mkdir dashboard-app\prisma
mkdir dashboard-app\public
mkdir dashboard-app\types

REM Root files
type nul > dashboard-app\package.json
type nul > dashboard-app\.env.example
type nul > dashboard-app\.env.local
type nul > dashboard-app\.gitignore
type nul > dashboard-app\next.config.js
type nul > dashboard-app\tsconfig.json
type nul > dashboard-app\tailwind.config.ts
type nul > dashboard-app\postcss.config.js
type nul > dashboard-app\README.md

REM App files
type nul > dashboard-app\app\layout.tsx
type nul > dashboard-app\app\page.tsx
type nul > dashboard-app\app\globals.css

REM Auth pages
type nul > dashboard-app\app\auth\signin\page.tsx
type nul > dashboard-app\app\auth\signup\page.tsx
type nul > dashboard-app\app\auth\forgot-password\page.tsx
type nul > dashboard-app\app\auth\error\page.tsx

REM Dashboard pages
type nul > dashboard-app\app\dashboard\page.tsx
type nul > dashboard-app\app\dashboard\analytics\page.tsx
type nul > dashboard-app\app\dashboard\data-models\page.tsx
type nul > dashboard-app\app\dashboard\organization\page.tsx
type nul > dashboard-app\app\dashboard\reports\page.tsx
type nul > dashboard-app\app\dashboard\roles\page.tsx
type nul > dashboard-app\app\dashboard\settings\page.tsx
type nul > dashboard-app\app\dashboard\uploads\page.tsx
type nul > dashboard-app\app\dashboard\users\page.tsx
type nul > dashboard-app\app\dashboard\profile\page.tsx

REM API routes
type nul > dashboard-app\app\api\auth\[...nextauth]\route.ts
type nul > dashboard-app\app\api\auth\register\route.ts
type nul > dashboard-app\app\api\users\route.ts
type nul > dashboard-app\app\api\users\[id]\route.ts
type nul > dashboard-app\app\api\users\[id]\approve\route.ts
type nul > dashboard-app\app\api\data-models\route.ts
type nul > dashboard-app\app\api\dashboards\route.ts
type nul > dashboard-app\app\api\uploads\route.ts

REM Components
type nul > dashboard-app\components\layout\DashboardLayout.tsx
type nul > dashboard-app\components\layout\Sidebar.tsx
type nul > dashboard-app\components\layout\Header.tsx
type nul > dashboard-app\components\layout\Footer.tsx
type nul > dashboard-app\components\providers\Providers.tsx
type nul > dashboard-app\components\ui\Button.tsx
type nul > dashboard-app\components\ui\Input.tsx
type nul > dashboard-app\components\ui\Select.tsx
type nul > dashboard-app\components\ui\Card.tsx
type nul > dashboard-app\components\ui\Modal.tsx
type nul > dashboard-app\components\ui\Badge.tsx
type nul > dashboard-app\components\ui\Table.tsx
type nul > dashboard-app\components\ui\Tabs.tsx
type nul > dashboard-app\components\ui\Alert.tsx
type nul > dashboard-app\components\ui\Loading.tsx

REM Lib files
type nul > dashboard-app\lib\prisma.ts
type nul > dashboard-app\lib\auth.ts
type nul > dashboard-app\lib\utils.ts
type nul > dashboard-app\lib\validations.ts
type nul > dashboard-app\lib\api.ts

REM Prisma
type nul > dashboard-app\prisma\schema.prisma
type nul > dashboard-app\prisma\seed.ts

REM Types
type nul > dashboard-app\types\index.ts
type nul > dashboard-app\types\next-auth.d.ts
type nul > dashboard-app\types\api.ts

REM Public
type nul > dashboard-app\public\logo.png
type nul > dashboard-app\public\favicon.ico
type nul > dashboard-app\public\robots.txt

REM ============================================
REM ROOT LEVEL FILES
REM ============================================
echo Creating root level files..