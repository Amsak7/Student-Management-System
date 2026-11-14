# Student Management System (Node.js & Express RESTful API)

> **Academic Project Submission & Demonstration**  
> **Course:** Web Technologies / Advanced Software Engineering  
> **Target Audience:** Professors, Evaluators, and Viva Examiners  
> **Original Codebase:** [HimanshuDabralDev/student-management-system](https://github.com/HimanshuDabralDev/student-management-system.git) (Legacy Python CLI)

---

## 📌 Executive Summary

This project delivers a complete enterprise-grade refactoring of the legacy Python console-based Student Management System into a modern, asynchronous, non-blocking **RESTful API** powered by **Node.js** and **Express.js**.

To provide a first-class demonstration experience for our professors:
1. **Interactive Swagger UI (OpenAPI 3.0)** is mounted directly at [`/api-docs`](http://localhost:3000/api-docs) to allow real-time interactive testing of all HTTP endpoints with pre-configured schemas and examples.
2. A **Live Academic Web Dashboard** is hosted at [`/`](http://localhost:3000) showcasing live KPI metrics, search, sorting, filtering, and student record management.
3. A formal, printable **Academic Project Report (.docx)** has been compiled and placed at `Student_Management_System_Project_Report.docx`.

---

## 🏛️ Architecture: Python CLI vs. Node.js Express

| Metric / Feature | Legacy Python System (`main.py`) | Refactored Node.js & Express System |
| :--- | :--- | :--- |
| **Execution Paradigm** | Single-threaded, synchronous, blocking I/O | Event-driven, asynchronous, non-blocking Event Loop |
| **User Interface** | Text-based CLI with blocking `input()` loops | Dual Interface: Interactive Swagger UI + Web Dashboard |
| **Concurrency** | Single user only; blocks the entire terminal | Multi-tenant concurrent client handling via HTTP REST |
| **Architecture** | Monolithic procedural script (single file) | Layered MVC Pattern (Routes &rarr; Middlewares &rarr; Controllers &rarr; Services &rarr; Repositories &rarr; Data) |
| **Error Handling** | Console prints; potential unhandled exceptions | Centralized Error Middleware, HTTP Status Codes (200, 201, 400, 404, 409, 500) |
| **Data Integrity** | Basic in-memory list serialized to JSON | Atomic temporary file swap (`.tmp` write &rarr; rename), input schema validation |
| **Academic Analytics** | Manual calculations / None | Built-in grading engine (A+ to F), pass/fail status, real-time statistics |
| **API Contract** | No API contract or documentation | OpenAPI 3.0.3 specification with Swagger UI sandbox |
| **Automated Testing** | None | 14 automated integration tests with `node:test` + `supertest` |

---

## 📁 Project Directory Structure

```
student-management-system/
├── original-python/                  # Cloned original Python reference code
│   ├── main.py                       # Legacy console application
│   ├── students.json                 # Original JSON dataset
│   └── README.md
│
├── node-express-sms/                 # Modern Refactored Node.js Express Application
│   ├── src/
│   │   ├── config/
│   │   │   └── index.js              # Environment & path configurations
│   │   ├── controllers/
│   │   │   └── studentController.js  # HTTP request/response handlers
│   │   ├── services/
│   │   │   └── studentService.js     # Domain logic, grading algorithm, analytics
│   │   ├── repositories/
│   │   │   └── studentRepository.js  # Atomic file persistence layer
│   │   ├── middlewares/
│   │   │   ├── errors.js             # Custom AppError, NotFound, Conflict, Validation
│   │   │   ├── errorHandler.js       # Centralized 404 & 500 error handlers
│   │   │   └── validationMiddleware.js# Input sanitization & business validation
│   │   ├── routes/
│   │   │   └── studentRoutes.js      # RESTful route definitions
│   │   ├── swagger/
│   │   │   └── swaggerDoc.js         # OpenAPI 3.0 specification & Swagger UI mount
│   │   ├── public/                   # Client-side Academic Dashboard
│   │   │   ├── index.html            # Dashboard layout & modals
│   │   │   ├── style.css             # Responsive CSS & academic badges
│   │   │   └── app.js                # Vanilla JS client controller & fetch calls
│   │   ├── data/
│   │   │   ├── students.json         # Active JSON database
│   │   │   └── seed_students.json    # Standard seed baseline
│   │   ├── app.js                    # Express app assembly & middleware wiring
│   │   └── server.js                 # HTTP listener & graceful shutdown handlers
│   │
│   ├── tests/
│   │   └── student.test.js           # 14 Automated integration tests
│   ├── .env                          # Configuration environment variables
│   ├── package.json                  # NPM metadata & dependency manifest
│   └── README.md                     # Application documentation
│
└── Student_Management_System_Project_Report.docx  # Printable Academic Project Report
```

---

## ⚡ Quick Start & Demonstration Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or later, tested on v24.11.0)
- **NPM** (v9.0.0 or later)

### 2. Installation
Open a terminal in the `node-express-sms` folder:
```bash
npm install
```

### 3. Run Automated Tests
Verify all 14 integration test cases before presenting:
```bash
npm test
```

### 4. Start the Application Server
```bash
npm start
```
*(Or use `npm run dev` for auto-reloading during development)*

The console will output:
```
================================================================
   STUDENT MANAGEMENT SYSTEM - RESTful API & SWAGGER SERVER     
================================================================
🚀 Server running on:       http://localhost:3000
📖 Interactive Swagger UI:  http://localhost:3000/api-docs
💻 Student Dashboard UI:   http://localhost:3000
🩺 Health Diagnostics:     http://localhost:3000/api/v1/health
📊 Academic Analytics:     http://localhost:3000/api/v1/students/stats
📁 Data Store:             .../src/data/students.json
================================================================
```

---

## 🎓 Demonstrating to Professors (Step-by-Step Viva Workflow)

### Stage 1: The Presentation Pitch (2 minutes)
1. **Explain the objective:** *"Professors, we identified that the legacy Python student management script was constrained to a single console terminal with blocking user inputs. We have engineered a multi-tier, non-blocking Node.js Express REST API that is production-ready, horizontally scalable, and fully documented."*
2. **Open the Web Dashboard:** Navigate to `http://localhost:3000`. Show the live KPI cards, search bar, and clean student records table.

### Stage 2: The Interactive Swagger Demo (5 minutes)
1. Navigate to `http://localhost:3000/api-docs`.
2. **Demonstrate `GET /api/v1/students`:**
   - Click **Try it out** &rarr; **Execute**.
   - Show the 200 OK response with the full student list, computed letter grades (`A+`, `A`, `B`), and pass/fail statuses.
   - Test query filters: Enter `search: Aarav` or `course: Computer Science` to show server-side filtering.
3. **Demonstrate `POST /api/v1/students` (Data Validation & Conflict Prevention):**
   - Click **Try it out**.
   - Enter a duplicate roll number (e.g., `CS101`) &rarr; click **Execute** &rarr; Show the **409 Conflict** response. Explain how this preserves data integrity.
   - Enter an invalid age (e.g., `150`) &rarr; click **Execute** &rarr; Show the **400 Bad Request** validation response.
   - Enter a valid new student &rarr; click **Execute** &rarr; Show the **201 Created** response.
4. **Demonstrate `GET /api/v1/students/{rollNumber}`:**
   - Test with lowercase `cs101` &rarr; show that case-insensitivity matches `CS101` seamlessly.
5. **Demonstrate `GET /api/v1/students/stats`:**
   - Show aggregate analytics: class average marks, top performer, lowest performer, passing percentage, and grade distribution breakdown.
6. **Demonstrate `PUT /api/v1/students/{rollNumber}`:**
   - Update marks &rarr; demonstrate that the system automatically recalculates the letter grade and pass status.
   - Explain that the `roll_number` is immutable to maintain relational integrity.
7. **Demonstrate `DELETE /api/v1/students/{rollNumber}`:**
   - Delete a record &rarr; verify deletion via subsequent GET.
8. **Demonstrate `POST /api/v1/students/reset`:**
   - Reset data back to default sample state with one click.

---

## 🌐 Complete REST API Specification

| HTTP Method | Endpoint | Description | Request Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/health` | Service health & diagnostics | None | 200 |
| **GET** | `/api/v1/students` | List all students (search, filter, sort) | Query params (`search`, `course`, `semester`, `minMarks`, `maxMarks`, `sortBy`, `order`) | 200, 500 |
| **GET** | `/api/v1/students/stats` | Academic analytics & grade distributions | None | 200, 500 |
| **GET** | `/api/v1/students/:rollNumber` | Look up student by roll number | Path param: `rollNumber` | 200, 404, 500 |
| **POST** | `/api/v1/students` | Add new student record | JSON: `roll_number`, `name`, `age`, `course`, `semester`, `marks` | 201, 400, 409, 500 |
| **PUT** | `/api/v1/students/:rollNumber` | Update student details | JSON: any of `name`, `age`, `course`, `semester`, `marks` | 200, 400, 404, 500 |
| **DELETE** | `/api/v1/students/:rollNumber` | Delete student record | Path param: `rollNumber` | 200, 404, 500 |
| **POST** | `/api/v1/students/reset` | Restore initial seed sample data | None | 200, 500 |

---

## 🧪 Test Suite Results

```
▶ Student Management System - Integration Test Suite
  ✔ 1. GET /api/v1/health should return UP status and server metrics
  ✔ 2. GET /api/v1/students should list all student records
  ✔ 3. GET /api/v1/students/:rollNumber should find student case-insensitively
  ✔ 4. GET /api/v1/students/:rollNumber should return 404 for non-existent roll number
  ✔ 5. POST /api/v1/students should successfully create a new student record
  ✔ 6. POST /api/v1/students should return 409 Conflict for duplicate roll number
  ✔ 7. POST /api/v1/students should return 400 Bad Request for invalid age (> 100)
  ✔ 8. POST /api/v1/students should return 400 Bad Request for invalid marks (> 100)
  ✔ 9. PUT /api/v1/students/:rollNumber should update allowable fields and recalculate grade
  ✔ 10. PUT /api/v1/students/:rollNumber should disallow modifying roll number
  ✔ 11. DELETE /api/v1/students/:rollNumber should delete the record
  ✔ 12. GET /api/v1/students/stats should compute accurate analytics
  ✔ 13. GET /api/v1/students with search query should filter records
  ✔ 14. GET /api-docs should serve the interactive Swagger documentation page
✔ 14 passed (100% pass rate)
```

---

## 📄 Project Report for Printing

The project documentation file is generated at:
**`Student_Management_System_Project_Report.docx`**  
*(Located in the project root directory)*

It contains the complete academic project documentation:
- Title Page & Certificate of Authenticity
- Acknowledgement & Abstract
- System Analysis & Comparative Study (Python vs Node.js)
- Software Architecture, DFD Diagrams & Data Dictionary
- OpenAPI Specification Tables
- Source Code Walkthrough
- Test Case Execution Matrix
- Viva Defense Questions & Answers
