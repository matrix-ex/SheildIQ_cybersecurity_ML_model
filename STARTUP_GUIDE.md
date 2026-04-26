# VAULTO: Startup & Integration Guide

This guide will help you run the full VAULTO system, including the ML Microservice, Backend API, and Frontend Dashboard.

## Prerequisites

- **Python 3.10+** (with `pip`)
- **Node.js 18+** (with `npm`)
- **MongoDB** (Local or Atlas)

---

## 1. Start ML Microservice (Python)

The ML service handles the heavy lifting of attack prediction using trained models.

```bash
cd ml
pip install -r requirements.txt
python app.py
```
*Wait for "Running on http://localhost:5000" to appear.*

---

## 2. Start Backend API (Node.js)

The backend manages users, stores prediction history in MongoDB, and proxies requests to the ML service.

```bash
cd backend
npm install
npm start
```
*Ensure MongoDB is running first. The server will run on http://localhost:4000.*

---

## 3. Start Frontend Dashboard (React + Vite)

The interactive dashboard for threat visualization and prediction.

```bash
cd frontend
npm install
npm run dev
```
*The app will be available at http://localhost:5173.*

---

## 4. Verification

1. Open http://localhost:5173 in your browser.
2. Log in (demo account details in `backend` if not registered).
3. Navigate to **Prediction** and load a sample to test the full pipeline.
4. Check the **Models** page to see real-time benchmark metrics from the ML core.

---

### Troubleshooting

- **ML Service Not Loading Models**: Ensure the `ml/models` directory contains the `.joblib` files. Run `ml/train_models.py` if missing.
- **Connection Refused**: Verify the ports in `backend/.env` match the running services.
- **Frontend Errors**: Ensure all three tiers (ML, Backend, Frontend) are running simultaneously.
