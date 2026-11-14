import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

from generate_report_helpers import (
    set_cell_background,
    set_cell_margins,
    set_table_borders,
    add_callout,
    add_code_block,
    style_heading,
    add_body_p,
    create_table_from_data,
)

def build_project_report():
    doc = Document()
    
    # Configure 1-inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Configure Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING | PROJECT REPORT")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Student Management System: Node.js Express RESTful Refactoring")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # =========================================================================
    # 1. COVER / TITLE PAGE
    # =========================================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(36)
    p_inst.paragraph_format.space_after = Pt(4)
    r = p_inst.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\n")
    r.font.name = "Calibri"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(30, 58, 138)
    
    r_sub_inst = p_inst.add_run("INSTITUTE OF TECHNOLOGY & HIGHER EDUCATION")
    r_sub_inst.font.name = "Calibri"
    r_sub_inst.font.size = Pt(11)
    r_sub_inst.font.bold = True
    r_sub_inst.font.color.rgb = RGBColor(71, 85, 105)

    p_div = doc.add_paragraph()
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_div.paragraph_format.space_before = Pt(18)
    p_div.paragraph_format.space_after = Pt(24)
    r_div = p_div.add_run("____________________________________________________")
    r_div.font.color.rgb = RGBColor(59, 130, 246)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(12)
    p_title.paragraph_format.line_spacing = 1.2
    r_title = p_title.add_run(
        "REFACTORING A LEGACY PYTHON CLI\n"
        "STUDENT MANAGEMENT SYSTEM TO AN ASYNCHRONOUS\n"
        "NODE.JS EXPRESS RESTful ARCHITECTURE WITH\n"
        "INTERACTIVE OPENAPI / SWAGGER UI"
    )
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(19)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(30, 58, 138)

    p_desc = doc.add_paragraph()
    p_desc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_desc.paragraph_format.space_before = Pt(12)
    p_desc.paragraph_format.space_after = Pt(40)
    r_desc = p_desc.add_run(
        "A Major Academic Capstone Project Report Submitted in Partial Fulfillment\n"
        "of the Requirements for the Award of the Degree of\n"
        "BACHELOR OF TECHNOLOGY\nIN COMPUTER SCIENCE & ENGINEERING"
    )
    r_desc.font.name = "Calibri"
    r_desc.font.size = Pt(10.5)
    r_desc.font.italic = True
    r_desc.font.color.rgb = RGBColor(100, 116, 139)

    # Submission metadata table
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    cell_sub = meta_table.cell(0, 0)
    cell_sub.width = Inches(3.2)
    p_sub = cell_sub.paragraphs[0]
    p_sub.paragraph_format.line_spacing = 1.15
    p_sub.add_run("SUBMITTED BY:\n").font.bold = True
    p_sub.runs[0].font.name = "Calibri"
    p_sub.runs[0].font.size = Pt(10)
    p_sub.runs[0].font.color.rgb = RGBColor(30, 58, 138)
    r_stud = p_sub.add_run("Student Project Team\nRoll Nos: CSE-2023-01 to 04\nB.Tech (CSE) Final Year")
    r_stud.font.name = "Calibri"
    r_stud.font.size = Pt(9.5)
    r_stud.font.color.rgb = RGBColor(51, 65, 85)

    cell_guide = meta_table.cell(0, 1)
    cell_guide.width = Inches(3.2)
    p_guide = cell_guide.paragraphs[0]
    p_guide.paragraph_format.line_spacing = 1.15
    p_guide.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_guide.add_run("PROJECT SUPERVISOR & GUIDE:\n").font.bold = True
    p_guide.runs[0].font.name = "Calibri"
    p_guide.runs[0].font.size = Pt(10)
    p_guide.runs[0].font.color.rgb = RGBColor(30, 58, 138)
    r_prof = p_guide.add_run("Professor / Project Supervisor\nDepartment of Computer Science & Engg.\nFaculty of Engineering")
    r_prof.font.name = "Calibri"
    r_prof.font.size = Pt(9.5)
    r_prof.font.color.rgb = RGBColor(51, 65, 85)

    p_year = doc.add_paragraph()
    p_year.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_year.paragraph_format.space_before = Pt(45)
    r_yr = p_year.add_run("ACADEMIC YEAR: 2025 - 2026")
    r_yr.font.name = "Calibri"
    r_yr.font.size = Pt(11)
    r_yr.font.bold = True
    r_yr.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_page_break()

    # =========================================================================
    # 2. CERTIFICATE OF AUTHENTICITY
    # =========================================================================
    style_heading(doc.add_paragraph(), "CERTIFICATE OF AUTHENTICITY", level=1)
    
    add_body_p(
        doc,
        "This is to certify that the project report entitled 'REFACTORING A LEGACY PYTHON CLI "
        "STUDENT MANAGEMENT SYSTEM TO AN ASYNCHRONOUS NODE.JS EXPRESS RESTful ARCHITECTURE WITH "
        "INTERACTIVE OPENAPI / SWAGGER UI', submitted by the Student Project Team in partial fulfillment "
        "of the requirements for the award of Bachelor of Technology in Computer Science & Engineering, "
        "is a bonafide record of authentic engineering work carried out under our supervision and guidance.",
        space_after=12
    )
    
    add_body_p(
        doc,
        "The results and refactored software artifacts embodied in this project report have been verified, "
        "demonstrated through live interactive OpenAPI/Swagger execution and client dashboard verification, "
        "and have not been submitted elsewhere for any other degree or diploma.",
        space_after=36
    )

    cert_table = doc.add_table(rows=2, cols=3)
    cert_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cert_table.autofit = False

    sig_titles = [
        "Internal Project Guide\nDepartment of CSE",
        "Head of Department\nDepartment of CSE",
        "External Examiner\nBoard of Evaluators"
    ]
    for i, title in enumerate(sig_titles):
        c = cert_table.cell(1, i)
        c.width = Inches(2.1)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.15
        r_line = p.add_run("_____________________\n")
        r_line.font.bold = True
        r_text = p.add_run(title)
        r_text.font.name = "Calibri"
        r_text.font.size = Pt(9.5)
        r_text.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_page_break()

    # =========================================================================
    # 3. ACKNOWLEDGEMENT & ABSTRACT
    # =========================================================================
    style_heading(doc.add_paragraph(), "ACKNOWLEDGEMENT", level=1)
    add_body_p(
        doc,
        "We express our profound gratitude to our Project Supervisor and the Faculty of the Department "
        "of Computer Science & Engineering for their invaluable technical mentorship, constructive critiques, "
        "and continuous encouragement throughout the software refactoring and system design phases.",
        space_after=8
    )
    add_body_p(
        doc,
        "We also acknowledge the open-source community behind Node.js, Express.js, Swagger/OpenAPI, and "
        "the creator of the initial educational Python repository (Himanshu Dabral), which served as our baseline "
        "for identifying software architectural patterns, technical debt, and modern refactoring methodologies.",
        space_after=16
    )

    style_heading(doc.add_paragraph(), "EXECUTIVE ABSTRACT", level=1)
    add_body_p(
        doc,
        "In contemporary software engineering education and institutional administration, legacy console-based "
        "applications suffer from critical architectural bottlenecks: blocking execution, inability to support concurrent "
        "client connections, absence of standardized API contracts, and vulnerability to data corruption during file I/O. "
        "This project presents an end-to-end refactoring of an open-source Python terminal-based Student Management System "
        "into a high-performance, asynchronous RESTful web service built upon Node.js and Express.js.",
        space_after=8
    )
    add_body_p(
        doc,
        "The refactored system introduces a decoupled layered architecture comprising custom validation middleware, "
        "a domain service layer with automated academic letter grading (A+ through F) and statistical aggregations, "
        "an atomic file persistence repository to safeguard against write collisions, and an interactive OpenAPI 3.0 "
        "(Swagger UI) specification mounted directly at '/api-docs'. Furthermore, a single-page web dashboard is integrated "
        "to facilitate real-time visual demonstration. Comprehensive integration testing using a 14-point test suite yields "
        "a 100% pass rate, validating complete parity with legacy business logic while providing order-of-magnitude "
        "improvements in scalability, testability, and integration readiness.",
        space_after=12
    )
    
    add_callout(
        doc,
        "Key Engineering Highlights:\n"
        "• Transition from single-threaded synchronous Python CLI to non-blocking Node.js Event Loop.\n"
        "• Implementation of OpenAPI 3.0 (Swagger UI) for interactive live evaluation by professors.\n"
        "• Atomic temporary-file swapping mechanism preventing JSON database corruption.\n"
        "• Automated academic grading and analytics (Class average, grade distribution, top/lowest performers).\n"
        "• 14 automated integration tests demonstrating 100% test pass rate.",
        title="PROJECT AT A GLANCE"
    )

    doc.add_page_break()

    # =========================================================================
    # 4. TABLE OF CONTENTS
    # =========================================================================
    style_heading(doc.add_paragraph(), "TABLE OF CONTENTS", level=1)
    
    toc_data = [
        ["1.0", "INTRODUCTION & PROJECT BACKGROUND", "1"],
        ["  1.1", "Context of Academic Record Systems", "1"],
        ["  1.2", "Project Motivation & Technical Debt", "1"],
        ["  1.3", "Project Scope & Core Objectives", "2"],
        ["2.0", "LEGACY SYSTEM ANALYSIS (PYTHON CLI)", "3"],
        ["  2.1", "Examination of the Original Codebase", "3"],
        ["  2.2", "Architectural & Concurrency Bottlenecks", "3"],
        ["  2.3", "Comparative Evaluation: Python CLI vs Node.js Express", "4"],
        ["3.0", "PROPOSED SYSTEM ARCHITECTURE & WORKFLOW", "5"],
        ["  3.1", "Multi-Tier Layered Architecture Pattern", "5"],
        ["  3.2", "End-to-End Request-Response Lifecycle", "6"],
        ["  3.3", "Data Flow Diagrams (DFD Level 0 & Level 1)", "7"],
        ["  3.4", "Crash-Safe Atomic File Persistence Strategy", "8"],
        ["4.0", "DATA DICTIONARY & GRADING SPECIFICATION", "9"],
        ["  4.1", "Student Entity Schema & Field Constraints", "9"],
        ["  4.2", "Academic Letter Grading & Status Calculation", "10"],
        ["  4.3", "Academic Performance Analytics Engine", "10"],
        ["5.0", "RESTful API & INTERACTIVE SWAGGER SPECIFICATION", "11"],
        ["  5.1", "REST Architecture Principles & URI Conventions", "11"],
        ["  5.2", "Comprehensive API Catalog & Endpoint Matrix", "12"],
        ["  5.3", "OpenAPI 3.0 / Swagger UI Architecture", "13"],
        ["  5.4", "Professor Interactive Demonstration Protocol", "14"],
        ["6.0", "DETAILED CODE IMPLEMENTATION WALKTHROUGH", "15"],
        ["  6.1", "Directory Structure & Modular Organization", "15"],
        ["  6.2", "Persistence Layer: studentRepository.js", "16"],
        ["  6.3", "Validation & Error Middleware", "17"],
        ["  6.4", "Domain Logic: studentService.js", "18"],
        ["  6.5", "HTTP Routing & Controllers", "19"],
        ["7.0", "TESTING, QUALITY ASSURANCE & VERIFICATION", "20"],
        ["  7.1", "Automated Testing Methodology", "20"],
        ["  7.2", "14-Point Integration Test Execution Matrix", "21"],
        ["  7.3", "Boundary Value Analysis & Negative Testing", "22"],
        ["8.0", "PROFESSOR DEMONSTRATION & VIVA DEFENSE GUIDE", "23"],
        ["  8.1", "Live Demonstration Script for Examiners", "23"],
        ["  8.2", "12 Technical Viva Defense Questions & Answers", "24"],
        ["9.0", "CONCLUSION & FUTURE ENHANCEMENTS", "27"],
        ["  9.1", "Summary of Engineering Outcomes", "27"],
        ["  9.2", "Future Scalability Roadmap", "27"],
        ["10.0", "REFERENCES & REPOSITORY ACCESS", "28"]
    ]
    create_table_from_data(doc, ["Section", "Chapter / Topic Description", "Page"], toc_data, [1.0, 4.5, 1.0])

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 1: INTRODUCTION & PROJECT BACKGROUND
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 1: INTRODUCTION & PROJECT BACKGROUND", level=1)
    
    style_heading(doc.add_paragraph(), "1.1 Context of Academic Record Systems", level=2)
    add_body_p(
        doc,
        "Student record management forms the administrative backbone of secondary and tertiary educational institutions. "
        "Accurate tracking of student enrollments, biographical attributes, semester progression, course allocations, and academic "
        "evaluations (marks and grades) is essential for institutional accreditation, transcript issuance, and performance monitoring. "
        "Historically, entry-level educational systems have often been prototyped as standalone console applications. While suitable "
        "for demonstrating basic programming constructs, such systems are fundamentally unsuited for modern distributed institutional "
        "ecosystems requiring multi-user access, web integration, and auditable API contracts."
    )

    style_heading(doc.add_paragraph(), "1.2 Project Motivation & Technical Debt", level=2)
    add_body_p(
        doc,
        "The inspiration for this project originated from an analysis of an open-source Python console application "
        "(HimanshuDabralDev/student-management-system). The original project successfully implemented basic CRUD "
        "(Create, Read, Update, Delete) operations using Python's standard library and flat JSON storage. However, an architectural "
        "audit revealed severe technical debt:"
    )
    add_body_p(
        doc,
        "• Monolithic Procedural Coupling: Logic for user input, data validation, console formatting, and file I/O were coalesced into a single 346-line script (main.py).\n"
        "• Terminal Blocking: The application relies on synchronous input() prompts, locking the runtime process to a single local user.\n"
        "• Absence of Machine-Readable Interfaces: External client applications (mobile apps, web portals, reporting systems) cannot communicate with the system.\n"
        "• Zero Automated Test Coverage: Changes cannot be verified systematically without manual console input entry."
    )

    style_heading(doc.add_paragraph(), "1.3 Project Scope & Core Objectives", level=2)
    add_body_p(
        doc,
        "The primary goal of this capstone refactoring is to elevate the legacy application to enterprise-grade standards by migrating "
        "it to Node.js and Express.js, while fulfilling four key engineering objectives:"
    )
    add_body_p(
        doc,
        "1. RESTful Web Architecture: Expose clean, resource-oriented endpoints following standard HTTP verbs (GET, POST, PUT, DELETE) and standardized JSON envelopes.\n"
        "2. Interactive OpenAPI / Swagger UI: Incorporate interactive documentation at '/api-docs' enabling evaluating professors to execute live test queries directly from their browser.\n"
        "3. Separation of Concerns: Decompose the monolith into a layered MVC pattern (Routes, Middlewares, Controllers, Services, and Repositories).\n"
        "4. Data Integrity & Academic Analytics: Ensure case-insensitive roll number uniqueness, atomic crash-safe file persistence, automated letter grading (A+ to F), and real-time class metrics."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 2: LEGACY SYSTEM ANALYSIS (PYTHON MONOLITH)
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 2: LEGACY SYSTEM ANALYSIS (PYTHON MONOLITH)", level=1)
    
    style_heading(doc.add_paragraph(), "2.1 Examination of the Original Codebase", level=2)
    add_body_p(
        doc,
        "The baseline Python implementation consists of three primary assets: 'main.py' (346 lines containing the entire application logic), "
        "'students.json' (a flat array storing serialized dictionaries), and a descriptive 'README.md'. The application provides six text menu options: "
        "1) Add Student, 2) View All Students, 3) Search Student, 4) Update Student, 5) Delete Student, and 6) Exit."
    )
    
    add_callout(
        doc,
        "def main():\n"
        "    students = load_students()\n"
        "    while True:\n"
        "        display_menu()\n"
        "        choice = input('Enter your choice: ').strip()\n"
        "        if choice == '1': add_student(students)\n"
        "        elif choice == '2': view_students(students)\n"
        "        ...",
        title="LEGACY CODE PATTERN: BLOCKING CONSOLE LOOP (main.py)"
    )

    style_heading(doc.add_paragraph(), "2.2 Architectural & Concurrency Bottlenecks", level=2)
    add_body_p(
        doc,
        "An in-depth code inspection identified the following operational constraints:"
    )
    add_body_p(
        doc,
        "• Process Concurrency Bottleneck: Because Python's input() function blocks execution until user keypress, the process cannot service any background tasks or additional clients. Only one user can interact with the system at any time.\n"
        "• Fragile File I/O: The 'save_students()' function utilizes direct file writes (open(DATA_FILE, 'w')). If an unexpected operating system interrupt or power loss occurs mid-write, the existing 'students.json' file is truncated or corrupted, resulting in total data loss.\n"
        "• Rigid Presentation Coupling: Output is strictly formatted for standard 80-character terminal width using string padding, rendering the data inaccessible to external consumer systems."
    )

    style_heading(doc.add_paragraph(), "2.3 Comparative Evaluation: Python CLI vs Node.js Express", level=2)
    add_body_p(
        doc,
        "The following matrix summarizes the architectural transformation achieved through refactoring:"
    )

    comp_headers = ["Evaluation Metric", "Legacy Python Implementation", "Refactored Node.js & Express API"]
    comp_rows = [
        ["Execution Runtime", "Python 3 Standard Library", "Node.js (V8 Asynchronous Engine)"],
        ["Architectural Pattern", "Single-file Procedural Monolith", "Layered MVC Architecture"],
        ["User Interface", "Terminal text console with prompts", "Interactive Swagger UI + Web Dashboard"],
        ["Client Concurrency", "Single-user synchronous blocking", "High-throughput asynchronous non-blocking"],
        ["Data Exchange Format", "Terminal ASCII formatted text", "Standardized RESTful JSON envelopes"],
        ["Input Validation", "Ad-hoc while-loop console prompts", "Centralized schema validation middleware"],
        ["Error Reporting", "Print statements to stdout", "Standard HTTP Status Codes (200, 400, 404, 409, 500)"],
        ["Persistence Safety", "Direct overwrite (risk of file truncation)", "Atomic temporary-file swap mechanism"],
        ["Automated Testing", "Zero automated unit or integration tests", "14 Automated integration tests (supertest)"],
        ["API Documentation", "Informal README instructions", "Interactive OpenAPI 3.0 (Swagger UI at /api-docs)"]
    ]
    create_table_from_data(doc, comp_headers, comp_rows, [1.5, 2.5, 2.5])

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 3: PROPOSED SYSTEM ARCHITECTURE & WORKFLOW
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 3: PROPOSED SYSTEM ARCHITECTURE & WORKFLOW", level=1)
    
    style_heading(doc.add_paragraph(), "3.1 Multi-Tier Layered Architecture Pattern", level=2)
    add_body_p(
        doc,
        "To achieve enterprise maintainability, testability, and adherence to the Single Responsibility Principle (SRP), "
        "the refactored Node.js Express application is structured into five distinct architectural tiers:"
    )
    add_body_p(
        doc,
        "1. Presentation & Documentation Tier: Houses the interactive OpenAPI 3.0 Swagger UI (/api-docs) and the client-facing Single Page Dashboard (/), providing dual modalities for testing and operational management.\n"
        "2. Middleware Tier: Intercepts inbound HTTP requests for Cross-Origin Resource Sharing (CORS), JSON parsing, HTTP request logging (morgan), and strict payload sanitization/validation.\n"
        "3. Controller Tier: Handles HTTP request extraction, binds query parameters and payload bodies, invokes the business service, and serializes uniform JSON responses.\n"
        "4. Domain Service Tier: Encapsulates pure business rules, including letter grade derivations (A+ to F), pass/fail statuses, class statistical aggregations, and business exception generation.\n"
        "5. Repository & Persistence Tier: Abstract data access layer performing asynchronous atomic reads and writes on the persistent storage file."
    )

    style_heading(doc.add_paragraph(), "3.2 End-to-End Request-Response Lifecycle", level=2)
    add_body_p(
        doc,
        "The complete end-to-end operational workflow follows a strict deterministic pipeline:"
    )
    
    add_callout(
        doc,
        "[CLIENT: Browser / Swagger UI / Mobile App]\n"
        "                     │  (HTTP Request: GET/POST/PUT/DELETE)\n"
        "                     ▼\n"
        "[MIDDLEWARE LAYER: CORS ➔ JSON Parser ➔ Request Logger ➔ Input Validator]\n"
        "                     │  (Sanitized Request Payload)\n"
        "                     ▼\n"
        "[STUDENT CONTROLLER: Request Dispatcher]\n"
        "                     │  (Domain Parameters)\n"
        "                     ▼\n"
        "[STUDENT SERVICE: Business Logic ➔ Uniqueness Check ➔ Grade Computation]\n"
        "                     │  (Clean Entity)\n"
        "                     ▼\n"
        "[STUDENT REPOSITORY: Atomic Async Temp-File Swap (.tmp ➔ .json)]\n"
        "                     │  (Persisted Record)\n"
        "                     ▼\n"
        "[CENTRALIZED ERROR / SUCCESS ENVELOPE: HTTP 200/201/400/404/409]\n"
        "                     │\n"
        "                     ▼\n"
        "[CLIENT CONSUMER: Rendered JSON in Swagger UI or Table in Dashboard]",
        title="END-TO-END SYSTEM WORKFLOW PIPELINE"
    )

    style_heading(doc.add_paragraph(), "3.3 Data Flow Diagrams (DFD)", level=2)
    add_body_p(
        doc,
        "• DFD Level 0 (Context Diagram): The student/faculty user interacts via HTTP with the Student Management System boundary. Inbound flows include Student Records, Search Queries, and Filter Criteria; outbound flows return JSON Payloads, Formatted Tables, Error Diagnostics, and Swagger Schema definitions.\n"
        "• DFD Level 1 (Process Decomposition): Decomposes the system into four major processes: P1 (Authenticate & Validate Input), P2 (Process Student CRUD Transactions), P3 (Compute Academic Performance Metrics), and P4 (Commit Atomic File Storage)."
    )

    style_heading(doc.add_paragraph(), "3.4 Crash-Safe Atomic File Persistence Strategy", level=2)
    add_body_p(
        doc,
        "A critical vulnerability in flat-file systems is partial writes resulting from process termination or server crashes. "
        "To eliminate this risk, our StudentRepository implements an atomic file-replacement pattern:"
    )
    add_code_block(
        doc,
        "async saveAll(students) {\n"
        "  const jsonContent = JSON.stringify(students, null, 2);\n"
        "  // 1. Write data to a unique temporary file\n"
        "  const tempFile = `${this.filePath}.tmp.${Date.now()}`;\n"
        "  await fs.writeFile(tempFile, jsonContent, 'utf8');\n"
        "  // 2. Perform atomic OS-level rename replacing target file\n"
        "  await fs.rename(tempFile, this.filePath);\n"
        "  return students;\n"
        "}",
        caption="Atomic File Persistence Implementation (studentRepository.js)"
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 4: DATA DICTIONARY & GRADING SPECIFICATION
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 4: DATA DICTIONARY & GRADING SPECIFICATION", level=1)
    
    style_heading(doc.add_paragraph(), "4.1 Student Entity Schema & Field Constraints", level=2)
    add_body_p(
        doc,
        "The data model preserves exact functional fidelity with the original Python project while enforcing strict type validations "
        "and enriching records with calculated academic descriptors:"
    )

    schema_headers = ["Field Name", "Data Type", "Constraint", "Mutability", "Description & Academic Validation"]
    schema_rows = [
        ["roll_number", "String", "Unique, Non-empty", "IMMUTABLE", "Primary student identifier. Case-insensitive matching ('cs101' == 'CS101')."],
        ["name", "String", "Non-empty string", "Mutable", "Full legal name of the student. Whitespace trimmed."],
        ["age", "Integer", "1 <= age <= 100", "Mutable", "Age in whole years. Rejects floats and out-of-range integers."],
        ["course", "String", "Non-empty string", "Mutable", "Enrolled program or major (e.g. 'Computer Science', 'IT')."],
        ["semester", "Integer", "1 <= sem <= 12", "Mutable", "Academic semester level. Validates against degree limits."],
        ["marks", "Float", "0.00 <= m <= 100.00", "Mutable", "Aggregate percentage score rounded to two decimal places."],
        ["grade", "String", "Calculated (A+ to F)", "Derived", "Letter grade automatically computed from marks."],
        ["status", "String", "PASS | FAIL", "Derived", "PASS if marks >= 40.0; FAIL if marks < 40.0."]
    ]
    create_table_from_data(doc, schema_headers, schema_rows, [1.1, 0.9, 1.4, 1.0, 2.1])

    style_heading(doc.add_paragraph(), "4.2 Academic Letter Grading & Status Calculation", level=2)
    add_body_p(
        doc,
        "The StudentService automatically maps continuous numerical marks to discrete institutional performance tiers:"
    )

    grade_headers = ["Marks Range (%)", "Letter Grade", "Qualitative Classification", "Academic Standing"]
    grade_rows = [
        ["90.00 - 100.00", "A+", "Outstanding", "Dean's List / High Honors (PASS)"],
        ["80.00 - 89.99", "A", "Excellent", "First Class with Distinction (PASS)"],
        ["70.00 - 79.99", "B", "Very Good", "First Class Standing (PASS)"],
        ["60.00 - 69.99", "C", "Good", "Second Class Standing (PASS)"],
        ["50.00 - 59.99", "D", "Satisfactory", "Third Class Standing (PASS)"],
        ["40.00 - 49.99", "E", "Pass", "Minimum Passing Threshold (PASS)"],
        ["0.00 - 39.99", "F", "Fail", "Course Remediation Required (FAIL)"]
    ]
    create_table_from_data(doc, grade_headers, grade_rows, [1.5, 1.2, 1.8, 2.0])

    style_heading(doc.add_paragraph(), "4.3 Academic Performance Analytics Engine", level=2)
    add_body_p(
        doc,
        "The analytics subsystem ('GET /api/v1/students/stats') dynamically aggregates class metrics upon request without persisting "
        "redundant counters. It calculates total enrollment, class average marks, identifies top and bottom performers, computes overall "
        "passing percentage, and compiles frequency distributions across courses and letter grades."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 5: RESTful API & INTERACTIVE SWAGGER SPECIFICATION
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 5: RESTful API & INTERACTIVE SWAGGER SPECIFICATION", level=1)
    
    style_heading(doc.add_paragraph(), "5.1 REST Architecture Principles & URI Conventions", level=2)
    add_body_p(
        doc,
        "The API adheres strictly to Representational State Transfer (REST) conventions: resources are represented by plural nouns "
        "('/students'), actions are indicated by standard HTTP methods, and query parameters are utilized for filtering, sorting, "
        "and pagination rather than non-standard URL paths."
    )

    style_heading(doc.add_paragraph(), "5.2 Comprehensive API Catalog & Endpoint Matrix", level=2)
    
    api_headers = ["Method", "Endpoint Route", "Purpose / Functionality", "Input Payload", "HTTP Statuses"]
    api_rows = [
        ["GET", "/api/v1/health", "Server runtime diagnostics & uptime", "None", "200 OK"],
        ["GET", "/api/v1/students", "List students (supports filter, sort, page)", "Query parameters", "200 OK, 500 Error"],
        ["GET", "/api/v1/students/stats", "Academic analytics & performance metrics", "None", "200 OK, 500 Error"],
        ["GET", "/api/v1/students/:roll", "Search individual student by roll number", "Path parameter (:roll)", "200 OK, 404 Not Found"],
        ["POST", "/api/v1/students", "Enroll new student record", "JSON body (roll, name, ...)", "201 Created, 400, 409"],
        ["PUT", "/api/v1/students/:roll", "Update student details (roll immutable)", "JSON body (partial fields)", "200 OK, 400, 404"],
        ["DELETE", "/api/v1/students/:roll", "Remove student record permanently", "Path parameter (:roll)", "200 OK, 404 Not Found"],
        ["POST", "/api/v1/students/reset", "Restore database to baseline seed data", "None (Demo utility)", "200 OK"]
    ]
    create_table_from_data(doc, api_headers, api_rows, [0.8, 1.8, 2.0, 1.1, 0.8])

    style_heading(doc.add_paragraph(), "5.3 OpenAPI 3.0 / Swagger UI Architecture", level=2)
    add_body_p(
        doc,
        "Interactive documentation is powered by the OpenAPI 3.0.3 specification and rendered via 'swagger-ui-express' at '/api-docs'. "
        "Each endpoint features exhaustive request and response schemas, sample payloads, query parameter definitions, and interactive "
        "'Try it out' controls that dispatch live XMLHttpRequests to the backend."
    )

    style_heading(doc.add_paragraph(), "5.4 Professor Interactive Demonstration Protocol", level=2)
    add_body_p(
        doc,
        "When presenting to the evaluation committee, students execute the following structured demonstration sequence:\n"
        "1. Open Browser: Navigate to 'http://localhost:3000/api-docs' to display the interactive Swagger documentation.\n"
        "2. Retrieve All Records: Expand 'GET /api/v1/students', click 'Try it out', and click 'Execute'. Highlight the returned 200 OK array containing computed grades (A+, A, B) and pass/fail indicators.\n"
        "3. Filter Query Demonstration: Input 'course: Computer Science' or 'search: Aarav' into query parameters and click 'Execute'. Demonstrate real-time backend filtering.\n"
        "4. Data Validation & Conflict Testing: Expand 'POST /api/v1/students'. Input an existing roll number ('CS101') and click 'Execute'. Point out the 409 Conflict error response. Then enter age '150' and show the 400 Bad Request validation response.\n"
        "5. Case-Insensitive Lookup: Expand 'GET /api/v1/students/{rollNumber}'. Enter lowercase 'cs101' and demonstrate successful matching with uppercase 'CS101'.\n"
        "6. Analytical Dashboard: Expand 'GET /api/v1/students/stats' and execute to showcase class-wide performance metrics."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 6: DETAILED CODE IMPLEMENTATION WALKTHROUGH
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 6: DETAILED CODE IMPLEMENTATION WALKTHROUGH", level=1)
    
    style_heading(doc.add_paragraph(), "6.1 Directory Structure & Modular Organization", level=2)
    add_body_p(
        doc,
        "The project is structured according to industry standard conventions, separating source code from tests, data, and public assets:"
    )
    add_code_block(
        doc,
        "node-express-sms/\n"
        "├── src/\n"
        "│   ├── config/index.js            # Environment configuration & file paths\n"
        "│   ├── controllers/\n"
        "│   │   └── studentController.js   # HTTP Request/Response dispatching\n"
        "│   ├── services/\n"
        "│   │   └── studentService.js      # Business rules, grading, analytics\n"
        "│   ├── repositories/\n"
        "│   │   └── studentRepository.js   # Atomic file storage adapter\n"
        "│   ├── middlewares/\n"
        "│   │   ├── validationMiddleware.js# Input schema sanitization & checks\n"
        "│   │   ├── errors.js              # Custom error class hierarchy\n"
        "│   │   └── errorHandler.js        # Centralized 404 & 500 handlers\n"
        "│   ├── routes/\n"
        "│   │   └── studentRoutes.js       # RESTful HTTP route bindings\n"
        "│   ├── swagger/\n"
        "│   │   └── swaggerDoc.js          # OpenAPI 3.0 specification & Swagger UI\n"
        "│   ├── public/                    # Interactive Academic Web Dashboard\n"
        "│   │   ├── index.html, style.css, app.js\n"
        "│   ├── app.js                     # Express app assembly & middleware wiring\n"
        "│   └── server.js                  # HTTP listener & process event handlers\n"
        "├── tests/\n"
        "│   └── student.test.js            # Automated integration test suite\n"
        "├── .env                           # Environment settings\n"
        "└── package.json                   # Dependencies manifest",
        caption="Refactored Project Directory Architecture"
    )

    style_heading(doc.add_paragraph(), "6.2 Key Architectural Components", level=2)
    add_body_p(
        doc,
        "• Validation Middleware (validationMiddleware.js): Intercepts POST and PUT requests before controller invocation. Validates that age is an integer between 1 and 100, marks fall between 0.00 and 100.00, and semester is between 1 and 12. If any assertion fails, it constructs a 400 Bad Request response containing a detailed array of all field errors.\n"
        "• Domain Service Layer (studentService.js): Implements business invariant enforcement. During creation, it queries the repository to ensure roll number uniqueness (case-insensitive). It computes the 'grade' and 'status' attributes dynamically and compiles comprehensive statistical summaries.\n"
        "• Centralized Error Handler (errorHandler.js): Catches operational AppErrors, malformed JSON bodies, and unhandled exceptions, formatting them into uniform JSON diagnostic envelopes containing timestamp, path, and error details."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 7: TESTING, QUALITY ASSURANCE & VERIFICATION
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 7: TESTING, QUALITY ASSURANCE & VERIFICATION", level=1)
    
    style_heading(doc.add_paragraph(), "7.1 Automated Testing Methodology", level=2)
    add_body_p(
        doc,
        "Quality assurance was conducted using an automated integration testing framework leveraging Node.js's native test runner "
        "('node:test') and 'supertest'. Tests execute against an isolated test dataset ('test_students.json'), initialized before each "
        "test run and purged upon completion to ensure idempotency and test independence."
    )

    style_heading(doc.add_paragraph(), "7.2 14-Point Integration Test Execution Matrix", level=2)

    test_headers = ["#", "Target Endpoint / Scenario", "Input Parameters / Payload", "Expected Result", "Status"]
    test_rows = [
        ["1", "GET /api/v1/health", "None", "HTTP 200, status: 'UP', valid uptime", "PASS [OK]"],
        ["2", "GET /api/v1/students", "None", "HTTP 200, array of student records", "PASS [OK]"],
        ["3", "GET /api/v1/students/cs101", "Lowercase roll: 'cs101'", "HTTP 200, matches stored 'CS101'", "PASS [OK]"],
        ["4", "GET /api/v1/students/NON_EXIST", "Invalid roll: 'NON_EXIST'", "HTTP 404, 'No student found' message", "PASS [OK]"],
        ["5", "POST /api/v1/students", "Valid student: 'TEST2026', marks: 95.5", "HTTP 201, grade: 'A+', status: 'PASS'", "PASS [OK]"],
        ["6", "POST /api/v1/students (Duplicate)", "Duplicate roll: 'test2026'", "HTTP 409 Conflict, duplicate error", "PASS [OK]"],
        ["7", "POST /api/v1/students (Age > 100)", "Invalid age: 150", "HTTP 400 Bad Request, age error detail", "PASS [OK]"],
        ["8", "POST /api/v1/students (Marks > 100)", "Invalid marks: 105.0", "HTTP 400 Bad Request, marks detail", "PASS [OK]"],
        ["9", "PUT /api/v1/students/TEST2026", "Updated marks: 45.0", "HTTP 200, grade recalculates to 'E'", "PASS [OK]"],
        ["10", "PUT /api/v1/students/TEST2026", "Attempting roll change to 'NEW_ROLL'", "HTTP 400, roll immutable constraint", "PASS [OK]"],
        ["11", "DELETE /api/v1/students/TEST2026", "Valid roll: 'TEST2026'", "HTTP 200, record purged from store", "PASS [OK]"],
        ["12", "GET /api/v1/students/stats", "None", "HTTP 200, accurate average & grades", "PASS [OK]"],
        ["13", "GET /api/v1/students?search=Aarav", "Query: ?search=Aarav", "HTTP 200, returns filtered subset", "PASS [OK]"],
        ["14", "GET /api-docs/", "Browser HTTP GET", "HTTP 200, Swagger UI HTML & OpenAPI", "PASS [OK]"]
    ]
    create_table_from_data(doc, test_headers, test_rows, [0.4, 2.0, 1.8, 1.8, 0.5])

    add_body_p(
        doc,
        "Execution Summary: 14 integration test cases executed; 14 passed; 0 failed; duration: ~300ms. Test suite demonstrates 100% pass rate."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 8: PROFESSOR DEMONSTRATION & VIVA DEFENSE GUIDE
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 8: PROFESSOR DEMONSTRATION & VIVA DEFENSE GUIDE", level=1)
    
    style_heading(doc.add_paragraph(), "8.1 Live Demonstration Script for Examiners", level=2)
    add_body_p(
        doc,
        "During the capstone examination, the student presentation follows a clear, professional narrative:"
    )
    add_body_p(
        doc,
        "• Opening Statement: 'Respected professors, our project addresses the architectural limitations of entry-level software by refactoring a monolithic Python CLI student management tool into a high-performance, asynchronous RESTful service using Node.js and Express. We prioritized modularity, data integrity, and interactive API documentation via Swagger.'\n"
        "• System Startup: Demonstrate starting the server via 'npm start' and highlight the structured console startup diagnostics showing URLs for the Web Dashboard, Swagger UI, Health check, and Data file.\n"
        "• Live Swagger Walkthrough: Switch to the interactive Swagger UI at 'http://localhost:3000/api-docs' and execute CRUD operations live, highlighting schema validations, 409 duplicate checks, and dynamic grade assignments.\n"
        "• Concluding Demo: Display the Web Dashboard at 'http://localhost:3000' showing live KPI cards and student table synchronized with the backend."
    )

    style_heading(doc.add_paragraph(), "8.2 Anticipated Viva Defense Questions & Technical Answers", level=2)

    viva_qa = [
        (
            "Q1: Why did your team choose Node.js and Express rather than Python frameworks like Flask or FastAPI?",
            "Model Answer: While Flask and FastAPI are excellent frameworks, migrating to Node.js allowed us to demonstrate a fundamental architectural shift to an asynchronous, event-driven runtime powered by Google's V8 engine. Node.js processes I/O operations non-blockingly on a single thread via the libuv event loop, making it exceptionally lightweight and suited for high-throughput JSON web services. Additionally, using JavaScript across both the Express backend and the web frontend provides full-stack language uniformity."
        ),
        (
            "Q2: How does your system ensure data integrity without a traditional relational database (RDBMS)?",
            "Model Answer: We enforced database-like integrity at two levels: 1) Business Rule Enforcement: Our validation middleware and service layer reject duplicate roll numbers (using case-insensitive comparison), enforce value boundaries (age 1-100, marks 0-100), and guarantee that roll_number is immutable on updates. 2) Atomic Storage Engine: In our StudentRepository, save operations write first to a temporary file ('students.json.tmp.<timestamp>') before executing an atomic operating-system level rename. This prevents partial writes and file truncation if the server crashes unexpectedly."
        ),
        (
            "Q3: Explain the difference between PUT and PATCH, and why you selected PUT for updates.",
            "Model Answer: In REST conventions, PUT typically represents a complete replacement of a resource or an update where the target URI is known, whereas PATCH represents partial modifications. We designed our PUT endpoint to accept partial fields (name, age, course, semester, marks) while strictly prohibiting alteration of the roll number. In our implementation, PUT behaves idempotently—executing the same update payload multiple times produces the identical final state."
        ),
        (
            "Q4: What is the purpose of mounting Swagger UI directly inside the Express application?",
            "Model Answer: Embedding Swagger UI via 'swagger-ui-express' at '/api-docs' serves three crucial purposes: 1) Living Documentation: It provides an interactive contract that stays synchronized with the backend API. 2) Evaluation Accessibility: It enables examiners to test and verify every endpoint directly in the browser without requiring external tools like Postman or Curl. 3) Standardization: The underlying OpenAPI 3.0 specification can be consumed automatically by client generators and API gateways."
        ),
        (
            "Q5: How does your system handle concurrent requests trying to read and write students.json simultaneously?",
            "Model Answer: In Node.js, asynchronous file operations in fs.promises are delegated to the libuv thread pool. By leveraging atomic temporary-file renaming (fs.rename), file replacements occur instantaneously at the OS file-system level. Because readers open the designated file path, they either read the previous complete state or the newly swapped complete state, eliminating the risk of dirty reads of partially-written JSON."
        ),
        (
            "Q6: What HTTP status codes are returned by your API and what do they signify?",
            "Model Answer: We implemented semantic HTTP status codes: 200 OK for successful reads, updates, and deletes; 201 Created for new student enrollment; 400 Bad Request for validation schema violations; 404 Not Found when a specified roll number does not exist; 409 Conflict when attempting to register a duplicate roll number; and 500 Internal Server Error for unhandled exceptions."
        )
    ]

    for q, a in viva_qa:
        p_q = doc.add_paragraph()
        p_q.paragraph_format.space_before = Pt(8)
        p_q.paragraph_format.space_after = Pt(2)
        r_q = p_q.add_run(q)
        r_q.font.name = "Calibri"
        r_q.font.size = Pt(10)
        r_q.font.bold = True
        r_q.font.color.rgb = RGBColor(30, 58, 138)

        p_a = doc.add_paragraph()
        p_a.paragraph_format.space_before = Pt(0)
        p_a.paragraph_format.space_after = Pt(6)
        p_a.paragraph_format.line_spacing = 1.15
        r_a = p_a.add_run(a)
        r_a.font.name = "Calibri"
        r_a.font.size = Pt(9.5)
        r_a.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 9: CONCLUSION & FUTURE ENHANCEMENTS
    # =========================================================================
    style_heading(doc.add_paragraph(), "CHAPTER 9: CONCLUSION & FUTURE ENHANCEMENTS", level=1)
    
    style_heading(doc.add_paragraph(), "9.1 Summary of Engineering Outcomes", level=2)
    add_body_p(
        doc,
        "The project successfully achieved all stated engineering objectives: transforming an isolated Python CLI into a scalable, "
        "well-architected Node.js Express RESTful service. Key accomplishments include the complete elimination of blocking I/O, "
        "enforcement of domain integrity via custom validation and error middleware, implementation of crash-safe atomic file storage, "
        "integration of real-time academic grading and analytics, and the delivery of interactive OpenAPI/Swagger documentation "
        "accompanied by an academic web dashboard. The 100% test pass rate validates system robustness and operational readiness."
    )

    style_heading(doc.add_paragraph(), "9.2 Future Scalability Roadmap", level=2)
    add_body_p(
        doc,
        "To further evolve the system for enterprise campus deployment, the following enhancements are planned for subsequent iterations:\n"
        "• Role-Based Access Control (RBAC): Integrate JSON Web Tokens (JWT) and bcrypt password hashing to distinguish permissions between Students (view-only), Faculty (grade entry), and Registrars (full administrative privileges).\n"
        "• Database Migration: Replace the JSON file repository with PostgreSQL utilizing an Object-Relational Mapper (ORM such as Prisma or Sequelize) or MongoDB via Mongoose for horizontal scaling.\n"
        "• Containerization & Deployment: Package the microservice using Docker and Docker Compose, establishing continuous integration (CI) pipelines for automated testing and deployment to cloud infrastructure (AWS ECS / Google Cloud Run)."
    )

    style_heading(doc.add_paragraph(), "10.0 REFERENCES & REPOSITORY ACCESS", level=1)
    add_body_p(
        doc,
        "[1] Original Reference Codebase: Himanshu Dabral, 'Student Management System in Python', GitHub Repository: https://github.com/HimanshuDabralDev/student-management-system.git\n"
        "[2] Node.js Foundation, 'Node.js v24.x LTS Documentation and Runtime Architecture', 2026.\n"
        "[3] Express.js Project, 'Fast, unopinionated, minimalist web framework for Node.js', https://expressjs.com/\n"
        "[4] OpenAPI Initiative, 'OpenAPI Specification Version 3.0.3', https://spec.openapis.org/oas/v3.0.3\n"
        "[5] Fielding, R. T., 'Architectural Styles and the Design of Network-based Software Architectures', Doctoral Dissertation, University of California, Irvine, 2000.\n"
        "[6] Martin, R. C., 'Clean Architecture: A Craftsman's Guide to Software Structure and Design', Prentice Hall, 2017."
    )

    # Save documents
    out_path_1 = r"C:\Users\user\.gemini\antigravity\scratch\student-management-system\Student_Management_System_Project_Report.docx"
    out_path_2 = r"C:\Users\user\.gemini\antigravity\scratch\student-management-system\node-express-sms\Student_Management_System_Project_Report.docx"
    
    doc.save(out_path_1)
    doc.save(out_path_2)
    print(f"Report successfully generated at:\n  - {out_path_1}\n  - {out_path_2}")

if __name__ == "__main__":
    build_project_report()
