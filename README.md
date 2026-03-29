# Admission CRM

Admission CRM is a full-stack university admission management application built with:

- **Backend:** .NET 9 Web API with Entity Framework Core and SQL Server
- **Frontend:** React + Vite
- **Data model:** Programs, Applicants, Seat Matrix, Admissions, Quotas

## Features

- Manage programs and applicants
- Define seat matrix quotas for KCET, COMEDK, and Management
- Allocate admissions by quota
- Track fee payment and confirmation
- Dashboard with quota summary and pending items

## Repository structure

- `backend/` — ASP.NET Core Web API project
- `frontend/` — React frontend built with Vite

## Prerequisites

- .NET 9 SDK
- Node.js 18+ and npm
- SQL Server Express / SQL Server / Azure SQL

## Local setup

### 1. Configure the database

The backend uses SQL Server. The default connection string is in `backend/appsettings.json`:

```json
"DefaultConnection": "Server=.\\SQLEXPRESS22;Database=AdmissionCRM;Trusted_Connection=True;TrustServerCertificate=True;"
```

Update this value if you are using:

- `localhost` or `127.0.0.1`
- `localhost\\SQLEXPRESS`
- LocalDB: `Server=(localdb)\\MSSQLLocalDB`
- Azure SQL connection string

### 2. Create or update the database

From the `backend/` folder:

```bash
cd backend
dotnet restore
```

If you have the EF Core CLI installed, apply migrations:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update
```

If you do not have the tool installed, you can install it globally or run it as a local tool.

### 3. Start the backend

From `backend/`:

```bash
dotnet run --launch-profile http
```

This starts the API. By default it will listen on `http://localhost:5000` and `https://localhost:5001`.

### 4. Start the frontend

From `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

### 5. Configure the frontend API base URL

The frontend sends requests to `http://localhost:5000` by default. If your backend runs on a different URL, set `VITE_API_BASE_URL` before starting the frontend.

For Windows PowerShell:

```powershell
$env:VITE_API_BASE_URL = 'https://localhost:5001'
npm run dev
```

For macOS / Linux:

```bash
export VITE_API_BASE_URL='https://localhost:5001'
npm run dev
```

## Development workflow

- `frontend/src/api.js` contains the API client and base URL logic
- `frontend/src/pages/` contains the page components for dashboard, programs, applicants, seat matrix, allocation, and admissions
- `backend/Controllers` contains the API endpoints
- `backend/Models` contains the EF Core entities
- `backend/Data/AppDbContext.cs` contains the database context

## Free deployment options

### Frontend

For the React app, the easiest free hosting options are:

- **Vercel** — deploy directly from GitHub; build command: `npm run build`; output directory: `dist`
- **Netlify** — same setup as Vercel

### Backend

For the .NET API, these free/low-cost options are practical for development:

- **Render** / **Railway** — deploy the .NET app from GitHub
- **Azure App Service** — free tier is limited, but available for dev/test

### Database

Because this project uses SQL Server, the free database options are:

- **Azure SQL** — has free credits and trial options
- **SQL Server Express** or **LocalDB** on a self-hosted machine
- **Docker** with SQL Server Express for development

### Recommended free deployment path

1. Host the frontend on Vercel or Netlify
2. Host the backend on Render, Railway, or Azure App Service
3. Use an Azure SQL free/trial database or a self-hosted SQL Server instance
4. Configure the frontend `VITE_API_BASE_URL` to point to the deployed backend URL

## Notes

- This project is built for demonstration and small-scale admission workflows.
- For production, secure the API, enable authentication, and use a managed production database.
- Make sure the backend and frontend are allowed to communicate via CORS.

## Useful commands

```bash
# Backend
cd backend
dotnet restore
dotnet run --launch-profile http

# Frontend
cd frontend
npm install
npm run dev
```

## Contact

If you want, I can also help you add Docker support or a deployment pipeline for Vercel/Render/Azure.