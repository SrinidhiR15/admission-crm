# Admission CRM

A full-stack admission management application built with ASP.NET Core Web API, Entity Framework Core, SQL Server, and React.

## Backend

### Requirements
- .NET 9 SDK
- SQL Server or SQL Server Express
- Node.js/npm (for frontend)

### Setup

1. Restore NuGet packages:

```bash
dotnet restore
```

2. Create the database and apply migrations:

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```

If you already have `dotnet-ef`, skip the install step.

3. Run the backend:

```bash
dotnet run
```

The API will run at `http://localhost:5000`.

## Frontend

### Setup

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, typically `http://localhost:5173`.

## Free Deployment Options

- Frontend: Vercel or Netlify
- Backend: Railway or Azure App Service Free tier
- Database: Azure SQL free tier or use a local SQL Server instance for the demo

## Notes

- The frontend uses `VITE_API_BASE_URL` to call the backend.
- The backend exposes APIs for programs, applicants, seat matrix, and admissions.
- Use the React UI to create programs, applicants, seat matrices, and allocate admissions.
