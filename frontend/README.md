# Student Management System - Next.js Frontend Portal

This is the **Next.js (App Router)** frontend application for the **Student Management System**, designed to communicate with the Node.js Express RESTful backend and interactive Swagger UI.

---

## 🚀 Features

- **Modern App Router & TypeScript**: Built on Next.js 16 and React 19 with strict typing.
- **Academic KPI Cards**: Real-time summary of Total Students, Class Average, Top Scorer, and Pass Rate.
- **Student Management Table**:
  - Instant debounced search by name or roll number
  - Multi-criteria filtering by Course and Semester
  - Flexible sorting (by Roll No, Name, Marks, Semester, Age) in ascending/descending order
  - Visual letter grade badges (`A+`, `A`, `B`, `C`, `D`, `E`, `F`) and result status (`PASS`/`FAIL`)
- **Interactive Modals**:
  - **Enroll Student**: Input validation with inline warnings for age (1-100), semester (1-12), marks (0-100), and non-empty name/course.
  - **Edit Student**: Partial updates with immutable roll number enforcement.
  - **Academic Report Card / Transcript**: Clean student detail card with circular score gauge and grade classification.
  - **Analytics & Histogram**: Visual grade distribution and department breakdown charts.
  - **Architecture & Workflow**: System comparison between Python CLI, Node.js Express, and Next.js.
- **API Integration**: Connects to the Express backend (`http://localhost:3000/api/v1`) with automatic proxy rewrites and backend health status ping.

---

## 🛠️ How to Run

### 1. Ensure the Express Backend is Running
In the root directory or in another terminal:
```bash
cd ..
npm start
```
The backend will run on `http://localhost:3000` (and Swagger UI at `http://localhost:3000/api-docs`).

### 2. Start the Next.js Frontend
In this `frontend` directory:
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) or [http://localhost:3000](http://localhost:3000) in your browser to view the application!

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts & metadata
│   │   ├── page.tsx           # Main Student Management Dashboard page
│   │   └── globals.css        # Tailwind CSS imports
│   ├── components/
│   │   ├── Navbar.tsx         # Academic brand bar with live API health ping
│   │   ├── KpiCards.tsx       # 4 Academic metric cards
│   │   ├── StudentTable.tsx   # Table with search, filters, badges, and actions
│   │   ├── StudentModal.tsx   # Add / Edit student form modal
│   │   ├── StudentDetailModal.tsx # Report card / transcript view
│   │   ├── AnalyticsModal.tsx # Grade histogram & department analytics
│   │   ├── WorkflowModal.tsx  # System architecture & lifecycle diagram
│   │   └── Toast.tsx          # Real-time event notifications
│   ├── lib/
│   │   └── api.ts             # Centralized typed API client
│   └── types/
│       └── student.ts         # TypeScript interfaces & types
├── next.config.ts             # Next.js config with API proxy rewrites
└── package.json               # Next.js, React, Tailwind, Lucide dependencies
```
