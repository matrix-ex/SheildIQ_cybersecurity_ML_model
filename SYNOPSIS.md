# VAULTO: An Intelligent Cybersecurity Attack Prediction System Using Machine Learning

## SYNOPSIS

Submitted in partial fulfillment of the Requirements for the award of the degree of

### Bachelor of Technology

**In**

### Artificial Intelligence and Data Science

**By**

| Name | Enrollment No. |
|------|----------------|
| **Aman Dubey** | 00319071923 |
| **Aryan Dev** | 00219071923 |

**Under the guidance of:**

**Dr. Anshul Bhatia**
**Dr. Rahul Johari**

---

**University School of Automation & Robotics**
**Guru Gobind Singh Indraprastha University**
**East Delhi Campus**
**Surajmal Vihar, Delhi-110032**
**Year 2022–2026**

---

## 1. PROJECT TITLE

**VAULTO: An Intelligent Cybersecurity Attack Prediction System Using Machine Learning**

---

## 2. ABSTRACT

In today's digital era, cybersecurity threats are growing exponentially in both volume and sophistication. Traditional rule-based intrusion detection systems (IDS) are no longer sufficient to handle the dynamic nature of modern cyberattacks. This project proposes **VAULTO**, an intelligent cybersecurity attack prediction system that leverages **five machine learning algorithms** to predict and classify **ten different types of cyberattacks** from network traffic data. The system is built as a **full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application** integrated with a **Python-based ML microservice**. VAULTO uses a hybrid dataset approach combining the **CICIDS2017** benchmark dataset with synthetically generated data to ensure comprehensive coverage of all attack categories. The system provides real-time attack prediction, model comparison, threat visualization, and automated security recommendations through an interactive web dashboard.

---

## 3. INTRODUCTION

### 3.1 Background

Cybersecurity is one of the most critical challenges of the 21st century. According to Cybersecurity Ventures, cybercrime is predicted to cost the world **$10.5 trillion annually by 2025**. The average cost of a data breach has reached **$4.45 million** (IBM, 2023). Traditional security systems rely on signature-based detection, which can only identify known threats. They fail against novel attacks, zero-day exploits, and sophisticated multi-vector attacks.

Machine Learning (ML) offers a paradigm shift in cybersecurity by enabling systems to **learn patterns** from historical attack data and **predict future attacks** before they cause damage. Unlike rule-based systems, ML models can generalize from known attacks to detect variations and previously unseen threats.

### 3.2 Problem Statement

Current cybersecurity defense mechanisms suffer from the following limitations:

- **Reactive approach**: Traditional IDS only detect attacks after they occur.
- **Signature dependency**: Rule-based systems cannot detect unknown or modified attacks.
- **High false positive rates**: Many alerts are false alarms, leading to alert fatigue.
- **No prediction capability**: Existing systems cannot forecast potential attacks.
- **Limited attack coverage**: Most tools focus on a narrow set of attack types.

### 3.3 Proposed Solution

VAULTO addresses these limitations by building an **ML-based prediction system** that:

1. Trains **5 different ML models** on network traffic data.
2. Classifies network traffic into **10 distinct attack categories**.
3. Compares model performance to identify the best predictor.
4. Provides a **full-stack web application** for easy interaction and visualization.
5. Offers **real-time predictions** and **automated security recommendations**.

---

## 4. OBJECTIVES

1. To develop a machine learning-based system capable of predicting 10 types of cyberattacks from network traffic features.
2. To implement and compare 5 different ML algorithms for attack classification.
3. To build a comprehensive full-stack web application using the MERN stack for user interaction, visualization, and reporting.
4. To create a hybrid dataset combining real-world (CICIDS2017) and synthetic data for robust model training.
5. To provide real-time attack prediction with confidence scores and severity levels.
6. To generate automated security recommendations and countermeasures for each detected threat.
7. To achieve a prediction accuracy of **95% or above** across models.

---

## 5. ATTACK TYPES (10 Categories)

The system predicts the following 10 attack types across 5 categories:

### 5.1 Authentication Attacks

| # | Code | Attack Name | Description |
|---|------|-------------|-------------|
| 1 | BA | **Brute Force Attack** | Systematically tries every possible password combination until the correct one is found. Uses automated tools to attempt thousands of passwords per second. |
| 2 | DA | **Dictionary Attack** | Uses a pre-compiled wordlist of common passwords and their variations. Faster than brute force as it targets likely passwords first. |

