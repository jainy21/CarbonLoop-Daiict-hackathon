# 🌿 CarbonLoop — Waste-to-Carbon-Value Chain Tracker

> **DA-IICT Hackathon 2026** | Theme: *Circular Carbon Ecosystem*

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Express%20%2B%20TypeScript-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Build-Vite%206-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 📖 Overview

**CarbonLoop** is an end-to-end digital value-chain platform that connects **Waste Generators** (farms, food processors, agro-industries, and municipalities) with **Carbon Conversion Facilities** (Biochar Pyrolysis, Anaerobic Biogas, and Carbon-Negative Materials plants).

Instead of letting organic and agro-industrial waste rot in landfills—emitting methane ($CH_4$) and carbon dioxide ($CO_2$)—CarbonLoop optimizes discovery, transportation, conversion, and verifiable carbon credit accounting.

```text
[ Waste Generator ]
       │  (Logs Waste Batch: Crop residue, Spent Grain, Food waste)
       ▼
[ AI Smart Facility Matcher ]
       │  (Matches by waste type, moisture, capacity & distance)
       ▼
[ Route & Logistics Optimizer ]
       │  (Multi-stop collection routing + transport footprint)
       ▼
[ Conversion Facility ]
       │  (Pyrolysis / Anaerobic Digestion / Materials)
       ▼
[ Carbon Accounting & Passport Engine ]
       │  (Net CO₂e Abatement = Avoided Landfill - Transport - Process)
       ▼
[ Verifiable Digital Carbon Passport ]
```

---

## ✨ Key Features

### 1. 🚜 Waste Batch Lifecycle Tracking
- Create batches with attributes: Waste Type, Moisture Content %, Quantity (MT), Contamination Risk, and Geo-coordinates.
- Real-time status transitions: `CREATED` ➔ `MATCHED` ➔ `DISPATCHED` ➔ `RECEIVED` ➔ `CONVERTED`.

### 2. ⚡ Smart Facility Matching Engine
- Multi-parameter compatibility scoring based on:
  - Waste-to-Technology suitability (e.g., Agricultural stubble ➔ Biochar Pyrolysis; High-moisture food waste ➔ Biogas Digestion).
  - Facility operational capacity and intake limits.
  - Geo-proximity and transport feasibility.

### 3. 🗺️ Logistics & Route Optimization Map
- Interactive geospatial map powered by Leaflet.
- Visualizes generator locations, transport fleets, and conversion hubs.
- Real-time route optimization calculating travel distance (km), fuel consumption, and transport $CO_2$ penalty.

### 4. 📊 Carbon Accounting & Lifecycle Analysis (LCA)
- Rigorous carbon quantification model:
  $$\text{Net CO}_2\text{e Abated} = \text{Avoided Landfill Methane} - \text{Logistics Emissions} - \text{Conversion Footprint} + \text{Permanent Sequestration}$$
- Detailed metrics on avoided landfill volume ($m^3$), methane abatement ($kg\,CH_4$), and carbon credits generated ($tCO_2e$).

### 5. 🛡️ Cryptographic Digital Carbon Passport
- Generates tamper-proof audit passports for converted batches.
- Includes unique cryptographic verification hash, process audit trail, and public verification link.

### 6. 👥 4 Role-Tailored Dashboards
- **Waste Generator Portal**: Batch creation, disposal tracking, and credit earnings.
- **Plant Operator Portal**: Intake gate control, weighbridge verification, and reactor batch logging.
- **Municipality / Climate Cell Portal**: City-wide landfill diversion metrics, regional emissions heatmaps, and audit logs.
- **Platform Admin Portal**: Facility onboarding, user governance, and ecosystem monitoring.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (TypeScript)
- **Bundler**: Vite 6
- **Styling**: TailwindCSS with Custom Dark-Glassmorphic UI Design System
- **Icons**: Lucide React
- **Mapping**: Leaflet & React-Leaflet

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing
- **Execution & Transpilation**: `tsx` (TypeScript Execute & Watch)
- **Data Layer**: In-memory persistent data store with demo seed dataset

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher)

---

### Step 1: Install Dependencies

You can install all dependencies for both frontend and backend using the root helper script:

```bash
npm run install:all
```

*(Alternatively, install in each directory individually: `npm install` at root, in `server/`, and in `client/`)*

---

