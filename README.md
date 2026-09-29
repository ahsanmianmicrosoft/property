# PrimeHaven Real Estate & Property Management Platform

PrimeHaven is an enterprise-grade, full-stack Real Estate Website and Property Management CRM platform engineered for property agencies, housing authorities, developers, and brokers.

---

## 1. Project Overview

The platform enables real estate companies to:
- **Showcase & Filter Properties**: Dynamic search by Purpose (Buy/Rent/Lease), Property Type, City, Area, Price Range, Bedrooms, Bathrooms, and verified title status.
- **Side-by-Side Property Comparison**: Compare up to 4 listings across specs, cost per sq ft, and 14+ amenities.
- **Interactive Financial Tools**: Real-time Mortgage & Loan amortization calculator.
- **Direct Agent Engagement**: Schedule in-person/video viewing tours, submit inquiries, and launch direct WhatsApp chats prefilled with property title and URL.
- **Customer Shortlists & Profiles**: Save favorites, manage viewing appointments, and view submitted listings.
- **Owner & Agent Submissions**: Submit properties with a built-in verification workflow (`PENDING_APPROVAL` → `PUBLISHED`).
- **Comprehensive Admin CRM & ERP**:
  - Operational KPIs & Sales Funnel Analytics
  - Property Management with single-click Approve/Reject with feedback
  - Multi-stage Lead CRM (New, Contacted, Interested, Viewing Scheduled, Negotiation, Converted, Lost) with activity logging
  - Viewing Appointment Schedule Management
  - Inquiries Inbox
  - Master Projects & Housing Schemes Management
  - Agent Directory & Commission Management
  - Location Taxonomy (City → Area → Society)
  - Blog & Legal Due Diligence CMS
  - Reports & Instant CSV Export
  - Platform Settings (Multi-currency support: PKR, USD, AED, GBP, EUR)
  - Immutable Audit Log Ledger

---

## 2. Architecture & Tech Stack

```
/
├── server.ts                # Express REST API Backend + Vite Middleware mounting
├── prisma/
│   └── schema.prisma        # Complete Prisma ORM schema with 40+ models
├── src/
│   ├── components/          # Reusable domain-grade UI components
│   │   ├── Navbar.tsx       # Top Bar Contract (Wordmark, links, actions)
│   │   ├── Footer.tsx       # Domain-native real estate footer
│   │   ├── PropertyCard.tsx # Zero-pill metadata property cards
│   │   ├── MortgageCalculator.tsx
│   │   ├── ViewingModal.tsx
│   │   ├── InquiryModal.tsx
│   │   ├── ImageViewerModal.tsx
│   │   ├── CompareDrawer.tsx
│   │   └── WhatsAppButton.tsx
│   ├── context/
│   │   └── RealEstateContext.tsx # Centralized state & REST API synchronizer
│   ├── data/
│   │   └── mockData.ts      # Realistic seed database with architectural assets
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── PropertiesPage.tsx
│   │   ├── PropertyDetailsPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetailsPage.tsx
│   │   ├── AgentsPage.tsx
│   │   ├── AgentDetailsPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── PostPropertyPage.tsx
│   │   ├── BlogPage.tsx
│   │   ├── BlogPostPage.tsx
│   │   ├── CMSPages.tsx     # About, Services, Contact
│   │   ├── ProfilePage.tsx
│   │   └── AdminDashboard.tsx # 14-tab Admin CRM & Portal
│   └── types/
│       └── index.ts         # Full TypeScript schemas
├── docker-compose.yml       # PostgreSQL, Redis & App orchestration
├── docker-compose.prod.yml  # Production multi-replica deployment
├── Dockerfile               # Multi-stage production container
└── .env.example             # Complete environment configuration template
```

---

## 3. Quick Start & Development

### Prerequisites
- Node.js 20+ or 22+
- npm

### Installation
```bash
npm install
```

### Running Locally
To launch both the Express REST API backend and the React Vite client on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Role-Based Access Control (RBAC) & Testing Credentials

The top navigation bar includes an instant **Role Switcher** to test live user permissions without re-logging:

| Role | Demo Email | Capabilities |
| :--- | :--- | :--- |
| **SUPER_ADMIN** | `admin@primehaven.estate` | Full CRM pipeline, property approvals/rejections, settings, audit logs, CSV exports |
| **ADMIN** | `admin.ops@primehaven.estate` | Property editing, lead assignments, inquiries review |
| **AGENT** | `tariq.agent@primehaven.estate` | Viewing appointments management, lead follow-ups, assigned properties |
| **CUSTOMER** | `hamza.buyer@gmail.com` | Browse listings, save favorites, compare, schedule tours, submit listings |

---

## 5. REST API Documentation

### Properties
- `GET /api/properties`: Search and filter properties by purpose, city, area, price range, bedrooms, status, etc.
- `GET /api/properties/:slug`: Fetch detailed property data and auto-increment view counters.
- `POST /api/properties`: Submit a new listing (defaults to `pending_approval` if governance is active).
- `PATCH /api/properties/:id`: Update property specifications, status, or rejection feedback.
- `DELETE /api/properties/:id`: Remove a property.

### CRM & Leads
- `GET /api/leads`: Retrieve CRM leads list.
- `POST /api/leads`: Create a new CRM lead.
- `PATCH /api/leads/:id`: Update lead stage (New, Contacted, Interested, Viewing Scheduled, Negotiation, Converted, Lost).
- `POST /api/leads/:id/activity`: Log activity timeline entry (call, email, note, meeting).

### Viewing Appointments & Inquiries
- `GET /api/appointments`: List viewing tour requests.
- `POST /api/appointments`: Book viewing tour (also syncs with CRM leads).
- `PATCH /api/appointments/:id`: Update tour status (`pending`, `confirmed`, `completed`, `cancelled`).
- `GET /api/inquiries`: Inbound direct inquiries.
- `POST /api/inquiries`: Customer inquiry (creates corresponding CRM lead automatically).

### Platform Settings & Audit Log
- `GET /api/settings`: Fetch current currency and approval settings.
- `PATCH /api/settings`: Update platform settings.
- `GET /api/audit-logs`: Chronological audit trail.

---

## 6. Docker Deployment

### Local Multi-Container Stack (PostgreSQL + Redis + App)
```bash
docker compose up -d
```

### Production Stack
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 7. Database Backups Strategy

- **Daily Backups**: Automated `pg_dump` snapshot scheduled at 02:00 UTC with 30-day retention in S3 Glacier.
- **Point-in-Time Recovery (PITR)**: Write-Ahead Logs (WAL) archived every 15 minutes.
- **Restore Command**:
  ```bash
  psql -U primehaven_user -d primehaven_db < backup_2026_09_29.sql
  ```

---

## 8. License & Commercial Rights
Engineered for PrimeHaven Real Estate Holdings. Production-ready under Apache-2.0.