### 5.2 Network Attacks

| # | Code | Attack Name | Description |
|---|------|-------------|-------------|
| 3 | DoS | **Denial of Service** | Single-source flood of traffic that overwhelms the target server, making it unavailable to legitimate users. |
| 4 | DDoS | **Distributed Denial of Service** | Multiple compromised systems (botnet) simultaneously flood the target with traffic. Much harder to mitigate than DoS. |
| 5 | SYN | **SYN Flood Attack** | Exploits the TCP 3-way handshake by sending thousands of SYN packets without completing the connection, exhausting server resources. |

### 5.3 Reconnaissance Attack

| # | Code | Attack Name | Description |
|---|------|-------------|-------------|
| 6 | PT | **Probe / Port Scanning** | Scans target systems to discover open ports, running services, and vulnerabilities. Usually the first step before launching a targeted attack. |

### 5.4 Web Application Attacks

| # | Code | Attack Name | Description |
|---|------|-------------|-------------|
| 7 | SQLi | **SQL Injection** | Injects malicious SQL code into input fields to manipulate the backend database. Can read, modify, or delete all database contents. |
| 8 | XSS | **Cross-Site Scripting** | Injects malicious JavaScript into web pages viewed by other users. Steals session cookies, credentials, and enables account takeover. |

### 5.5 System & Malware Attacks

| # | Code | Attack Name | Description |
|---|------|-------------|-------------|
| 9 | R2L | **Remote to Local** | Attacker gains unauthorized local access to a target machine from a remote location by exploiting vulnerabilities or stolen credentials. |
| 10 | BOT | **Botnet Attack** | Network of infected devices controlled by an attacker via Command & Control (C2) server. Used for DDoS, spam, crypto mining, and data theft. |

---

## 6. MACHINE LEARNING MODELS (5 Algorithms)

### 6.1 Random Forest Classifier

- **Type**: Ensemble Learning (Bagging)
- **How it works**: Builds multiple decision trees on random subsets of data and features. Final prediction is made by majority voting across all trees.
- **Strengths**: Handles high-dimensional data well, resistant to overfitting, provides feature importance rankings.
- **Library**: scikit-learn

### 6.2 XGBoost (Extreme Gradient Boosting)

- **Type**: Ensemble Learning (Boosting)
- **How it works**: Builds trees sequentially, where each new tree corrects the errors of the previous one. Uses gradient descent to minimize loss.
- **Strengths**: State-of-the-art accuracy on tabular data, fast training, built-in regularization to prevent overfitting.
- **Library**: xgboost

### 6.3 Support Vector Machine (SVM)

- **Type**: Supervised Learning (Classification)
- **How it works**: Finds the optimal hyperplane that maximally separates different attack classes in high-dimensional feature space. Uses kernel trick for non-linear boundaries.
- **Strengths**: Effective in high-dimensional spaces, memory efficient, works well with clear margins of separation.
- **Library**: scikit-learn

### 6.4 K-Nearest Neighbors (KNN)

- **Type**: Instance-Based Learning (Lazy Learning)
- **How it works**: Classifies new data points based on the majority class among its K nearest neighbors in the feature space. Uses distance metrics (Euclidean, Manhattan).
- **Strengths**: Simple, intuitive, no training phase, naturally handles multi-class classification.
- **Library**: scikit-learn

### 6.5 Neural Network — Multi-Layer Perceptron (MLP)

- **Type**: Deep Learning
- **How it works**: Multiple layers of interconnected neurons that learn complex non-linear patterns in data through forward propagation and backpropagation.
- **Strengths**: Captures complex non-linear relationships, scales well with data, can learn hierarchical feature representations.
- **Library**: scikit-learn (MLPClassifier) / TensorFlow

### 6.6 Model Comparison

All 5 models will be evaluated using the following metrics:

| Metric | Formula | Purpose |
|--------|---------|---------|
| **Accuracy** | (TP + TN) / Total | Overall correctness |
| **Precision** | TP / (TP + FP) | How many predicted attacks are real |
| **Recall** | TP / (TP + FN) | How many real attacks were caught |
| **F1-Score** | 2 × (Precision × Recall) / (Precision + Recall) | Harmonic mean of Precision & Recall |
| **Confusion Matrix** | — | Detailed class-wise performance |
| **ROC-AUC** | Area Under ROC Curve | Model's ability to discriminate |

---

## 7. DATASET

