# 🏫 Multi-Tenant School Automation Platform — Frontend UI

A high-performance, responsive, and dynamically white-labeled multi-tenant web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Designed for primary and secondary schools in Nigeria to deliver smooth portal experiences across Tier 1 (Starter OS) and Tier 2 (Complete OS) deployments.

---

## 🌟 Key Features

* **Dynamic Multi-Tenant Resolution:** Automatic tenant context extraction via subdomain, custom domain, or `X-Tenant-ID` HTTP header pass-through.
* **Apple HIG Dynamic Theme Engine:** Automated 60-30-10 color harmonization, derived palettes, dynamic favicon injection, and WCAG AA contrast compliance at runtime without code rebuilds.
* **Dual-Tier Architecture:**
  * **Tier 1 (Starter OS):** Standalone guest PIN result checker and instant online Paystack PIN checkout.
  * **Tier 2 (Complete OS):** Full enterprise portal shell with role-based dashboard access for Admins, Principals, Vice Principals, Form Teachers, Subject Teachers, Bursars, Students, and Parents.
* **Dynamic Intro Website Engine:** Zero-config marketing website for schools with no existing online presence, complete with dynamic hero sliders, editorial story blocks, and mini-event calendars.
* **Vector PDF Engine Integration:** Asynchronous binary stream handling for official signed report cards and Paystack digital payment receipts.
* **Student Passport Uploads:** Direct photo upload drawer integrated with backend static CDN/S3 file management.
* **Signature Visual Details:** Rotated SVG school crest background watermarks ($2\%\text{–}4\%$ opacity) and ambient primary-brand radial glow filters.

---

## 🛠 Tech Stack

* **Framework:** [Next.js 14+](https://nextjs.org/) (React 18 / TypeScript)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/) (Apple Spring Curves & Glassmorphism)
* **HTTP Client:** [Axios](https://axios-http.com/) with Multi-Tenant Interceptors
* **Icons:** [Lucide React](https://lucide.dev/)
* **State & Forms:** React Context, React Hook Form, Zod

---

## 📂 Project Structure

```text
school-portal-frontend/
├── public/
│   ├── favicon.ico
│   └── watermarks/
│       └── default_crest_watermark.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root Layout & Dynamic Theme Hydrator
│   │   ├── page.tsx                      # Dynamic Router (Intro Site vs Portal Redirect)
│   │   ├── (auth)/                       # Unified Portal Login & Password Reset
│   │   ├── (public_gate)/                # Tier 1 PIN Verification & Checkout Gates
│   │   ├── (intro_site)/                 # Dynamic CMS Intro Website Pages (About, News, Contact)
│   │   ├── (portal)/                     # Tier 2 Role-Based Authenticated Application Shell
│   │   └── super-admin/                  # Master SaaS Control Tower & Onboarding Form
│   ├── components/
│   │   ├── ui/                           # Reusable Apple HIG UI Components (Buttons, Cards, Modals)
│   │   ├── intro/                        # Hero Sliders, Story Blocks & Event Cards
│   │   └── portal/                       # Sidebar Nav, Headers, Result Views & Photo Drawer
│   ├── hooks/
│   │   ├── useAuth.ts                    # JWT Auth & Session Store
│   │   ├── useSchoolTheme.ts             # HIG Dynamic Branding Hook
│   │   └── useTenant.ts                  # Multi-Tenant Resolution Hook
│   ├── services/
│   │   ├── apiClient.ts                  # Axios Interceptor with X-Tenant-ID Header
│   │   ├── paymentService.ts             # Paystack Checkout & PDF Binary Downloader
│   │   └── resultService.ts              # Score Sheets & PDF Export Services
│   ├── types/
│   │   ├── schema.ts                     # TypeScript Schemas (Student, Result, User)
│   │   └── theme.ts                      # Branding & Theme Configuration Interfaces
│   └── utils/
│       ├── colorEngine.ts                # WCAG AA Contrast & Palette Derivation Engine
│       └── formatters.ts                 # Currency (₦), Date, and Grade Formatting
├── .env.example
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
# API Endpoint Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Local Testing Override (Optional: Force specific tenant slug during local dev)
NEXT_PUBLIC_OVERRIDE_TENANT=stgregory

# Paystack Public Key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have **Node.js 18+** and **npm** or **yarn** installed.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/school-portal-frontend.git
cd school-portal-frontend
npm install
```

### 3. Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & Production Check

Compile the TypeScript application for production:

```bash
npm run build
npm run start
```

---

## 🎨 HIG Design Rules for Developers

1. **Zero Hardcoded Colors:** Never use hardcoded HEX colors (e.g. `#1E3A8A`) inside component JSX. Always consume dynamic tokens like `var(--color-primary)` or utility classes derived from `useSchoolTheme()`.
2. **Mandatory Header Pass-Through:** Every API call dispatched via `apiClient` automatically injects the `X-Tenant-ID` header extracted from the current window hostname.
3. **Binary PDF Streaming:** Always pass `responseType: 'blob'` when calling report card or receipt PDF download endpoints.
4. **Strict 8px Grid:** Ensure padding, margins, gaps, and component dimensions are aligned to multiples of 8 (`8px`, `16px`, `24px`, `32px`, `48px`).

---

## 📄 License

Internal Proprietary SaaS Software — All Rights Reserved.