### Step 2: Start the Application

#### Option A: Run Both Together (Recommended)
From the project root directory:
```bash
npm run dev
```

#### Option B: Run in Separate Terminals

**Terminal 1 — Backend API:**
```bash
cd server
npm run dev
```
- Server URL: `http://localhost:5000`
- API Health Check: `http://localhost:5000/health`

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
```
- Client URL: `http://localhost:5173`

---

## 🔑 Demo Access & Login Credentials

The application is pre-seeded with ready-to-use demo accounts for instant evaluation. You can also use the **1-Click Role Portals** directly on the login screen.

| Role | Email | Password | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Waste Generator** | `generator@carbonloop.demo` | `DemoPassword123!` | Create & monitor agro-waste batches |
| **Facility Operator** | `facility@carbonloop.demo` | `DemoPassword123!` | Accept batches, run pyrolysis & digestors |
| **Municipality Officer** | `municipality@carbonloop.demo` | `DemoPassword123!` | City climate stats & landfill diversion |
| **Platform Admin** | `admin@carbonloop.demo` | `DemoPassword123!` | System oversight & facility verification |

---

## 📂 Project Structure

```text
CarbonLoop-Daiict-hackathon/
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Modular UI Components (Navbar, Cards, Modals)
│   │   ├── context/            # Auth & Application State Context
│   │   ├── services/           # REST API client services
│   │   ├── types/              # Frontend TypeScript Interfaces
│   │   ├── views/              # Role-specific & feature dashboards
│   │   │   ├── GeneratorDashboardView.tsx
│   │   │   ├── FacilityOperatorDashboardView.tsx
│   │   │   ├── MunicipalityAnalyticsView.tsx
│   │   │   ├── AdminManagementView.tsx
│   │   │   ├── SmartMatchingView.tsx
│   │   │   ├── LogisticsMapView.tsx
│   │   │   ├── CarbonImpactView.tsx
│   │   │   ├── CarbonPassportView.tsx
│   │   │   └── LoginPageView.tsx
│   │   ├── App.tsx             # Main Layout & Routing
│   │   └── index.css           # Global Theme & Glassmorphism styles
│   └── vite.config.ts          # Vite configuration with API reverse proxy
│
├── server/                     # Backend API Service (Express + TypeScript)
│   ├── docs/                   # Product Specifications & Architecture Docs
│   └── src/
│       ├── data/               # Seeded initial database records
│       ├── middleware/         # JWT Auth & Role Authorization
│       ├── routes/             # RESTful API Endpoints
│       │   ├── auth.ts         # User auth & demo logins
│       │   ├── batches.ts      # Waste batch lifecycle
│       │   ├── facilities.ts   # Facility management & matching
│       │   ├── logistics.ts    # Route planning & tracking
│       │   ├── carbon.ts       # LCA Carbon calculations
│       │   └── passport.ts     # Verifiable digital passports
│       ├── services/           # Carbon Math & Matching algorithms
│       └── index.ts            # Express server initialization
│
├── .env.example                # Example environment variables
├── package.json                # Root package workspace scripts
└── README.md                   # Project documentation
```

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/demo-login` | 1-Click fast login by role |
| `GET` | `/api/batches` | List all waste batches (supports filtering) |
| `POST` | `/api/batches` | Create a new waste batch |
| `PATCH` | `/api/batches/:id/status` | Advance batch status along value chain |
| `GET` | `/api/facilities` | List conversion facilities & capacities |
| `POST` | `/api/matching/match` | Match a waste batch to compatible facilities |
| `GET` | `/api/logistics/routes` | Get route coordinates, distances & carbon cost |
| `GET` | `/api/carbon/analytics` | Retrieve net carbon savings & LCA breakdown |
| `GET` | `/api/passport/:batchId` | Retrieve cryptographic passport for verification |

---

## 🏆 Hackathon Alignment

- **Theme**: *Circular Carbon Ecosystem*
- **Solution**: Converts agricultural waste and municipal organics into high-value biochar and renewable energy while creating a verifiable, transparent digital carbon ledger.
- **Impact**: Mitigates open field burning and landfill methane emissions, optimizes multi-stakeholder logistics, and accelerates the transition to net-zero economies.

---

### 👥 Team CarbonLoop — DA-IICT Hackathon 2026
Built with 💚 for a sustainable, circular carbon economy.