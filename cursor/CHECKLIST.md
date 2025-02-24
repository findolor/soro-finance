# 📝 Soro Finance Backend - Development Checklist  

## 1️⃣ Project Setup & Environment  
- [x] Set up **Bun** as the runtime  
- [x] Initialize **Express** server  
- [x] Configure **PrismaORM** with SQLite  
- [x] Define **.env** for config variables (DB path, API keys, etc.)  
- [ ] Set up **Node Cron** for scheduled tasks  

### ✅ **Security & Utility Features**  
- [x] Basic server security (helmet, cors)
- [x] Request logging
- [x] Error handling middleware
- [ ] Basic authentication (API keys or JWT)  
- [ ] Role-based access control  
- [ ] Database backup mechanism  

---

## 2️⃣ Database Schema & Models (Prisma)  
- [x] **Users & Roles** (id, name, wallet, role, etc.)  
- [ ] **Projects** (id, name, description, team members)  
- [ ] **Payment Rules** (recipient, amount, schedule, token type)  
- [ ] **Income & Expenses** (amount, category, timestamp)  
- [ ] **Expense Requests** (amount, reason, status, approver)  
- [ ] **Transaction Logs** (payment ID, status, retries, etc.)  

---

## 3️⃣ API Endpoints (Express + Prisma)  
### ✅ **User & Role Management**  
- [ ] Create, update, delete users  
- [ ] Assign roles and projects  

### ✅ **Project & Team Management**  
- [ ] CRUD operations for projects  
- [ ] Assign team members to projects  

### ✅ **Income & Expense Tracking**  
- [ ] Record new income/expense entries  
- [ ] Fetch income/expense reports  

### ✅ **Payment Processing**  
- [ ] Create recurring payment rules  
- [ ] Handle failed payments and retries  

### ✅ **Expense Requests & Approvals**  
- [ ] Submit expense requests  
- [ ] Approve/reject requests (by admins or delegates)  

### ✅ **Reporting & Data Export**  
- [ ] API to fetch transaction history  
- [ ] Generate CSV/JSON exports  

### ✅ **Security & Utility Features**  
- [ ] Basic authentication (API keys or JWT)  
- [ ] Role-based access control  
- [ ] Database backup mechanism  

---

## 4️⃣ Automation & Cron Jobs (Node Cron)  
### ✅ **Recurring Payment Execution**  
- [ ] Fetch and process payments at scheduled intervals  

### ✅ **Failed Payment Handling**  
- [ ] Retry failed payments automatically or manually  

### ✅ **Scheduled Reporting**  
- [ ] Generate and email financial reports (optional)  

---

## 5️⃣ Testing & Deployment  
- [ ] **Unit Tests for API Endpoints**  
- [ ] **Local Testing with Bun Runtime**  
- [ ] **Dockerfile & Deployment Setup (if needed)**  
- [ ] **Production Database & API Hosting**  

---

## 🛠️ Finalization & Documentation  
- [ ] **Write API Documentation**  
- [ ] **Create a Setup Guide for Devs**  
- [ ] **Prepare User Manual for Admins**  
