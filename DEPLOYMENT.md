# Wessam Learning System (WLS) - Complete Production Deployment Guide

This guide provides a step-by-step walkthrough to deploy **Wessam Learning System (WLS)** to **Vercel** with a managed **PostgreSQL** database (Neon / Supabase / Vercel Postgres) to scale for 500+ active students.

---

## 📋 Complete Deployment Pipeline Overview

```mermaid
flowchart LR
    A[1. Provision Neon PostgreSQL] --> B[2. Push Code to GitHub]
    B --> C[3. Deploy on Vercel]
    C --> D[4. Set Environment Variables]
    D --> E[5. Push Schema & Seed DB]
    E --> F[6. Live Production Access]
```

---

## Step 1: Provision a Managed PostgreSQL Database (Neon / Supabase)

### Option A: Neon DB (Recommended for Serverless Next.js)
1. Sign up for a free account at [neon.tech](https://neon.tech).
2. Click **Create Project** and name it `wls-production`.
3. In your Neon dashboard, copy the **PostgreSQL Connection String**:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_x123abc@ep-cool-pool-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### Option B: Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **Project Settings -> Database** and copy your **Pooled Connection String** (`Transaction` or `Session` mode).

---

## Step 2: Switch Prisma Provider to PostgreSQL

Open [`prisma/schema.prisma`](file:///d:/New%20folder%20(2)/wls/prisma/schema.prisma) and update lines 7-10:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Generate the updated Prisma Client locally:
```bash
npx prisma generate
```

---

## Step 3: Push Project to GitHub

Run the following commands in your terminal to initialize git and push your codebase:

```bash
git init
git add .
git commit -m "Production release of Wessam Learning System (WLS)"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/wls.git
git push -u origin main
```

---

## Step 4: Configure & Deploy on Vercel

1. Log into your [Vercel Account](https://vercel.com).
2. Click **Add New... -> Project**.
3. Select your `wls` GitHub repository and click **Import**.
4. Expand **Environment Variables** and enter:

| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@ep-host.neon.tech/neondb?sslmode=require` | Managed PostgreSQL Connection String |
| `JWT_SECRET` | `wls_super_secret_jwt_key_2026_wessam_learning_system_secure_786` | Secure session signing secret |
| `ADMIN_EMAIL` | `wessamaftab@gmail.com` | Master Admin Login Email |
| `ADMIN_PASSWORD` | `Sami@n78600` | Master Admin Login Password |
| `ADMIN_NAME` | `Wessam Aftab (Master Admin)` | Master Admin Display Name |

5. Under **Build & Development Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `npx prisma generate && next build`
   - **Install Command**: `npm install`
6. Click **Deploy**.

---

## Step 5: Initialize Database Schema & Seed Production Data

Once your Vercel deployment builds, push the database tables and run the seeder against your live PostgreSQL database:

```bash
# Push database schema tables to PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_x123abc@ep-host.neon.tech/neondb?sslmode=require" npx prisma db push

# Seed Master Admin & Initial Faculty Members
DATABASE_URL="postgresql://neondb_owner:npg_x123abc@ep-host.neon.tech/neondb?sslmode=require" npx tsx prisma/seed.ts
```

*(On Windows PowerShell, set the environment variable prior to running):*
```powershell
$env:DATABASE_URL="postgresql://neondb_owner:npg_x123abc@ep-host.neon.tech/neondb?sslmode=require"
npx prisma db push
npx tsx prisma/seed.ts
```

---

## Step 6: Post-Deployment Verification Checklist

1. **Student Submission Portal**:
   - Visit `https://your-wls-app.vercel.app/submit`
   - Test submitting a project with dynamic teacher dropdown selection.

2. **Teacher Portal**:
   - Visit `https://your-wls-app.vercel.app/login` and log in with sample teacher credentials (`wessam.educator@wls.edu` / `TeacherPass123!`).
   - Verify data isolation (teachers see only assigned students).
   - Test inline metrics saving, rubric evaluation, Word report (`.docx`) export, and Excel sheet (`.xlsx`) export.

3. **Master Admin Dashboard**:
   - Log in using your configured `ADMIN_EMAIL` & `ADMIN_PASSWORD`.
   - Verify full academy oversight showing all system submissions, teacher assignments, and scores.