### 7.1 Primary Dataset: CICIDS2017

- **Source**: Canadian Institute for Cybersecurity, University of New Brunswick
- **URL**: https://www.unb.ca/cic/datasets/ids-2017.html
- **Size**: ~2.8 million records, 80+ features
- **Attack coverage**: Brute Force, DoS, DDoS, Port Scan, Botnet, Web Attacks (SQL Injection, XSS)
- **Format**: CSV (Labeled)

### 7.2 Supplementary: Synthetic Data Generation

For attack types not fully represented in CICIDS2017 (Dictionary Attack, SYN Flood, R2L), synthetic data will be generated using:

- **Statistical modeling** based on known traffic patterns for each attack type
- **Feature distribution matching** to ensure synthetic data is realistic
- **SMOTE (Synthetic Minority Oversampling Technique)** for class balancing

### 7.3 Dataset Coverage

| Attack | CICIDS2017 | Synthetic | Status |
|--------|-----------|-----------|--------|
| Brute Force (BA) | ✅ | — | Covered |
| Dictionary Attack (DA) | — | ✅ | Generated |
| DoS | ✅ | — | Covered |
| DDoS | ✅ | — | Covered |
| SYN Flood | — | ✅ | Generated |
| Probe / Port Scan (PT) | ✅ | — | Covered |
| SQL Injection (SQLi) | ✅ | — | Covered |
| XSS | ✅ | — | Covered |
| R2L | — | ✅ | Generated |
| Botnet (BOT) | ✅ | — | Covered |

### 7.4 Feature Categories (Network Traffic Features)

| Category | Example Features |
|----------|------------------|
| **Basic** | Duration, Protocol Type, Service, Flag |
| **Content** | Source Bytes, Destination Bytes, Hot Indicators |
| **Traffic** | Connection Count, Service Count, Error Rates |
| **Host** | Destination Host Count, Same/Different Service Rates |
| **Authentication** | Failed Login Attempts, Logged In Status, Root Shell |

---

## 8. TECHNOLOGY STACK

### 8.1 Architecture Overview

```
┌──────────────────────────────────────────────────┐
│               FRONTEND (React.js)                 │
│   Dashboard │ Predict │ Models │ History │ About  │
└────────────────────────┬─────────────────────────┘
                         │ REST API
┌────────────────────────▼─────────────────────────┐
│             BACKEND (Node.js + Express.js)         │
│   Auth │ Routes │ Controllers │ Middleware         │
└──────────┬─────────────────────────┬─────────────┘
           │                         │
┌──────────▼──────────┐  ┌──────────▼──────────────┐
│   MongoDB Atlas      │  │  Python ML Microservice  │
│   • Users            │  │  (Flask / FastAPI)        │
│   • Predictions      │  │  • 5 Trained Models       │
│   • Attack Logs      │  │  • /api/predict           │
│   • Model Metrics    │  │  • /api/models/compare    │
└─────────────────────┘  └─────────────────────────┘
```

### 8.2 Frontend — React.js

| Technology | Purpose |
|-----------|---------|
| React.js 18+ | Component-based UI framework |
| React Router | Client-side routing |
| Axios | HTTP API calls |
| Chart.js / Recharts | Data visualization & charts |
| Tailwind CSS | Styling & responsive design |
| React Context / Redux | State management |

### 8.3 Backend — Node.js + Express.js

| Technology | Purpose |
|-----------|---------|
| Node.js 18+ | Server-side runtime |
| Express.js | REST API framework |
| Mongoose | MongoDB ODM |
| JWT (jsonwebtoken) | User authentication |
| bcrypt | Password hashing |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |

### 8.4 Database — MongoDB

| Collection | Purpose |
|-----------|---------|
| Users | User accounts, authentication |
| Predictions | Stored prediction results |
| AttackLogs | Historical attack detection logs |
| ModelMetrics | ML model performance metrics |

### 8.5 ML Microservice — Python

| Technology | Purpose |
|-----------|---------|
| Python 3.10+ | ML programming language |
| Flask / FastAPI | ML API server |
| scikit-learn | RF, SVM, KNN, MLP models |
| XGBoost | Gradient boosting model |
| pandas | Data manipulation |
| NumPy | Numerical computing |
| joblib | Model serialization |
| matplotlib / seaborn | Visualization generation |

---

## 9. SYSTEM MODULES

