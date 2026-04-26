# VAULTO — Intelligent Cybersecurity Attack Prediction & Prevention System

VAULTO is a high-performance cybersecurity platform that uses Machine Learning to detect, analyze, and automatically mitigate network-level attacks. Built as a 3-tier microservice architecture, it provides real-time threat monitoring with 99.78% prediction accuracy.

![VAULTO Dashboard](https://raw.githubusercontent.com/matrix-ex/SheildIQ_cybersecurity_ML_model/main/frontend/public/dashboard_preview.png) *(Placeholder: Update with your actual screenshot)*

## 🚀 Key Features

- **Multi-Model ML Engine**: Compares 5 different models (XGBoost, Random Forest, MLP, SVM, KNN) side-by-side.
- **28-Feature Pipeline**: Real-time feature engineering (20 base + 8 derived features) with log-transformation for high precision.
- **Automated Prevention**: Intelligent engine that triggers actions like `DROP_CONNECTION`, `RATE_LIMIT`, or `QUARANTINE` based on attack type.
- **Real-Time Alerts**: Dedicated alerts dashboard with status tracking (Open, Mitigated, Dismissed) and severity filtering.
- **Glassmorphism UI**: Modern, high-tech dark theme dashboard built with React and Tailwind CSS.

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React.js, Vite, Tailwind CSS, Lucide Icons |
| **Backend API** | Node.js, Express, Mongoose |
| **ML Microservice** | Python, Flask, Scikit-Learn, XGBoost |
| **Database** | MongoDB Atlas (Cloud) |
| **Deployment** | Vercel (Frontend), Render (Backend & ML) |

## 🧠 ML Decision Brain

VAULTO classifies traffic into 11 distinct categories:
- **Normal** (Allow)
- **Volumetric Attacks**: DoS, DDoS, SYN Flood
- **Credential Attacks**: Brute Force, Dictionary Attack
- **Web Attacks**: SQL Injection, XSS
- **Recon/Intrusion**: Port Scan, R2L, Botnet

### Performance Metrics
- **XGBoost**: 99.78% (Primary)
- **Random Forest**: 99.76%
- **MLP**: 99.60%
- **Linear SVM**: 99.57%
- **KNN**: 98.75%

## 📂 Project Structure

```text
VAULTO_PREDICTION_MODEL/
├── backend/            # Express.js Server & Alert Logic
├── frontend/           # React.js Dashboard
├── ml/                 # Flask ML API & Trained Models
├── SYNOPSIS.pdf        # Project Documentation
└── README.md           # You are here
```

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/matrix-ex/SheildIQ_cybersecurity_ML_model.git
cd VAULTO_PREDICTION_MODEL
```

### 2. ML Microservice (Python)
```bash
cd ml
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

### 3. Backend (Node.js)
```bash
cd ../backend
npm install
# Create a .env file with MONGODB_URI and JWT_SECRET
npm start
```

### 4. Frontend (Vite)
```bash
cd ../frontend
npm install
npm run dev
```

## 🌐 Deployment Logic

The system is designed for cloud deployment:
- **Backend**: Deployed to Render.com.
- **Flask ML**: Deployed to Render.com (Gunicorn).
- **Frontend**: Deployed to Vercel.

---

## 👨‍💻 Contributors
- **Aman Dubey** (Enrollment: 00319071923)
- **Aryan Dev** (Enrollment: 00219071923)

## 🎓 Academic Info
- **Institution**: University School of Automation & Robotics (USAR), GGSIPU
- **Course**: B.Tech AI & Data Science (8th Sem)
- **Session**: 2025–2026
