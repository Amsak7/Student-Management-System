# Student Management System (Node.js Express REST API & Next.js Frontend)

> **Academic Project Submission & Demonstration**  
> **Course:** Web Technologies / Advanced Software Engineering (Capstone Project)  
> **Target Audience:** Professors, Evaluators, and Viva Examiners  
> **Original Codebase:** [HimanshuDabralDev/student-management-system](https://github.com/HimanshuDabralDev/student-management-system.git) (Legacy Python CLI)

---

## 📌 Executive Summary

This project delivers a complete enterprise-grade refactoring of the legacy Python console-based Student Management System into a modern full-stack web application:
1. **Asynchronous RESTful Backend:** Built with **Node.js** and **Express.js**, featuring layered architecture (Controllers, Services, Repositories, Middlewares), atomic crash-safe file persistence, and automated letter grading (A+ through F).
2. **Modern Next.js Frontend:** Built with **Next.js (App Router)**, **React 19**, and **Tailwind CSS**, featuring real-time academic KPI cards, instant debounced search, multi-criteria filtering, student report card transcripts, and grade distribution histograms.
3. **Interactive OpenAPI / Swagger UI:** Mounted directly at [`/api-docs`](http://localhost:5000/api-docs) to allow real-time interactive testing of all endpoints with pre-configured schemas and examples.
4. **Printable Academic Project Report (.docx):** A formal university project file compiled at `Student_Management_System_Project_Report.docx`.

---

## 🌐 Port Configuration & Service Architecture

To prevent any port collisions and follow standard full-stack web engineering practices, the application services are configured as follows:

| Service | Technology | Port | Access URL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Backend REST API** | Node.js + Express | **`5000`** | `http://localhost:5000` | REST API endpoints, business logic, atomic file I/O |
| **Interactive Swagger UI** | OpenAPI 3.0 / Swagger | **`5000`** | `http://localhost:5000/api-docs` | Live API testing sandbox for professors & evaluators |
| **Backend Health Check** | Express Handler | **`5000`** | `http://localhost:5000/api/v1/health` | Uptime, memory, and runtime diagnostics |
| **Next.js Web Portal** | Next.js 16 + React 19 | **`3000`** (or `3001`) | `http://localhost:3000` | Responsive Academic Dashboard & Student Directory |

> **Why Port 5000 for Backend?**  
> In modern web development, Port 5000 is the standard port for backend REST microservices, ensuring Port 3000 remains completely free for the user-facing Next.js frontend without any port conflicts or address collisions!

---

## 🏛️ Architecture: Python CLI vs. Node.js Express vs. Next.js

| Metric / Feature | Legacy Python System (`main.py`) | Refactored Node.js Express Backend | Modern Next.js Frontend |
| :--- | :--- | :--- | :--- |
| **Execution Paradigm** | Single-threaded, synchronous, blocking I/O | Event-driven, asynchronous V8 Event Loop | React Server & Client Components (SSR/CSR) |
| **User Interface** | Terminal text console with `input()` prompts | Interactive Swagger UI (`/api-docs`) | Responsive Web Portal with live KPI cards & modals |
| **Client Concurrency** | Exactly 1 user; process is locked | High-throughput concurrent multi-tenant REST | Real-time reactive client state management |
| **Architecture** | Monolithic procedural script (346 lines) | Layered MVC Pattern | Component-driven modular App Router architecture |
| **Error Handling** | Console prints; unhandled crash risks | Centralized Error Middleware, HTTP Status Codes | Inline field validations + toast notification alerts |
| **Persistence Safety** | Direct file overwrite (`open('w')`) | Atomic temporary-file swap mechanism | Centralized typed API client (`src/lib/api.ts`) |
| **Academic Analytics** | None | Built-in grading engine (A+ to F), pass/fail status | Dynamic grade distribution & department breakdowns |
| **Automated Testing** | Zero automated tests | 14 integration tests (`node:test` + `supertest`) | Type-safe build verification (TypeScript + Turbopack) |

---

## 📁 Project Directory Structure

```
node-express-sms/
├── src/                                  # Express RESTful Backend (Port 5000)
│   ├── config/index.js                   # Environment & port configurations
│   ├── controllers/studentController.js  # HTTP request/response handlers
│   ├── services/studentService.js        # Domain logic, grading algorithm, analytics
│   ├── repositories/studentRepository.js # Atomic file persistence layer
│   ├── middlewares/                      # Validation, errors & 404 handlers
│   ├── routes/studentRoutes.js           # RESTful route definitions
│   ├── swagger/swaggerDoc.js             # OpenAPI 3.0 specification & Swagger UI
│   ├── public/                           # Static dashboard fallback
│   ├── data/students.json                # Active JSON database
│   ├── app.js                            # Express app assembly & middleware wiring
│   └── server.js                         # HTTP listener on port 5000
│
├── frontend/                             # Modern Next.js App Router Frontend (Port 3000/3001)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                # Root layout with fonts & metadata
│   │   │   ├── page.tsx                  # Main student dashboard & table
│   │   │   └── globals.css               # Tailwind CSS theme
│   │   ├── components/
│   │   │   ├── Navbar.tsx                # Academic header with live API health ping
│   │   │   ├── KpiCards.tsx              # 4 Academic metric cards
│   │   │   ├── StudentTable.tsx          # Filterable, sortable student data table
│   │   │   ├── StudentModal.tsx          # Add & Edit student form modal
│   │   │   ├── StudentDetailModal.tsx    # Report card / academic transcript view
│   │   │   ├── AnalyticsModal.tsx        # Grade distribution histogram
│   │   │   ├── WorkflowModal.tsx         # Architecture comparison & DFD diagrams
│   │   │   └── Toast.tsx                 # Real-time event notifications
│   │   ├── lib/api.ts                    # Centralized typed API client (targets port 5000)
│   │   └── types/student.ts              # TypeScript interfaces
│   ├── next.config.ts                    # API proxy rewrites to Express backend (:5000)
│   └── package.json                      # Next.js, React, Tailwind, Lucide dependencies
│
├── tests/
│   └── student.test.js                   # 14 Automated integration tests
├── Student_Management_System_Project_Report.docx # Printable Academic Project Report
├── package.json                          # Backend dependencies & frontend helper scripts
└── README.md                             # Project documentation
```

---

## ⚡ Quick Start & Execution Guide

### 1. Installation
Install both backend and frontend dependencies:
```bash
npm install
npm run frontend:install
```

### 2. Run Automated Backend Tests
Verify all 14 integration test cases:
```bash
npm test
```

### 3. Start the Express Backend Server (Port 5000)
In your first terminal window:
```bash
npm start
```
Console output:
```
================================================================
   STUDENT MANAGEMENT SYSTEM - RESTful API & SWAGGER SERVER     
================================================================
🚀 Server running on:       http://localhost:5000
📖 Interactive Swagger UI:  http://localhost:5000/api-docs
💻 Student Dashboard UI:   http://localhost:5000
🩺 Health Diagnostics:     http://localhost:5000/api/v1/health
📊 Academic Analytics:     http://localhost:5000/api/v1/students/stats
📁 Data Store:             .../src/data/students.json
================================================================
```

### 4. Start the Next.js Frontend Portal (Port 3000)
In your second terminal window:
```bash
npm run frontend
```
Console output:
```
▲ Next.js 16.4.6 (Turbopack)
- Local:        http://localhost:3000
- Environments: .env.local
```

Now open **`http://localhost:3000`** in your browser to interact with the full-stack portal!

---

## 🎓 Demonstrating to Professors (Step-by-Step Viva Workflow)

1. **The Executive Pitch:**  
   *"Respected professors, we transformed the entry-level Python CLI student management tool into a modern full-stack application featuring a high-performance Express.js REST API on port 5000, an interactive Swagger sandbox, and a Next.js App Router frontend on port 3000 with real-time academic KPI metrics."*
2. **Live Next.js Frontend Walkthrough (`http://localhost:3000`):**
   - Show the 4 KPI cards: Total Students, Class Average, Top Scorer, and Pass Rate.
   - Test instant search: Type `Aarav` or select Course `Computer Science` to demonstrate reactive filtering.
   - Click the Eye icon on any student row to view the **Academic Report Card / Transcript** with their letter grade and circular marks gauge.
   - Click **Add Student** to test client-side and server-side validation (e.g. invalid age > 100 or duplicate roll number).
   - Click **Analytics** to show the Grade Distribution Histogram (A+ through F) and course breakdown.
3. **Live Swagger UI Walkthrough (`http://localhost:5000/api-docs`):**
   - Click the "Swagger Docs" button in the Next.js navbar to open `http://localhost:5000/api-docs`.
   - Click **Try it out** &rarr; **Execute** on `GET /api/v1/students` and `POST /api/v1/students`.
   - Point out the `409 Conflict` duplicate check and the `201 Created` status code.
4. **Automated Testing Evidence:**
   - Run `npm test` in the terminal to display the 14 passing integration tests.
5. **Project Report File:**
   - Present the printed or digital copy of [`Student_Management_System_Project_Report.docx`](Student_Management_System_Project_Report.docx).