### Module 1: Data Collection & Preprocessing
- Load CICIDS2017 dataset
- Generate synthetic data for missing attack types
- Handle missing values, duplicates, infinite values
- Encode categorical features (Label Encoding)
- Normalize/standardize numerical features
- Split into training (80%) and testing (20%) sets

### Module 2: Feature Engineering
- Select most relevant features from 80+ available
- Create derived features (bytes ratio, error rates, etc.)
- Apply feature importance ranking
- Remove correlated/redundant features

### Module 3: Model Training
- Train 5 ML models: Random Forest, XGBoost, SVM, KNN, MLP
- Hyperparameter tuning using Grid Search / Random Search
- Cross-validation (5-fold) for robust evaluation
- Save trained models using joblib serialization

### Module 4: Model Evaluation & Comparison
- Calculate: Accuracy, Precision, Recall, F1-Score, ROC-AUC
- Generate confusion matrices for each model
- Compare all 5 models side-by-side
- Select best-performing model

### Module 5: Prediction Engine (Python API)
- Load trained models
- Accept network traffic features as input
- Return: attack type, severity, confidence, recommendation
- Support single and batch predictions

### Module 6: Web Application (MERN)
- **Landing Page**: Project overview, features, architecture
- **Dashboard**: Live stats, attack distribution charts, recent alerts
- **Predict Page**: Upload CSV or enter features → get predictions
- **Models Page**: Compare all 5 models with metrics and charts
- **History Page**: View past predictions stored in MongoDB
- **Attack Info Page**: Detailed info about all 10 attacks
- **Auth**: Login / Register with JWT authentication

### Module 7: Reporting & Visualization
- Attack distribution pie/bar charts
- Model performance comparison charts
- Confusion matrix heatmaps
- Feature importance rankings
- Threat severity indicators

---

## 10. SYSTEM FLOW DIAGRAM

```
┌─────────────┐
│  Raw Data    │  (CICIDS2017 + Synthetic)
└──────┬──────┘
       ▼
┌─────────────┐
│ Preprocess   │  Clean → Encode → Scale → Split
└──────┬──────┘
       ▼
┌─────────────────────────────────────────────┐
│           Train 5 ML Models                  │
│                                              │
│  Random    XGBoost    SVM     KNN    Neural  │
│  Forest                              Network │
└──────┬──────┬────────┬───────┬───────┬──────┘
       │      │        │       │       │
       ▼      ▼        ▼       ▼       ▼
┌─────────────────────────────────────────────┐
│         Evaluate & Compare Models            │
│  Accuracy │ Precision │ Recall │ F1 │ AUC   │
└──────────────────────┬──────────────────────┘
                       ▼
┌─────────────────────────────────────────────┐
│          Save Best Models (joblib)           │
└──────────────────────┬──────────────────────┘
                       ▼
┌─────────────────────────────────────────────┐
│       Python Flask/FastAPI Microservice       │
│       POST /api/predict → Prediction          │
└──────────────────────┬──────────────────────┘
                       ▼
┌─────────────────────────────────────────────┐
│         Node.js + Express.js Backend          │
│  Routes │ Auth │ MongoDB │ ML Service Proxy   │
└──────────────────────┬──────────────────────┘
                       ▼
┌─────────────────────────────────────────────┐
│            React.js Frontend                  │
│  Dashboard │ Predict │ Models │ History       │
└─────────────────────────────────────────────┘
```

---

## 11. EXPECTED OUTCOMES

1. A trained ML system capable of classifying 10 types of cyberattacks with **≥95% accuracy**.
2. Comparison of 5 ML algorithms showing which performs best for cybersecurity prediction.
3. A fully functional MERN stack web application with interactive dashboard.
4. Real-time attack prediction capability with confidence scores.
5. Automated security recommendations for each detected attack type.
6. Comprehensive visualization of model performance and attack distributions.

---

## 12. TOOLS & SOFTWARE REQUIREMENTS

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel i5 / Ryzen 5 | Intel i7 / Ryzen 7 |
| RAM | 8 GB | 16 GB |
| Storage | 20 GB free | 50 GB SSD |
| GPU | Not required | NVIDIA GPU (for Neural Network) |

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| Operating System | Windows 10/11, Ubuntu 20.04+ | Development platform |
| Python | 3.10+ | ML model development |
| Node.js | 18+ | Backend server |
| MongoDB | 6.0+ / Atlas | Database |
| VS Code | Latest | IDE |
| Git | Latest | Version control |
| Chrome / Edge | Latest | Testing frontend |

