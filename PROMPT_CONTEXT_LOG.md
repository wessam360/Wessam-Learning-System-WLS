# Wessam Learning System (WLS) - Prompt & Context Log

This document maintains a chronological record of major prompts, design decisions, architectural rationale, and system evolution for **Wessam Learning System (WLS)**. It serves as a historical context reference for AI models and engineering teams when extending or maintaining the application.

---

## 1. Initial System Specification & Prompt Requirements

### Core Requirements
- **Target Scale**: High-performance Learning Management System (LMS) designed for 500+ active students.
- **Tech Stack**: Next.js 14+ (App Router), PostgreSQL with Prisma ORM, Tailwind CSS with Light/Dark mode support.
- **Theme Palette**: Dark mode background `#000000`, headings `#3b82f6`, body text `#ffffff`.
- **Role-Based Routing**: Master Admin, Teacher, and Student roles with custom JWT authentication.
- **Student Submission Fields**: Student Course, Day Schedule (`Mon-Tue`, `Wed-Thu`, `Sat-Sun`), Student Name, Student ID, Gender, Final Project Name, Project Link, Portfolio Link, and Dynamic Teacher Selection.
- **Teacher Dashboard Features**: Data isolation (teachers view only assigned students), inline metrics (Attendance, Participation, Quizzes, Assignments), and 7-criterion rubric project evaluations.
- **Document Export Tools**:
  - `docx` for Word evaluation reports matching the 7 academic criteria out of 100 marks.
  - `exceljs` for consolidated class result sheets (`.xlsx`).
- **Branding & Footer**: Mandatory creator attribution for Wessam Learning System (WLS) with title and LinkedIn profile link.

---

## 2. Key Architectural Decisions & Context Log

### Decision 1: Master Admin Environment Variable Migration
- **Context**: Initially, default admin credentials were hardcoded into the seeder and documentation.
- **Rationale**: To prevent security risks and comply with production deployment best practices, credentials were moved to environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`).
- **Files Affected**:
  - `.env` & `.env.example`: Added `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.
  - `prisma/seed.ts`: Reads `process.env.ADMIN_EMAIL`, `process.env.ADMIN_PASSWORD`, and `process.env.ADMIN_NAME`.
  - `app/login/page.tsx`: Removed hardcoded admin credentials from frontend code.

### Decision 2: Data Isolation for Faculty Members
- **Context**: Teachers must evaluate only their assigned academy students.
- **Rationale**: Implemented at the API layer (`app/api/teacher/submissions/route.ts`). When the authenticated session role is `TEACHER`, the query automatically enforces `where: { teacherId: session.teacherProfileId }`. Admin sessions bypass this restriction to maintain full institutional oversight.

### Decision 3: 7-Criterion Rubric Evaluation Structure
- **Context**: Academic rubric requires specific scoring criteria summing to 100 total marks.
- **Rubric Breakdown**:
  1. Idea / Synopsis (Max 10)
  2. User / Client Interface & Layout (Max 20)
  3. Innovation / Creativity (Max 30)
  4. Reporting System / Activity Log (Max 10)
  5. Integration with Course Outcomes (Max 10)
  6. Group Involvement (Max 10)
  7. Presentation Style (Max 10)
- **Implementation**: Stored in the `ProjectEvaluation` model and rendered via `TeacherGradingModal.tsx` with live total score computation.

### Decision 4: Binary Document Exports via Native Web API Responses
- **Context**: Word reports and Excel spreadsheets need to stream directly to the client browser without saving files to disk on the server.
- **Rationale**: `export-docx.ts` and `export-excel.ts` compile buffers in memory and return `new Response(new Uint8Array(buffer), { headers: { ... } })` with appropriate MIME types (`application/vnd.openxmlformats-officedocument.wordprocessingml.document` and `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).

### Decision 5: Home Page UX Cleanup & Mobile Navigation Drawer
- **Context**: The home page needed a clean, uncluttered presentation without administrative details, along with mobile navigation support.
- **Rationale**:
  - Removed admin credential callouts from `app/page.tsx` to maintain a professional institutional landing page.
  - Added a mobile slide-down navigation drawer in `components/Navbar.tsx` with a hamburger toggle button.

---

## 3. Context Guidelines for Future AI Extensions

When providing instructions to an AI assistant to update or extend WLS, pass the following context snippet:

```text
Wessam Learning System (WLS) Context:
- Framework: Next.js 14+ (App Router)
- ORM: Prisma (v5.22.0) with SQLite (dev) / PostgreSQL (prod)
- Authentication: Custom JWT in HTTP-only cookie 'wls_token' (lib/auth.ts)
- Roles: ADMIN, TEACHER, STUDENT
- Teacher Data Isolation: Enforced in app/api/teacher/submissions/route.ts
- Document Exports: Word reports generated via lib/export-docx.ts, Excel marksheet via lib/export-excel.ts
- Admin Credentials: Set in process.env (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME)
- Dark Theme: Custom tokens in app/globals.css (#000000 background, #3b82f6 blue headings)
```
