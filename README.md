# 🎓 Admission Management CRM

A full-stack web application to manage college admissions with quota-based seat allocation and validation.

---

## 🚀 Tech Stack

* **Backend:** ASP.NET Core Web API (.NET 9, Entity Framework Core)
* **Frontend:** React (Vite)
* **Database:** SQL Server

---

## ✨ Key Features

* 📌 Program & Seat Matrix configuration
* 👨‍🎓 Applicant management
* 🎯 Quota-based seat allocation (KCET / COMEDK / Management)
* 🚫 Prevents seat overbooking using real-time validation
* 🔢 Unique admission number generation
* 💰 Admission confirmation only after fee payment
* 📊 Dashboard with:

  * Total seats vs admitted
  * Quota-wise allocation
  * Pending documents & fees

---

## 📁 Project Structure

```
AdmissionCRM/
 ├── backend/    → .NET Web API
 ├── frontend/   → React (Vite)
 └── README.md
```

---

## ⚙️ Prerequisites

* .NET 9 SDK
* Node.js (v18+)
* SQL Server / SQL Server Express / Azure SQL

---

## 🛠️ Local Setup

### 1️⃣ Backend Setup

```bash
cd backend
dotnet restore
```

Update connection string in `appsettings.json`:

```json
"DefaultConnection": "Server=.;Database=AdmissionCRM;Trusted_Connection=True;TrustServerCertificate=True;"
```

Run migrations:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update
```

Start backend:

```bash
dotnet run
```

👉 Runs on: http://localhost:5000
👉 Swagger: http://localhost:5000/swagger

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

👉 Runs on: http://localhost:5173

---

### 3️⃣ API Configuration

Ensure frontend connects to backend:

```javascript
const API = "http://localhost:5000/api";
```

---

## 🧪 How to Use

1. Create Program
2. Define Seat Matrix (quota distribution)
3. Add Applicants
4. Allocate Seat (based on quota availability)
5. Mark Fee as Paid
6. Confirm Admission
7. View Dashboard

---

## 🌐 Deployment (Free)

### Frontend

* Netlify / Vercel
* Build command: `npm run build`
* Output directory: `dist`

### Backend

* Render / Railway / Azure App Service

### Database

* Azure SQL (free tier) or SQL Server Express

---

## 🔥 Key Highlights

* ✔ Prevents quota violations (no overbooking)
* ✔ Clean REST API architecture
* ✔ Separation of frontend & backend
* ✔ Real-world admission workflow implementation

---

## 🤖 AI Usage

AI tools were used as development aids:

* **ChatGPT** – for project structuring, understanding requirements, and debugging issues
* **GitHub Copilot** – for code suggestions and faster implementation
* **Kilo Code** – for assistance in writing and refining parts of the code

All core logic, design decisions, and implementation were reviewed, understood, and validated manually.


---

## 📌 Notes

* Built as per assignment requirements
* No payment gateway or authentication included (out of scope)

---

## 📬 Contact

**Srinidhi R**