---

## 13. PROJECT SCHEDULE (Gantt-Chart Timeline)

- **Days 1–7:** Requirements gathering, literature review on cybersecurity threats and ML-based intrusion detection systems, system architecture design, environment setup (Python, Node.js, MongoDB, React.js).

- **Days 8–20:** Dataset acquisition (CICIDS2017), synthetic data generation for missing attack types (DA, SYN, R2L), data preprocessing (cleaning, encoding, normalization), feature engineering and selection from 80+ network traffic features.

- **Days 21–35:** Implementation of ML training pipeline, training of 5 models (Random Forest, XGBoost, SVM, KNN, MLP), hyperparameter tuning using Grid Search/Random Search, 5-fold cross-validation, model serialization using joblib.

- **Days 36–55:** Development of Python ML microservice (Flask/FastAPI) with prediction API endpoints, implementation of model evaluation metrics (Accuracy, Precision, Recall, F1-Score, ROC-AUC), confusion matrix generation, model comparison module.

- **Days 56–70:** Backend development (Node.js + Express.js REST API, MongoDB schema design, JWT authentication, user management), frontend dashboard development (React.js, Chart.js/Recharts for visualization, prediction UI, model comparison panel, attack info pages).

- **Days 71–80:** Full-stack integration and testing (connecting React frontend → Node.js backend → Python ML service → MongoDB), end-to-end testing, unit testing, stress testing with large datasets, performance benchmarking.

- **Days 81–90:** Documentation, result analysis, final report preparation, presentation slides, user manual, system optimization, and exploring deployment setups.

---

## 14. LITERATURE REVIEW / REFERENCES

1. **Sharafaldin, I., Lashkari, A. H., & Ghorbani, A. A.** (2018). "Toward Generating a New Intrusion Detection Dataset and Intrusion Traffic Characterization." *ICISSP 2018*. — CICIDS2017 dataset paper.

2. **Dhanabal, L., & Shantharajah, S. P.** (2015). "A Study on NSL-KDD Dataset for Intrusion Detection System Based on Classification Algorithms." *International Journal of Advanced Research in Computer and Communication Engineering*.

3. **Ahmad, Z., et al.** (2021). "Network Intrusion Detection System: A Systematic Study of Machine Learning and Deep Learning Approaches." *Transactions on Emerging Telecommunications Technologies*.

4. **Buczak, A. L., & Guven, E.** (2016). "A Survey of Data Mining and Machine Learning Methods for Cyber Security Intrusion Detection." *IEEE Communications Surveys & Tutorials*.

5. **Chen, T., & Guestrin, C.** (2016). "XGBoost: A Scalable Tree Boosting System." *Proceedings of the 22nd ACM SIGKDD*.

6. **Breiman, L.** (2001). "Random Forests." *Machine Learning, 45(1)*.

7. **Cortes, C., & Vapnik, V.** (1995). "Support-Vector Networks." *Machine Learning, 20(3)*.

8. **OWASP Foundation** (2021). "OWASP Top 10 Web Application Security Risks." https://owasp.org/www-project-top-ten/

9. **NIST** (2023). "Cybersecurity Framework." National Institute of Standards and Technology. https://www.nist.gov/cyberframework

10. **IBM Security** (2023). "Cost of a Data Breach Report 2023." https://www.ibm.com/reports/data-breach

---

## 15. CONCLUSION

VAULTO represents a comprehensive approach to cybersecurity attack prediction by combining the power of multiple machine learning algorithms with modern web technologies. By training 5 different ML models on a hybrid dataset covering 10 attack types, the system provides robust, accurate, and real-time attack prediction capabilities. The MERN stack web application makes the system accessible and user-friendly, while the automated recommendations help security teams respond quickly to threats. This project demonstrates the practical application of machine learning in solving real-world cybersecurity challenges.

---

**Project Name:** VAULTO — Cybersecurity Attack Prediction System  
**Technology:** MERN Stack + Python ML  
**Models:** Random Forest, XGBoost, SVM, KNN, Neural Network (MLP)  
**Attacks:** BA, DA, DoS, DDoS, SYN, PT, SQLi, XSS, R2L, BOT  
**Dataset:** CICIDS2017 + Synthetic (Hybrid)  

---

**Aman Dubey** (00319071923)  
**Aryan Dev** (00219071923)  
8th Semester, AI & DS  
