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

| Service | Technology | Port | Access URL | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| **Next.js Web Portal** | Next.js 16 + React 19 | **`3001`** | **`http://localhost:3001`** | Responsive Student Dashboard, KPI Cards, Directory & Transcripts |
| **Backend REST API** | Node.js + Express | **`5000`** | **`http://localhost:5000`** | REST API endpoints, business logic, atomic file I/O |
| **Interactive Swagger UI** | OpenAPI 3.0 / Swagger | **`5000`** | **`http://localhost:5000/api-docs`** | Live API testing sandbox for professors & evaluators |
| **Backend Health Check** | Express Handler | **`5000`** | **`http://localhost:5000/api/v1/health`** | Uptime, memory, and runtime diagnostics |

> **Why Port 3001 for Frontend & Port 5000 for Backend?**  
> In local development environments, port 3000 is frequently occupied by background system services or existing PWAs. Running the Next.js Frontend on **Port 3001** and the Express API on **Port 5000** guarantees a 100% clean, conflict-free setup with zero port collisions or cached service worker interference!

---

## ⚡ Quick Start & Execution Guide

### 1. Installation
Install both backend and frontend dependencies:
```bash
npm install
npm run frontend:install
```

### 2. Start the Express Backend Server (Port 5000)
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

### 3. Start the Next.js Frontend Portal (Port 3001)
In your second terminal window:
```bash
npm run frontend
```
Console output:
```
▲ Next.js 16.4.6 (Turbopack)
- Local:        http://localhost:3001
- Environments: .env.local
```

Now open **`http://localhost:3001`** in your browser to view the Student Management System!
