# 🏛️ Public Grievance Tracker

> **Every grievance. One accountable journey.**

A transparent digital grievance management system that enables citizens to **submit public complaints, receive a unique case ID, and track the complete journey from submission to resolution** with clear deadlines, ownership, and status updates.

---

## 🚀 Problem Statement

Public grievances often become difficult to track after submission. Citizens may not know:

- Where their complaint currently stands
- Which department or official is responsible
- Whether action has been initiated
- When they can expect a resolution
- What happens if the grievance is delayed

This creates a lack of transparency and accountability between citizens and public authorities.

### 💡 Our Solution

**Public Grievance Tracker** provides a single, transparent interface where citizens can register and monitor grievances throughout their entire lifecycle.

Each grievance receives a **unique Case ID**, allowing citizens to track its progress without repeatedly visiting offices or making calls.

---

## ✨ Key Features

### 👤 Citizen Portal

- 📝 Register a new grievance
- 🆔 Automatically generate a unique Case ID
- 📎 Attach supporting documents
- 🔍 Track grievances using Case ID
- 📊 View current grievance status
- 🔔 Receive status-related notifications
- 📅 View expected resolution deadlines

### 👮 Staff Portal

- 📋 View assigned grievances
- 🔎 Search and filter cases
- 👤 Manage grievance ownership
- 🔄 Update grievance status
- 📝 Add progress updates
- ⏰ Monitor deadlines
- 🚨 Identify delayed or overdue grievances

### 📊 Transparent Tracking

Every grievance follows a clear lifecycle:

**Submitted → Acknowledged → Assigned → In Progress → Resolved → Closed**

Citizens can see where their grievance currently stands and who is responsible for the next action.

---

## 🎯 Demo Mode

The application includes a **Hackathon Demo Mode** that allows judges and evaluators to experience the complete grievance lifecycle without requiring a real government backend.

The demo includes:

- Realistic demonstration data
- Fictional Hyderabad civic zones
- Demonstration personnel
- Sample grievance cases
- Citizen, Staff, and Manager perspectives
- Resettable demo data

> ⚠️ All demonstration citizens, officials, locations, and cases are fictional and intended only for prototype demonstration.

---

## 🏗️ System Overview

```text
                 ┌─────────────────────┐
                 │      CITIZEN        │
                 │                     │
                 │ Register Grievance  │
                 │ Track Case          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  GRIEVANCE SYSTEM   │
                 │                     │
                 │ Generate Case ID    │
                 │ Assign Department   │
                 │ Track SLA/Deadline  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    STAFF PORTAL     │
                 │                     │
                 │ Review Cases        │
                 │ Update Status       │
                 │ Add Progress        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      RESOLUTION     │
                 │                     │
                 │ Resolve → Close     │
                 └─────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React** | Frontend application |
| **TypeScript** | Type-safe development |
| **Vite** | Development and build tooling |
| **HTML / CSS** | UI structure and styling |
| **LocalStorage** | Client-side persistence |
| **Google AI Studio** | AI-assisted application development |

---

## 💾 Data Persistence

The prototype uses **browser LocalStorage** for persistence.

This allows grievance information and application actions to remain available across page reloads without requiring an external backend.

A **Reset Data** option is also provided in Demo Mode to restore the demonstration environment.

---

## 🔐 Prototype Scope

This project is currently a **hackathon prototype**.

The prototype demonstrates the complete user experience and grievance lifecycle using simulated data.

### Current Prototype

- Client-side data persistence
- Demonstration grievance records
- Simulated staff assignments
- Simulated status updates
- Client-side document metadata handling
- Fictional civic zones and personnel
- Demo Mode for presentations

### Future Production Version

A production deployment could integrate:

- Government authentication
- Secure backend database
- Aadhaar/identity verification where legally appropriate
- Department APIs
- SMS and email notifications
- Real document storage
- Role-based access control
- Audit logs
- SLA escalation mechanisms
- Analytics dashboards
- Mobile application
- Multilingual support
- AI-assisted grievance categorization and routing

---

## 🌟 Why This Matters

The goal is not simply to digitize complaint submission.

The goal is to make the **entire grievance journey visible and accountable**.

Instead of:

> **Complaint → Black Box → Unknown Status**

the system provides:

> **Complaint → Case ID → Assigned Authority → Progress → Deadline → Resolution**

This helps build trust by giving citizens visibility into what happens after they submit a grievance.

---

## 📸 Application

### Citizen Dashboard

Citizens can register grievances and track existing cases using their unique Case ID.

### Staff Portal

Authorized personnel can review assigned grievances, update their status, and manage progress.

### Case Tracking

A unique Case ID provides a simple way for citizens to follow their grievance throughout its lifecycle.

---

## 🧪 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Rushikesh-crypto-lgtm/public-grievance-tracker.git
```

### 2. Open the project

```bash
cd public-grievance-tracker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the local URL

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

---

## 📁 Project Structure

```text
public-grievance-tracker/
│
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── metadata.json
└── README.md
```

---

## 🔮 Future Vision

Public Grievance Tracker can evolve into a scalable civic-tech platform connecting citizens with government departments through a transparent and accountable workflow.

### Long-term vision:

**Submit → Route → Assign → Act → Track → Resolve → Measure**

The system can eventually provide government administrators with analytics on:

- Average resolution time
- Department performance
- Overdue grievances
- Recurring complaint categories
- Geographic grievance trends
- SLA compliance
- Citizen satisfaction

---

## 👥 Team

**Team:** Public Grievance Tracker

**Project:** Hackathon Prototype — Public Grievance Management System

---

## 📄 License

This project was developed as a prototype for educational and hackathon purposes.

---

## ⭐ Support the Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Repository:**  
https://github.com/Rushikesh-crypto-lgtm/public-grievance-tracker
