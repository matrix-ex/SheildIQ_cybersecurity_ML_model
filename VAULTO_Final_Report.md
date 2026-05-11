
# TABLE OF CONTENT

| S.No. | Title | Page No. |
|-------|-------|----------|
| | LIST OF FIGURES | i |
| | LIST OF TABLES | ii |
| | ROLES AND RESPONSIBILITIES | iii |
| | ABSTRACT | iv |
| **1** | **INTRODUCTION** | **1** |
| 1.1 | Background | 1 |
| 1.2 | Problem Statement | 2 |
| 1.3 | Objectives of the Project | 3 |
| 1.4 | Scope of the Project | 4 |
| 1.5 | Significance of the Study | 5 |
| 1.6 | Organization of the Report | 6 |
| **2** | **LITERATURE REVIEW** | **7** |
| 2.1 | Introduction | 7 |
| 2.2 | Overview of Cybersecurity Threat Landscape | 7 |
| 2.3 | Machine Learning in Intrusion Detection Systems | 9 |
| 2.4 | Review of Existing Tools and Frameworks | 10 |
| 2.5 | Comparative Analysis of ML Algorithms for Network Security | 12 |
| 2.6 | Research Gaps Identified | 13 |
| 2.7 | Summary of Literature Review | 14 |
| **3** | **METHODOLOGY** | **15** |
| 3.1 | Introduction | 15 |
| 3.2 | System Architecture | 15 |
| 3.3 | Dataset Generation and Feature Engineering | 17 |
| 3.4 | Machine Learning Pipeline | 19 |
| 3.5 | Backend API Development | 22 |
| 3.6 | Frontend Dashboard Development | 24 |
| 3.7 | Prevention Engine Design | 26 |
| 3.8 | Safe Zone Module | 27 |
| 3.9 | DEV â€” AI Security Assistant | 28 |
| 3.10 | Deployment Architecture | 29 |
| 3.11 | Tools and Technologies Used | 30 |
| **4** | **RESULTS AND DISCUSSION** | **31** |
| 4.1 | Introduction | 31 |
| 4.2 | Model Training Results | 31 |
| 4.3 | Model Performance Comparison | 33 |
| 4.4 | Feature Importance Analysis | 35 |
| 4.5 | Dashboard Screenshots and Analysis | 36 |
| 4.6 | Prediction Module Output | 38 |
| 4.7 | Alerts and Prevention Engine Output | 39 |
| 4.8 | Safe Zone Module Output | 40 |
| 4.9 | DEV AI Assistant Output | 41 |
| 4.10 | Discussion of Results | 42 |
| **5** | **CONCLUSION** | **43** |
| 5.1 | Conclusion | 43 |
| 5.2 | Key Contributions | 43 |
| 5.3 | Limitations | 44 |
| 5.4 | Future Scope | 44 |
| | **REFERENCES** | **46** |
| | **ANNEXURES** | **48** |

---

# LIST OF FIGURES

| Figure No. | Title | Page No. |
|------------|-------|----------|
| Figure 1.1 | Growth of Cyber Attacks Globally (2018â€“2025) | 2 |
| Figure 3.1 | VAULTO System Architecture (3-Tier Microservice) | 16 |
| Figure 3.2 | Dataset Generation Pipeline | 18 |
| Figure 3.3 | Feature Engineering Workflow | 19 |
| Figure 3.4 | ML Model Training Pipeline | 20 |
| Figure 3.5 | XGBoost Hyperparameter Configuration | 21 |
| Figure 3.6 | Backend API Route Architecture | 23 |
| Figure 3.7 | Frontend Component Hierarchy | 25 |
| Figure 3.8 | Prevention Engine Decision Flow | 26 |
| Figure 3.9 | Safe Zone Analysis Workflow | 28 |
| Figure 3.10 | Cloud Deployment Architecture | 29 |
| Figure 4.1 | Model Accuracy Comparison Bar Chart | 32 |
| Figure 4.2 | Model Performance Radar Chart | 34 |
| Figure 4.3 | Feature Importance Rankings | 35 |
| Figure 4.4 | Training Data Distribution (Pie Chart) | 36 |
| Figure 4.5 | VAULTO Dashboard â€” Network Risk Intelligence | 37 |
| Figure 4.6 | Attack Activity Timeline (24-Hour View) | 37 |
| Figure 4.7 | Prediction Console â€” Traffic Classification | 38 |
| Figure 4.8 | Multi-Model Comparison Output | 39 |
| Figure 4.9 | Alerts Dashboard with Triage Controls | 39 |
| Figure 4.10 | Prevention Engine Rules Table | 40 |
| Figure 4.11 | Safe Zone â€” URL Risk Scanner Output | 41 |
| Figure 4.12 | DEV AI Chat Assistant Interface | 41 |
| Figure 4.13 | Before vs After Optimization Metrics | 42 |

---

# LIST OF TABLES

| Table No. | Title | Page No. |
|-----------|-------|----------|
| Table 2.1 | Comparison of Existing IDS Solutions | 11 |
| Table 2.2 | ML Algorithms Used in Network Intrusion Detection | 12 |
| Table 3.1 | 20 Base Network Traffic Features | 17 |
| Table 3.2 | 8 Derived Engineered Features | 19 |
| Table 3.3 | ML Model Hyperparameters | 21 |
| Table 3.4 | Attack Classes and Severity Mapping | 22 |
| Table 3.5 | Prevention Rules Mapping | 27 |
| Table 3.6 | Technology Stack Summary | 30 |
| Table 4.1 | Complete Model Performance Metrics | 32 |
| Table 4.2 | Before vs After Optimization Comparison | 33 |
| Table 4.3 | Top 10 Features by Importance Score | 35 |
| Table 4.4 | Prevention Action Statistics | 40 |

---

# ROLES AND RESPONSIBILITIES

The development of the VAULTO â€” Intelligent Cybersecurity Attack Prediction and Prevention System was carried out as a collaborative effort between two team members. The responsibilities were divided to ensure efficient project execution while maintaining overlap to support cross-functional understanding of the system.

**Aman Dubey (Enrollment No: 00319071923)**

- Designed and implemented the complete Machine Learning pipeline, including synthetic dataset generation, feature engineering, model training, and hyperparameter optimization for all five classifiers (XGBoost, Random Forest, SVM, KNN, MLP).
- Developed the Flask-based ML Microservice API with endpoints for single prediction, multi-model comparison, and batch prediction.
- Built the Prevention Engine with rule-based automated countermeasures for all 11 attack classes.
- Handled the cloud deployment pipeline across Render (Backend and ML) and Vercel (Frontend).
- Prepared the project documentation and final report.

**Aryan Dev (Enrollment No: 00219071923)**

- Developed the React.js frontend dashboard using Vite and Tailwind CSS, including all major UI pages: Dashboard, Prediction Console, Models, Alerts, Safe Zone, and Prevention Engine.
- Implemented the Node.js/Express backend API with JWT-based authentication, MongoDB integration, and route architecture.
- Designed and integrated the DEV AI Security Assistant module using the Cerebras LLM API.
- Built the Safe Zone URL analysis module with automated site monitoring and threat escalation workflows.
- Implemented the alert triage system with real-time status tracking and filtering capabilities.

---

# ABSTRACT

The rapid proliferation of internet-connected systems and the growing sophistication of cyber threats have made network security a pressing concern for organizations of all sizes. Traditional rule-based intrusion detection systems often fall short against modern, evolving attack patterns, leading to a critical need for intelligent, adaptive security solutions. This project presents VAULTO â€” an Intelligent Cybersecurity Attack Prediction and Prevention System that leverages machine learning to detect, classify, and automatically mitigate network-level threats in real time.

VAULTO is architected as a three-tier microservice system comprising a Python-based ML prediction engine, a Node.js backend API, and a React.js interactive dashboard. The ML engine trains and compares five distinct classification algorithms â€” XGBoost, Random Forest, Support Vector Machine (SVM), K-Nearest Neighbors (KNN), and Multi-Layer Perceptron (MLP) â€” on a synthetically generated dataset of 110,000 network traffic samples spanning 11 distinct traffic categories, including Normal traffic and 10 attack types such as DDoS, SQL Injection, Brute Force, Botnet, and SYN Flood.

A 28-feature pipeline was designed, incorporating 20 base network telemetry features modeled after the CICIDS2017 dataset structure and 8 additional derived features engineered to maximize inter-class separability. Log transformation and StandardScaler normalization were applied to handle skewed distributions, while SMOTE oversampling addressed class imbalance. The best-performing model, XGBoost, achieved a prediction accuracy of 99.78% with a weighted F1-score of 99.74%.

Beyond detection, VAULTO implements an automated Prevention Engine that triggers context-aware countermeasures â€” such as connection dropping, rate limiting, IP quarantine, and WAF activation â€” based on the predicted attack class and model confidence. The system also features a Safe Zone module for URL-based threat scanning, a real-time Alerts dashboard with triage workflows, and DEV, an AI-powered security assistant built on the Cerebras LLM API for interactive threat guidance.

The platform was deployed to production using Vercel for the frontend, Render for the backend and ML services, and MongoDB Atlas for persistent data storage. The results demonstrate that VAULTO provides a comprehensive, end-to-end cybersecurity solution that bridges the gap between threat detection and automated response, making it a practical tool for real-time network defense.

**Keywords:** Machine Learning, Cybersecurity, Intrusion Detection System, XGBoost, Attack Prediction, Prevention Engine, React.js, Flask, Microservice Architecture

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background

The digital transformation of businesses, governments, and everyday life has created an expansive and interconnected cyber ecosystem. While this connectivity has unlocked unprecedented opportunities for communication, commerce, and innovation, it has simultaneously exposed critical infrastructure to a widening spectrum of cyber threats. The frequency, complexity, and financial impact of cyberattacks have escalated dramatically over the past decade. According to recent industry reports, the global cost of cybercrime is projected to exceed $10.5 trillion annually by 2025, making it one of the most significant economic risks facing the modern world.

Network-based attacks, in particular, have become increasingly prevalent. Distributed Denial-of-Service (DDoS) attacks, SQL injection campaigns, brute-force credential attacks, and sophisticated botnet operations now regularly target enterprises, financial institutions, healthcare systems, and government networks. The challenge is compounded by the speed at which these attacks evolve â€” threat actors continuously adapt their techniques to bypass conventional security mechanisms such as firewalls, signature-based intrusion detection systems (IDS), and static rule engines.

Traditional IDS solutions, while useful, operate primarily on predefined signatures and pattern-matching rules. This approach is inherently reactive: the system can only detect threats whose signatures have been previously catalogued. Novel or polymorphic attacks that deviate from known patterns often go undetected until significant damage has been inflicted. This limitation has driven the cybersecurity research community toward machine learning-based approaches, which can learn complex, non-linear patterns from network traffic data and generalize to previously unseen attack variants.

Machine learning models, particularly ensemble methods like Random Forest and gradient boosting frameworks like XGBoost, have shown considerable promise in classifying network traffic with high accuracy. When combined with carefully engineered features derived from raw network telemetry â€” such as flow duration, packet rates, inter-arrival times, and flag counts â€” these models can distinguish between benign and malicious traffic with precision that surpasses traditional methods.

However, most existing ML-based IDS implementations focus exclusively on detection, leaving the critical task of automated response and mitigation to manual security operations teams. This creates a dangerous time gap between threat detection and remediation, during which attackers can inflict substantial damage. There is a clear need for integrated systems that not only predict and classify attacks but also trigger appropriate countermeasures autonomously.

It is against this backdrop that VAULTO was conceived. VAULTO is an intelligent cybersecurity platform that unifies machine learning-based attack prediction with an automated prevention engine, a real-time monitoring dashboard, and an AI-powered security assistant â€” all within a modern, cloud-deployable microservice architecture.

Figure 1.1: Growth of Cyber Attacks Globally (2018â€“2025)
[Insert Screenshot Here]

## 1.2 Problem Statement

Despite significant advances in cybersecurity technologies, several persistent challenges remain in the domain of network intrusion detection and prevention:

1. **Reactive Detection:** Most commercial and open-source IDS/IPS tools rely heavily on signature databases that must be manually updated. This makes them inherently reactive and ineffective against zero-day exploits, novel attack vectors, and polymorphic threats that alter their signatures dynamically.

2. **Lack of Automated Response:** Even when threats are successfully detected, the transition from detection to active mitigation typically requires manual intervention by security analysts. In high-volume environments where thousands of alerts are generated daily, this manual triage process introduces critical delays and increases the risk of alert fatigue.

3. **Single-Model Limitations:** Many existing ML-based detection systems employ a single classification model without comparative validation. This approach provides no mechanism to assess prediction reliability across different algorithmic paradigms, potentially leading to overconfidence in misclassifications.

4. **Feature Engineering Gaps:** Several existing systems use raw network features without deriving higher-order statistical or relational features that can significantly improve inter-class separability. The absence of systematic feature engineering limits model performance, particularly for attack types with subtle traffic signatures.

5. **Fragmented Tooling:** The cybersecurity analyst's workflow is often spread across disparate tools â€” one for detection, another for alerting, a separate platform for incident response, and yet another for threat intelligence. This fragmentation reduces operational efficiency and increases the cognitive burden on security teams.

6. **Absence of Contextual Guidance:** Junior analysts and smaller organizations often lack access to real-time, context-aware security guidance. Existing tools rarely integrate AI-driven advisory capabilities that can help analysts understand attack behavior and recommend appropriate responses.

VAULTO addresses these challenges by providing an end-to-end platform that combines multi-model ML prediction, automated prevention, unified alert management, URL-based threat scanning, and an integrated AI security assistant within a single, cohesive system.

## 1.3 Objectives of the Project

The primary objectives of the VAULTO project are as follows:

1. To design and develop a machine learning-based system capable of classifying network traffic into 11 distinct categories â€” 1 normal class and 10 attack types â€” with high accuracy, precision, recall, and F1-score.

2. To implement and benchmark five different ML classification algorithms (XGBoost, Random Forest, SVM, KNN, and MLP) and provide a comparative analysis framework that allows users to evaluate model performance side-by-side.

3. To engineer a comprehensive feature pipeline consisting of 20 base network telemetry features and 8 derived statistical features, incorporating log transformation and standard scaling to maximize model accuracy.

4. To develop an automated Prevention Engine that maps predicted attack classes to specific countermeasure actions (DROP_CONNECTION, RATE_LIMIT, BLOCK_AND_LOG, QUARANTINE) without requiring manual intervention.

5. To build a real-time, interactive web dashboard using React.js that provides network risk intelligence, attack activity timelines, threat distribution visualizations, and alert triage capabilities.

6. To create a Safe Zone module for URL-based threat analysis that automatically registers monitored sites and escalates detected threats to the alert system.

7. To integrate DEV (Automated Response and Intelligence Agent), an AI-powered security assistant leveraging the Cerebras LLM API, to provide contextual cybersecurity guidance and incident response recommendations.

8. To deploy the complete system as a cloud-native application using Vercel, Render, and MongoDB Atlas, demonstrating production readiness and scalability.

## 1.4 Scope of the Project

The scope of VAULTO encompasses the following functional and technical boundaries:

**In Scope:**

- Synthetic generation of 110,000 labeled network traffic samples across 11 classes, modeled after the CICIDS2017 dataset feature structure.
- Training and evaluation of five ML models with hyperparameter tuning and epoch-level progress monitoring.
- Development of a Flask-based REST API serving trained models for real-time inference, including single prediction, multi-model comparison, and batch prediction endpoints.
- A Node.js/Express backend providing user authentication (JWT), prediction history storage (MongoDB), alert management, safe zone site monitoring, and prevention engine orchestration.
- A React.js SPA (Single Page Application) dashboard with seven functional pages: Dashboard, Prediction Console, Models, Alerts, Prevention Engine, Safe Zone, and Prediction History.
- A rule-based Prevention Engine that dynamically assigns countermeasures based on predicted attack class and model confidence thresholds.
- An AI chatbot (DEV) integrated with the Cerebras API for real-time cybersecurity Q&A.
- Cloud deployment across three platforms: Vercel (Frontend), Render (Backend + ML), and MongoDB Atlas (Database).

**Out of Scope:**

- Real-time packet capture and live network traffic analysis from production environments.
- Integration with enterprise SIEM (Security Information and Event Management) platforms.
- Hardware-level network appliance deployment.
- Mobile application development.

## 1.5 Significance of the Study

The significance of this project lies in its integrated, end-to-end approach to cybersecurity threat management. While individual components â€” ML-based detection, automated response, web dashboards â€” exist in isolation across various commercial and research tools, VAULTO combines them into a single, unified platform that demonstrates the practical feasibility of intelligent, autonomous network defense.

From an academic perspective, this project contributes to the growing body of research on applying ensemble and deep learning methods to network intrusion detection. The comparative evaluation of five distinct algorithms on the same dataset, using identical preprocessing and feature engineering pipelines, provides a controlled benchmark that highlights the relative strengths and weaknesses of each approach.

From a practical standpoint, the system's microservice architecture, cloud-native deployment, and modern UI design make it a viable prototype for real-world cybersecurity operations centers. The inclusion of the DEV assistant and the Safe Zone module further extends its utility beyond pure detection, positioning VAULTO as a comprehensive cybersecurity workbench.

## 1.6 Organization of the Report

The remainder of this report is organized as follows:

**Chapter 2: Literature Review** â€” Provides a comprehensive review of existing research and tools in the fields of intrusion detection, machine learning for cybersecurity, and automated threat response. It identifies key research gaps that VAULTO aims to address.

**Chapter 3: Methodology** â€” Details the system architecture, dataset generation process, feature engineering pipeline, ML model training procedures, backend and frontend development, prevention engine design, and deployment configuration.

**Chapter 4: Results and Discussion** â€” Presents the training outcomes, model performance metrics, feature importance analysis, and screenshots of the deployed system with a detailed discussion of results.

**Chapter 5: Conclusion** â€” Summarizes the project outcomes, highlights key contributions, acknowledges limitations, and outlines future research directions and enhancement possibilities.

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Introduction

This chapter presents a detailed review of the existing body of literature related to cybersecurity threat detection, machine learning-based intrusion detection systems, and automated prevention mechanisms. The purpose of this review is to establish the theoretical foundation upon which VAULTO is built, identify the strengths and shortcomings of prior approaches, and articulate the research gaps that motivated the design decisions adopted in this project. The review covers the evolving threat landscape, key ML algorithms applied to network security, notable IDS tools and frameworks, and a comparative analysis of classification techniques used for network traffic classification.

## 2.2 Overview of Cybersecurity Threat Landscape

The cybersecurity threat landscape has undergone a fundamental transformation over the past decade. What was once a domain of individual hackers and script kiddies has evolved into a sophisticated ecosystem involving organized cybercrime syndicates, nation-state threat actors, and advanced persistent threat (APT) groups. The proliferation of cloud computing, the Internet of Things (IoT), and remote work infrastructure has expanded the attack surface dramatically, creating new opportunities for exploitation.

According to Cisco's Annual Cybersecurity Report (2023), DDoS attacks increased by 40% year-over-year, with volumetric attacks regularly exceeding 1 Tbps in bandwidth consumption. Web application attacks, particularly SQL injection and cross-site scripting (XSS), continue to dominate the OWASP Top 10 vulnerability list and remain among the most frequently exploited vectors in data breaches. Meanwhile, credential-based attacks â€” including brute force and dictionary attacks â€” account for a significant proportion of initial access incidents, with Verizon's Data Breach Investigations Report (2023) attributing over 80% of web application breaches to compromised credentials.

The emergence of botnets as service platforms (Botnet-as-a-Service) has lowered the barrier to entry for launching large-scale attacks. Botnet infrastructure, once the exclusive domain of advanced actors, is now available for rent on underground marketplaces, enabling even technically unsophisticated individuals to orchestrate devastating DDoS campaigns and credential-stuffing operations.

SYN flood attacks remain a persistent threat to server availability. These attacks exploit the TCP three-way handshake mechanism by sending a flood of SYN packets without completing the connection, exhausting server resources and rendering services unavailable. Despite being a relatively old attack technique, SYN floods continue to be effective against systems that lack proper rate limiting and SYN cookie implementations.

Port scanning, while not inherently destructive, serves as a critical reconnaissance phase in the attack lifecycle. Attackers use port scanning tools like Nmap to identify open services, vulnerable ports, and potential entry points before launching targeted exploits. Detecting and flagging port scan activity is therefore an important early-warning capability for any IDS.

Remote-to-Local (R2L) attacks represent a class of intrusion where an external attacker gains unauthorized access to a local machine or network. These attacks typically involve exploiting vulnerabilities in network services, weak authentication mechanisms, or misconfigurations to establish a foothold within the target environment. Once inside, attackers can escalate privileges, exfiltrate data, or deploy additional malware.

The diversity and sophistication of these attack types underscore the need for intelligent detection systems that can recognize patterns across multiple attack categories simultaneously, rather than relying on separate, specialized tools for each threat type.

## 2.3 Machine Learning in Intrusion Detection Systems

The application of machine learning to intrusion detection has been an active area of research since the early 2000s. The fundamental premise is straightforward: rather than relying on manually crafted signatures, ML models can learn the statistical characteristics of normal and malicious network traffic from labeled datasets and use these learned patterns to classify new, unseen traffic in real time.

**Decision Tree-Based Methods:** Decision trees and their ensemble variants â€” Random Forest and Gradient Boosted Trees â€” have been among the most successful approaches for network intrusion detection. Stein et al. (2005) demonstrated that decision tree classifiers could achieve over 95% accuracy on the KDD Cup 1999 dataset, a benchmark dataset for intrusion detection research. Random Forests, introduced by Breiman (2001), improved upon individual decision trees by aggregating predictions from multiple decorrelated trees, reducing overfitting and improving generalization. In the context of IDS, Random Forests have consistently ranked among the top-performing classifiers across multiple benchmark datasets.

**Gradient Boosting and XGBoost:** XGBoost (Chen and Guestrin, 2016) introduced a scalable, regularized implementation of gradient boosting that has become the de facto standard for tabular classification tasks. Its built-in handling of missing values, regularization terms (L1 and L2), and efficient tree-pruning mechanisms make it particularly well-suited for network traffic classification, where feature distributions can be highly skewed and class boundaries non-trivial. Several studies have reported XGBoost achieving state-of-the-art accuracy on the CICIDS2017 and UNSW-NB15 datasets.

**Support Vector Machines (SVM):** SVMs, particularly linear variants, have been applied to IDS with varying degrees of success. While SVMs excel in high-dimensional spaces and are effective for binary classification, their performance on multi-class problems with highly imbalanced datasets has been mixed. Mukherjee and Sharma (2012) reported that SVMs achieved competitive accuracy on the NSL-KDD dataset but required significant preprocessing and feature selection to match the performance of ensemble methods.

**K-Nearest Neighbors (KNN):** KNN is a non-parametric, instance-based learning algorithm that classifies samples based on the majority vote of their k nearest neighbors in the feature space. While simple and intuitive, KNN's computational cost during inference scales linearly with the size of the training set, making it less practical for high-throughput, real-time applications. However, with optimized data structures (e.g., KD-trees) and distance-weighted voting, KNN can achieve competitive accuracy, particularly when the feature space is well-normalized.

**Neural Networks and MLP:** Multi-Layer Perceptrons (MLPs) and deep neural networks have been explored extensively for intrusion detection. Tang et al. (2016) demonstrated that a deep neural network with three hidden layers could outperform traditional ML classifiers on the NSL-KDD dataset. The advantage of neural networks lies in their ability to learn hierarchical feature representations automatically, reducing the need for manual feature engineering. However, they also require more training data, longer training times, and careful hyperparameter tuning compared to tree-based methods.

**Feature Engineering:** The importance of feature engineering in IDS performance cannot be overstated. Raw network features such as packet counts and byte rates provide a basic characterization of traffic flows, but derived features â€” such as forward-to-backward packet ratios, bytes per packet, inter-arrival time variance, and flag diversity â€” can significantly improve class separability. Sharafaldin et al. (2018), in their work on the CICIDS2017 dataset, demonstrated that engineered features improved classification accuracy by 3-5% across multiple algorithms.

## 2.4 Review of Existing Tools and Frameworks

Several notable IDS tools and platforms have been developed for both research and production environments:

**Snort** is one of the most widely deployed open-source IDS/IPS tools. Developed by Martin Roesch in 1998, Snort operates primarily as a signature-based detection system, using a rule language to define patterns of known attack traffic. While highly effective for known threats, Snort's reliance on manual rule updates limits its effectiveness against novel attacks. Snort does not natively support ML-based detection, though third-party plugins have been developed to integrate ML capabilities.

**Suricata** is a high-performance, open-source IDS/IPS and network security monitoring engine. Like Snort, Suricata is primarily signature-based but offers improved multi-threading support and protocol analysis capabilities. Suricata supports Lua scripting for custom detection logic but does not include built-in ML classification capabilities.

**Zeek (formerly Bro)** is a network security monitoring framework that generates detailed logs of network activity. Unlike Snort and Suricata, Zeek focuses on passive traffic analysis and event-driven scripting rather than inline packet inspection. Zeek's strength lies in its extensibility and detailed log generation, which can be fed into external ML pipelines for classification.

**IBM QRadar** is a commercial SIEM platform that combines log management, network flow analysis, and rule-based correlation. QRadar includes some ML-based anomaly detection capabilities, but its primary detection mechanism remains rule-based. The platform's enterprise pricing and complexity make it inaccessible for smaller organizations and academic projects.

**Elastic SIEM** leverages the Elasticsearch, Logstash, and Kibana (ELK) stack to provide log aggregation, threat detection, and visualization. While powerful for log analysis, Elastic SIEM requires significant configuration and does not provide out-of-the-box ML-based network traffic classification.

Table 2.1: Comparison of Existing IDS Solutions

| Feature | Snort | Suricata | Zeek | QRadar | VAULTO |
|---------|-------|----------|------|--------|--------|
| Detection Method | Signature | Signature | Passive | Rule + Anomaly | ML (5 models) |
| ML Classification | No | No | External | Limited | Built-in |
| Auto Prevention | Basic (IPS) | Basic (IPS) | No | Manual | Automated |
| Web Dashboard | No | No | No | Yes | Yes (React) |
| AI Assistant | No | No | No | No | Yes (DEV) |
| URL Scanning | No | No | No | No | Yes (Safe Zone) |
| Cloud Deployable | Manual | Manual | Manual | Hosted | Yes (Vercel/Render) |
| Open Source | Yes | Yes | Yes | No | Yes |

## 2.5 Comparative Analysis of ML Algorithms for Network Security

The selection of appropriate ML algorithms for network intrusion detection depends on several factors, including classification accuracy, inference speed, interpretability, and robustness to class imbalance. The following table summarizes the characteristics of the five algorithms implemented in VAULTO:

Table 2.2: ML Algorithms Used in Network Intrusion Detection

| Algorithm | Type | Strengths | Limitations | Typical Accuracy (CICIDS2017) |
|-----------|------|-----------|-------------|-------------------------------|
| XGBoost | Ensemble (Boosting) | High accuracy, handles imbalance, fast inference | Sensitive to hyperparameters | 99.0â€“99.8% |
| Random Forest | Ensemble (Bagging) | Robust, low overfitting, parallelizable | Memory intensive with many trees | 98.5â€“99.7% |
| SVM (Linear) | Discriminative | Effective in high dimensions | Slow on large datasets, limited multi-class | 97.0â€“99.5% |
| KNN | Instance-based | Simple, no training phase | Slow inference, sensitive to feature scaling | 96.0â€“98.8% |
| MLP | Neural Network | Learns non-linear patterns | Requires tuning, more data needed | 97.5â€“99.6% |

The rationale for including all five algorithms in VAULTO was to provide a comparative benchmarking framework that allows users to evaluate the trade-offs between accuracy, inference speed, and model complexity for their specific deployment context.

## 2.6 Research Gaps Identified

Based on the literature review, the following research gaps were identified:

1. **Detection-Only Focus:** The majority of ML-based IDS research concentrates on classification accuracy without addressing the equally critical challenge of automated response. Detection without actionable prevention creates a window of vulnerability that attackers can exploit.

2. **Single-Model Evaluation:** Most studies evaluate a single algorithm or a small subset of algorithms, making it difficult to compare performance across paradigms. A unified framework that trains, evaluates, and serves multiple models on the same dataset and preprocessing pipeline is needed.

3. **Insufficient Feature Engineering:** Many existing implementations use raw features from benchmark datasets without computing higher-order derived features that could improve class separability. Systematic feature engineering, combined with appropriate transformation (e.g., log transformation for skewed features), is often overlooked.

4. **Lack of Integrated User Interface:** Research prototypes typically present results in notebooks or terminal output, lacking a production-quality user interface for real-time monitoring and interaction. Bridging the gap between research prototype and operational tool requires investment in frontend development and user experience design.

5. **Absence of AI-Driven Advisory:** Existing tools do not integrate large language model-based assistants that can provide contextual explanations of detected threats and recommend mitigation strategies to security analysts.

6. **Limited Deployment Guidance:** Few research projects demonstrate end-to-end cloud deployment, leaving a gap between model development and production-ready system architecture.

## 2.7 Summary of Literature Review

This literature review has established that while machine learning has shown considerable promise for network intrusion detection, existing solutions remain fragmented, primarily detection-focused, and often inaccessible to smaller organizations. VAULTO addresses these gaps by providing an integrated platform that combines multi-model ML classification, automated prevention, real-time monitoring, URL-based threat scanning, and AI-powered advisory â€” all within a cloud-deployable, open-source microservice architecture. The methodology chapter that follows details how each of these capabilities was designed and implemented.

# CHAPTER 3: METHODOLOGY

## 3.1 Introduction

This chapter provides a comprehensive description of the methodology adopted for the design, development, and deployment of the VAULTO system. The discussion covers the overall system architecture, the synthetic dataset generation process, the feature engineering pipeline, the machine learning model training workflow, backend and frontend development, the prevention engine design, the Safe Zone module, the DEV AI assistant integration, and the cloud deployment architecture. Each section details the technical decisions, implementation logic, and design rationale behind the respective component.

## 3.2 Proposed Design Flow

This proposed design flow helps to understand the working of the overall functionality of VAULTO as a platform and how the different features are used within it. Key components of the suggested design flow are as follows:

1. User launches the VAULTO web application
2. Login/Registration Landing Page welcomes the user to the platform
3. User picks either Login or Register option
4. Backend authenticates user credentials and starts a JWT session
5. User is redirected to the Main Dashboard (Network Risk Intelligence)
6. Execution of data retrieval and visualization algorithms begin
7. User is shown real-time threat analytics (Charts, Attack Timelines, Alert Feed)
8. UI is updated with latest threat data and charts are interactive
9. User submits network features for ML prediction or scans a URL via Safe Zone
10. ML Microservice classifies the traffic and returns attack class with confidence
11. Prevention Engine maps the prediction to a countermeasure action
12. Active WAF Middleware enforces the prevention action in real-time
13. Alert is created and displayed on the Alerts Dashboard for triage
14. Backend and frontend are designed to be modular and flexible to accept updates in future

The suggested design flow is effective in terms of navigating through the platform smoothly and efficiently executing the features of the platform during its development.

## 3.3 Flow Chart Design

Figure 3.1: Flowchart of VAULTO Application
[Insert Screenshot Here]

## 3.4 Data Flow Diagram

Figure 3.2: Data Flow Diagram of VAULTO Application
[Insert Screenshot Here]

## 3.5 Entity-Relationship (E-R) Diagram

Figure 3.3: Entity-Relationship Diagram of VAULTO System
[Insert Screenshot Here]

## 3.6 Proposed Methodology

The methodology for VAULTO comprises of a structured and organised cybersecurity threat detection and prevention environment that implements user authentication, ML-driven analysis, and interactive visualization. This system allows users to evaluate network threats using machine learning models while providing a scalable platform for future development of advanced analytics and predictive features. The methodology is separated into two parts:

1. Algorithm Formulation and
2. System Architecture.

### 3.6.1 Algorithm Formulation

The main goal of the platform is based on an algorithm that will handle user interaction, threat prediction and prevention activities.

The algorithm will be as follows:

1. Launch the Web Application
2. Display the Landing Page
3. Navigate to Login/Register Screen
4. Enter User Credentials
5. Validate User Credentials
6. Access Main Dashboard after validating user credentials
7. User chooses a feature / module to access (Predict, Alerts, SafeZone, Models)
8. Initialize Data Fetching for Selected Module and Time Period
9. Execute ML Classification Algorithm on Network Traffic Features
10. Update UI with Up-to-date Progress Indicators
11. If Analysis is pending / incomplete, continue processing
12. If Analysis is Complete,
   - Halt processing
   - Display results and visualize
   - Update alert records and prevention action logs
   - Apply active WAF enforcement if confidence exceeds threshold
13. Complete Process

This way, users can get live feedback and retain execution control during the threat analysis procedure.

### 3.6.2 System Architecture Overview

The architecture design used for the VAULTO platform requires a modularized and layered design where the React framework will be used for the frontend to handle user interactivity, while Node.js/Express and Flask will be used for the backend to process and serve APIs. In this case, all layers have been created to allow separation of concern, flexibility and scalability.

Some of the key elements included in the architectural design include:

- **Presentation Layer:** This layer is home to the interface components that are meant to offer a responsive experience. The dashboard, prediction console, alerts page, safe zone scanner, and charts are part of the presentation layer.

- **Application Logic Layer:** This layer contains the main functionalities for the platform. ML prediction, prevention engine evaluation, alert triage, and URL analysis algorithms among other functions are clubbed together under this layer.

- **State Management Layer:** This layer handles user sessions, UI consistencies, and real-time data synchronization between the frontend and backend.

- **Authentication Layer:** This layer provides validation of credentials to ensure users' access is secured. The platform uses JSON Web Tokens (JWT) to guarantee protected login and personalized dashboards for each user.

- **Data Layer:** This layer manages data storage and retrieval using Mongoose and MongoDB Atlas. Data management includes alert records, prediction history, monitored sites, and user portfolios. Cloud-based services are fully integrated.

- **ML Intelligence Layer:** This layer hosts the five trained classification models (XGBoost, Random Forest, SVM, KNN, MLP) and handles feature transformation, prediction inference, and model comparison via the Flask REST API.

- **Active Enforcement Layer:** This layer contains the WAF middleware and Prevention Engine that actively drops, rate-limits, or quarantines malicious traffic based on ML predictions and the Three Strikes Rule.

Figure 3.4: VAULTO System Architecture (3-Tier Microservice)
[Insert Screenshot Here]

### 3.6.3 How the Application Works

The operation of the VAULTO platform starts with authentication of the user, followed by navigation in a defined path until it reaches the analysis module. Once the user successfully logs in, he/she is then presented with the dashboard where he/she is expected to perform various activities, including running threat predictions and URL security analyses. The analysis modules retrieve information from the ML microservice and run the classification algorithms while presenting visual information on the interface. This process involves continuous monitoring of the threat landscape alongside synchronizing the computations done on the server with the information presented on the client's end. When the analysis process is completed, the output is presented alongside automated prevention actions that are enforced in real-time by the WAF middleware.

### 3.6.4 Considerations for Driving Future Data Integration

For now, the application operates with a synthetically generated dataset, although there has been careful consideration of what could come next. Future considerations with respect to data management involve:

- Integration with live network packet capture tools (CICFlowMeter, tshark)
- Storing real-time traffic flow sessions
- Keeping track of attack progression patterns over time
- Recording of performances of different ML models across production environments
- Cloud-based synchronization of threat intelligence feeds

This would allow further development of the application into an effective enterprise-grade threat detection platform.

### 3.6.5 Benefits of the Proposed Methodology

The methodological approach used for development has some definite advantages:

- Modularity and scalability of threat analysis modules
- Real-time reaction due to high performance of data handling and UI update processes
- Clear division between responsibilities (e.g., frontend, backend, and ML operations)
- Easy way to implement new analytical features and ML models
- Possibilities of creating a better user experience through better data interaction

In general, the methodology offered is a very effective technical basis for the platform development.

## 3.7 Dataset Generation and Feature Engineering

### 3.7.1 Synthetic Dataset Generation

Given the challenges associated with obtaining real-world labeled network traffic data, including privacy concerns, data sensitivity, and class imbalance, VAULTO employs a synthetic dataset generator (`generate_dataset.py`) that produces realistic network traffic samples for 11 classes: 1 normal traffic class and 10 attack types.

The generator produces 10,000 samples per class, resulting in a balanced dataset of 110,000 total samples. Each class's feature distributions were carefully designed to reflect the statistical characteristics of real-world traffic patterns, modeled after the CICIDS2017 dataset structure.

Figure 3.5: Dataset Generation Pipeline
[Insert Screenshot Here]

### 3.7.2 Base Features (20 Features)

Table 3.1: 20 Base Network Traffic Features

| S.No. | Feature Name | Description |
|-------|-------------|-------------|
| 1 | flow_duration | Duration of the network flow in microseconds |
| 2 | total_fwd_packets | Total packets transmitted in forward direction |
| 3 | total_bwd_packets | Total packets transmitted in backward direction |
| 4 | total_len_fwd_packets | Total payload size of forward packets (bytes) |
| 5 | total_len_bwd_packets | Total payload size of backward packets (bytes) |
| 6 | fwd_packet_len_mean | Mean size of forward packets |
| 7 | bwd_packet_len_mean | Mean size of backward packets |
| 8 | flow_bytes_per_sec | Byte throughput rate of the flow |
| 9 | flow_packets_per_sec | Packet throughput rate of the flow |
| 10 | flow_iat_mean | Mean inter-arrival time between packets |
| 11 | fwd_iat_mean | Mean inter-arrival time in forward direction |
| 12 | bwd_iat_mean | Mean inter-arrival time in backward direction |
| 13 | fwd_psh_flags | Count of forward PSH flags |
| 14 | bwd_psh_flags | Count of backward PSH flags |
| 15 | fwd_urg_flags | Count of forward URG flags |
| 16 | syn_flag_count | Total SYN flags in the flow |
| 17 | rst_flag_count | Total RST flags in the flow |
| 18 | ack_flag_count | Total ACK flags in the flow |
| 19 | down_up_ratio | Download to upload traffic ratio |
| 20 | avg_packet_size | Average size of all packets in the flow |

### 3.7.3 Derived Features (8 Features)

Table 3.2: 8 Derived Engineered Features

| S.No. | Feature Name | Formula | Purpose |
|-------|-------------|---------|---------|
| 1 | fwd_bwd_packet_ratio | fwd_packets / (bwd_packets + e) | Directional asymmetry |
| 2 | bytes_per_packet | total_bytes / total_packets | Payload density |
| 3 | fwd_bwd_len_ratio | fwd_len / (bwd_len + e) | Payload direction bias |
| 4 | flag_diversity | Count of non-zero flag types | Protocol behavior complexity |
| 5 | flow_intensity | bytes_per_sec / total_packets | Per-packet throughput |
| 6 | packet_rate_ratio | packets_per_sec / (bwd_iat + e) | Relative packet urgency |
| 7 | iat_variance | |fwd_iat - bwd_iat| | Timing asymmetry |
| 8 | payload_ratio | total_bytes / (flow_duration + e) | Payload-to-duration density |

Figure 3.6: Feature Engineering Workflow
[Insert Screenshot Here]

### 3.7.4 Data Preprocessing

The preprocessing pipeline applies the following transformations:

1. **Infinity and NaN Handling:** All infinite values are replaced with NaN, then filled with 0 to prevent model training failures.
2. **Log Transformation:** The `np.log1p()` function is applied to 15 highly skewed features to normalize their distributions and reduce the impact of extreme outliers.
3. **Standard Scaling:** `StandardScaler` from scikit-learn normalizes all features to have zero mean and unit variance.
4. **SMOTE Oversampling:** Synthetic Minority Over-sampling Technique (SMOTE) is applied to the training set to further address any residual class imbalance.
5. **Train-Test Split:** The dataset is split 80-20 using stratified sampling to maintain class proportions in both sets.

## 3.8 Machine Learning Pipeline

### 3.8.1 Model Training Architecture

The model training pipeline (`train_models.py`) trains five classifiers sequentially, each with detailed progress logging, epoch-level monitoring, and early stopping where applicable.

Figure 3.7: ML Model Training Pipeline
[Insert Screenshot Here]

### 3.8.2 Model Configurations

Table 3.3: ML Model Hyperparameters

| Model | Key Hyperparameters | Training Strategy |
|-------|-------------------|-------------------|
| Random Forest | 800 trees, max_depth=50, class_weight='balanced' | Warm-start batch training (8 batches of 100 trees) |
| XGBoost | 800 rounds, max_depth=15, learning_rate=0.05 | Full boosting with per-round callback logging |
| SVM | LinearSVC, C=1.0, class_weight='balanced' | Two-step: LinearSVC fit + CalibratedClassifierCV (3-fold) |
| KNN | k=5, weights='distance', metric='minkowski' | Single-step KD-Tree index construction |
| MLP | Hidden layers (512, 256, 128), activation='relu' | Partial-fit epochs (up to 300) with early stopping |

### 3.8.3 Attack Classification Labels

Table 3.4: Attack Classes and Severity Mapping

| Class ID | Attack Name | Severity | Severity Score |
|----------|------------|----------|----------------|
| 0 | Normal | None | 0 |
| 1 | Brute Force | High | 7 |
| 2 | Dictionary Attack | High | 7 |
| 3 | DoS | Critical | 9 |
| 4 | DDoS | Critical | 10 |
| 5 | SYN Flood | Critical | 9 |
| 6 | Port Scan | Medium | 5 |
| 7 | SQL Injection | Critical | 9 |
| 8 | XSS | High | 8 |
| 9 | R2L | High | 8 |
| 10 | Botnet | Critical | 9 |

### 3.8.4 Prevention Engine Design (Active IPS)

The Prevention Engine (`preventionEngine.js`) has been designed as an Active Intrusion Prevention System (IPS). It maps each of the 11 attack classes to specific countermeasure actions and actively enforces them using a custom Web Application Firewall (WAF) middleware.

The engine implements stateful tracking using an in-memory map to monitor source IPs. If an attacker triggers three low-confidence or warning-level events within a 5-minute sliding window, the engine automatically escalates the threat to CRITICAL severity and applies a DROP_CONNECTION penalty, overriding the ML model's lower severity assessment. This is called the Three Strikes Rule.

To provide real-time protection, an Active Enforcement Middleware (`waf.js`) intercepts all API traffic globally. If the Prevention Engine issues a DROP_CONNECTION, the WAF instantly drops any subsequent requests from that IP with a 403 Forbidden response. If issued a RATE_LIMIT, the WAF tracks the IP's request count, blocking them with a 429 Too Many Requests response if they exceed 10 requests per minute.

Figure 3.8: Prevention Engine Decision Flow
[Insert Screenshot Here]

Table 3.5: Prevention Rules Mapping

| Attack Class | Action | Timeout | Key Prevention Actions |
|-------------|--------|---------|----------------------|
| Normal | ALLOW | 0 | Passive monitoring |
| Brute Force | RATE_LIMIT | 30 min | Account lockout, CAPTCHA, MFA |
| Dictionary Attack | RATE_LIMIT | 30 min | Account lockout, Rate limiting |
| DoS | DROP_CONNECTION | 1 hour | IP blocking, Traffic shaping |
| DDoS | DROP_CONNECTION | 2 hours | CDN mitigation, GeoIP blocking |
| SYN Flood | DROP_CONNECTION | 1 hour | SYN cookies, Half-open timeout |
| Port Scan | RATE_LIMIT | 15 min | IP blocking, Port restriction |
| SQL Injection | BLOCK_AND_LOG | 2 hours | WAF rules, Input validation |
| XSS | BLOCK_AND_LOG | 2 hours | CSP headers, Output encoding |
| R2L | BLOCK_AND_LOG | 1 hour | Access control, Network segmentation |
| Botnet | QUARANTINE | 24 hours | C2 blocking, DNS sinkholing, Host isolation |

## 3.9 Simulation Environment

VAULTO is created within a contemporary web simulation environment that includes React, Node.js, Flask and other browser-based and server-based technologies. A web simulation environment facilitates the creation of software within an organized environment, which guarantees uniformity of design and behavior irrespective of varying configurations in different browsers and devices.

Simulation environments play a significant part in software creation since they help developers to envision the operations of the software, guide users through their flow, and experiment with features as they are incorporated. This way, the designs and performance of logic can be fine-tuned for final consumers without many adjustments.

React's responsive design ensures that the VAULTO software performs uniformly in different browsers and devices. In other words, all users get similar experiences despite the screen size, resolution, or environmental condition.

### 3.9.1 Development Environment

The development environment encompasses all tools, frameworks, and technologies utilized to design and build the VAULTO platform.

Table 3.6: Development Environment Configuration

| Component | Description |
|-----------|-------------|
| Frontend Framework | React 18 with Vite used for building responsive user interfaces and interactive components with a component-based architecture. |
| Backend Framework | Node.js with Express used for developing high-performance REST APIs and handling server-side logic. |
| ML Framework | Flask with Scikit-Learn and XGBoost used for building and serving ML models via REST API. |
| Programming Languages | JavaScript for frontend and backend development, Python for ML implementation and data processing. |
| IDE | VS Code used for development, debugging, and project management across frontend, backend and ML. |
| Database | MongoDB Atlas used for cloud-based NoSQL data storage and retrieval. |
| Version Control | Git and GitHub used for source code management and collaborative development. |

### 3.9.2 Execution Environment

The execution environment outlines the functionality of the application during execution time. The execution environment is integral to the efficiency of the platform, where the components operate effectively to provide the best possible experience for the users. Some of the components include:

- Rendering of the user interface components using real-time threat data
- Efficient processing of user interactions and navigation processes
- Execution of the ML classification algorithms used for threat analysis and prevention

The React, Node.js and Flask platform performs optimally in terms of rendering and processing capabilities, hence providing fast and efficient execution of the platform.

VAULTO simulation environment is built around a dependable and scalable architecture that ensures independent development and implementation of the platform's features. The future development includes the following upgrades, for example:

- Cloud Data Storage and Sync with live packet capture
- User-Centric Analytical Reports and Performance Monitoring
- Notifications and Alarms via mobile push notifications
- Enhanced Predictive Modeling using Deep Learning (CNN, LSTM, Transformers)

Such scalability will facilitate the transformation of VAULTO into an advanced enterprise cybersecurity platform.

Furthermore, the use of the VAULTO Simulation Environment provides a number of advantages in terms of platform development:

- Fast App Development and Refinement
- Stable Environment for Interface and Business Logic Design
- Cross-Browser Compatibility
- Easy Implementation of Additional Features
- Enhanced System Maintenance

The VAULTO Simulation Environment creates a robust foundation for the platform. This allows dynamic updates and changes to the platform without breaking the existing workflows.



## 3.2 System Architecture

VAULTO follows a three-tier microservice architecture designed for modularity, independent scalability, and clear separation of concerns. The three tiers are:

1. **ML Microservice (Tier 1):** A Python Flask application that hosts the trained ML models, performs feature transformation, and serves prediction results via REST API endpoints. This service runs independently on port 5000 and can be scaled or replaced without affecting other tiers.

2. **Backend API (Tier 2):** A Node.js/Express application that serves as the central orchestration layer. It handles user authentication (JWT), proxies prediction requests to the ML service, manages the alert lifecycle, runs the prevention engine, and serves data to the frontend. This service runs on port 4000 and connects to MongoDB Atlas for persistent storage.

3. **Frontend Dashboard (Tier 3):** A React.js single-page application (SPA) built with Vite and Tailwind CSS. It provides an interactive, glassmorphism-styled dark/light theme dashboard for real-time threat monitoring, prediction, model benchmarking, alert triage, URL scanning, and AI-assisted security guidance. This service runs on port 5173 during development.

The inter-service communication follows a request-response pattern over HTTP. The frontend communicates exclusively with the backend API, which in turn proxies ML-related requests to the Flask microservice. This architecture ensures that the ML models are never directly exposed to the client, maintaining security and allowing backend-level access control.

Figure 3.1: VAULTO System Architecture (3-Tier Microservice)
[Insert Screenshot Here]

The system startup is orchestrated through a PowerShell script (`viper.ps1`) that launches all three services in separate terminal windows, ensuring that the ML service initializes first to allow model loading before the backend begins proxying requests.

## 3.3 Dataset Generation and Feature Engineering

### 3.3.1 Synthetic Dataset Generation

Given the challenges associated with obtaining real-world labeled network traffic data â€” including privacy concerns, data sensitivity, and class imbalance â€” VAULTO employs a synthetic dataset generator (`generate_dataset.py`) that produces realistic network traffic samples for 11 classes: 1 normal traffic class and 10 attack types.

The generator produces 10,000 samples per class, resulting in a balanced dataset of 110,000 total samples. Each class's feature distributions were carefully designed to reflect the statistical characteristics of real-world traffic patterns, modeled after the CICIDS2017 dataset structure:

- **Normal Traffic:** Moderate flow durations (200,000 Î¼s), balanced forward/backward packets, moderate byte rates, and typical flag distributions reflecting standard TCP communication.
- **Brute Force:** Very short flow durations (800 Î¼s), high forward packet counts, minimal backward traffic, extremely high packet rates (3,000+ pps), and elevated RST flag counts from failed authentication attempts.
- **DDoS:** Extremely short flows (50 Î¼s), massive forward packet volumes (600+), negligible backward traffic, extreme byte rates (20M+ B/s), and very high RST flag counts.
- **SYN Flood:** Short flows with very high SYN flag counts (60+), zero ACK flags, tiny packet sizes (~54 bytes), and negligible backward traffic.
- **SQL Injection:** Medium-duration flows, large forward payloads, very high PSH flag counts (8â€“20), and elevated ACK flags indicating persistent application-layer connections.
- **Botnet:** Long-duration flows with periodic beacon patterns, consistent inter-arrival times, low packet rates, and uniform packet sizes reflecting command-and-control communication.

Figure 3.2: Dataset Generation Pipeline
[Insert Screenshot Here]

### 3.3.2 Base Features

The dataset includes 20 base network traffic features that capture fundamental flow-level telemetry:

Table 3.1: 20 Base Network Traffic Features

| S.No. | Feature Name | Description |
|-------|-------------|-------------|
| 1 | flow_duration | Duration of the network flow in microseconds |
| 2 | total_fwd_packets | Total packets transmitted in forward direction |
| 3 | total_bwd_packets | Total packets transmitted in backward direction |
| 4 | total_len_fwd_packets | Total payload size of forward packets (bytes) |
| 5 | total_len_bwd_packets | Total payload size of backward packets (bytes) |
| 6 | fwd_packet_len_mean | Mean size of forward packets |
| 7 | bwd_packet_len_mean | Mean size of backward packets |
| 8 | flow_bytes_per_sec | Byte throughput rate of the flow |
| 9 | flow_packets_per_sec | Packet throughput rate of the flow |
| 10 | flow_iat_mean | Mean inter-arrival time between packets |
| 11 | fwd_iat_mean | Mean inter-arrival time in forward direction |
| 12 | bwd_iat_mean | Mean inter-arrival time in backward direction |
| 13 | fwd_psh_flags | Count of forward PSH flags |
| 14 | bwd_psh_flags | Count of backward PSH flags |
| 15 | fwd_urg_flags | Count of forward URG flags |
| 16 | syn_flag_count | Total SYN flags in the flow |
| 17 | rst_flag_count | Total RST flags in the flow |
| 18 | ack_flag_count | Total ACK flags in the flow |
| 19 | down_up_ratio | Download to upload traffic ratio |
| 20 | avg_packet_size | Average size of all packets in the flow |

### 3.3.3 Derived Features

To maximize inter-class separability, 8 additional features were engineered from the base features:

Table 3.2: 8 Derived Engineered Features

| S.No. | Feature Name | Formula | Purpose |
|-------|-------------|---------|---------|
| 1 | fwd_bwd_packet_ratio | fwd_packets / (bwd_packets + Îµ) | Directional asymmetry |
| 2 | bytes_per_packet | total_bytes / total_packets | Payload density |
| 3 | fwd_bwd_len_ratio | fwd_len / (bwd_len + Îµ) | Payload direction bias |
| 4 | flag_diversity | Count of non-zero flag types | Protocol behavior complexity |
| 5 | flow_intensity | bytes_per_sec / total_packets | Per-packet throughput |
| 6 | packet_rate_ratio | packets_per_sec / (bwd_iat + Îµ) | Relative packet urgency |
| 7 | iat_variance | |fwd_iat - bwd_iat| | Timing asymmetry |
| 8 | payload_ratio | total_bytes / (flow_duration + Îµ) | Payload-to-duration density |

Figure 3.3: Feature Engineering Workflow
[Insert Screenshot Here]

### 3.3.4 Data Preprocessing

The preprocessing pipeline applies the following transformations:

1. **Infinity and NaN Handling:** All infinite values are replaced with NaN, then filled with 0 to prevent model training failures.
2. **Log Transformation:** The `np.log1p()` function is applied to 15 highly skewed features (identified as `SKEWED_FEATURES` in the codebase) to normalize their distributions and reduce the impact of extreme outliers.
3. **Standard Scaling:** `StandardScaler` from scikit-learn normalizes all features to have zero mean and unit variance, ensuring that distance-based algorithms (KNN, SVM) are not biased by feature magnitude differences.
4. **SMOTE Oversampling:** When available, Synthetic Minority Over-sampling Technique (SMOTE) is applied to the training set to further address any residual class imbalance, with the `k_neighbors` parameter adaptively set based on the smallest class size.
5. **Train-Test Split:** The dataset is split 80-20 using stratified sampling to maintain class proportions in both sets.

## 3.4 Machine Learning Pipeline

### 3.4.1 Model Training Architecture

The model training pipeline (`train_models.py`) trains five classifiers sequentially, each with detailed progress logging, epoch-level monitoring, and early stopping where applicable.

Figure 3.4: ML Model Training Pipeline
[Insert Screenshot Here]

### 3.4.2 Model Configurations

Table 3.3: ML Model Hyperparameters

| Model | Key Hyperparameters | Training Strategy |
|-------|-------------------|-------------------|
| Random Forest | 800 trees, max_depth=50, max_features='sqrt', class_weight='balanced' | Warm-start batch training (8 batches of 100 trees) |
| XGBoost | 800 rounds, max_depth=15, learning_rate=0.05, subsample=0.85, reg_alpha=0.1, reg_lambda=1.0 | Full boosting with per-round callback logging |
| SVM | LinearSVC, C=1.0, class_weight='balanced', max_iter=5000 | Two-step: LinearSVC fit + CalibratedClassifierCV (3-fold) |
| KNN | k=5, weights='distance', metric='minkowski', leaf_size=20 | Single-step KD-Tree index construction |
| MLP | Hidden layers (512, 256, 128), activation='relu', solver='adam', learning_rate='adaptive' | Partial-fit epochs (up to 300) with early stopping (patience=20) |

Figure 3.5: XGBoost Hyperparameter Configuration
[Insert Screenshot Here]

### 3.4.3 Model Training Details

**Random Forest (800 Trees):**
The Random Forest classifier was trained using scikit-learn's `RandomForestClassifier` with `warm_start=True`, allowing incremental batch training. Eight batches of 100 trees each were fitted sequentially, with progress logging after each batch. The `class_weight='balanced'` parameter automatically adjusts class weights inversely proportional to class frequencies, improving recall for underrepresented classes. The `max_depth=50` parameter allows deep trees that capture complex feature interactions, while `min_samples_split=2` and `min_samples_leaf=1` prevent premature pruning.

**XGBoost (800 Boosting Rounds):**
XGBoost was configured with 800 boosting rounds, a learning rate of 0.05, and a maximum tree depth of 15. Subsample and column subsampling (both set to 0.85) introduce stochasticity to reduce overfitting. L1 regularization (`reg_alpha=0.1`) promotes feature sparsity, while L2 regularization (`reg_lambda=1.0`) penalizes large weight values. A custom `TrainingCallback` class logs progress every 10 rounds, displaying the current training loss and estimated time to completion.

**SVM (LinearSVC + Calibration):**
The SVM implementation uses a two-stage approach. First, a `LinearSVC` with `C=1.0` is trained for up to 5,000 iterations with `dual='auto'` mode selection. Second, the trained SVM is wrapped in `CalibratedClassifierCV` with 3-fold cross-validation to produce probability estimates, which are essential for the confidence-based thresholding in the Prevention Engine.

**KNN (k=5, Distance-Weighted):**
The KNN classifier uses 5 neighbors with distance-weighted voting and the Minkowski distance metric (p=2, equivalent to Euclidean distance). A `leaf_size=20` is used for the KD-Tree data structure to balance construction time and query speed. Multi-core parallelism (`n_jobs=-1`) accelerates both tree construction and inference.

**MLP (512-256-128, Early Stopping):**
The MLP classifier is trained using `partial_fit` for epoch-level control and early stopping. The three-layer architecture (512-256-128 neurons) with ReLU activation and Adam optimizer uses an adaptive learning rate that automatically reduces the learning rate when validation accuracy plateaus. A 10% validation split is maintained for monitoring, and training stops early if no improvement is observed for 20 consecutive epochs.

### 3.4.4 Attack Classification Labels

Table 3.4: Attack Classes and Severity Mapping

| Class ID | Attack Name | Severity | Severity Score |
|----------|------------|----------|----------------|
| 0 | Normal | None | 0 |
| 1 | Brute Force | High | 7 |
| 2 | Dictionary Attack | High | 7 |
| 3 | DoS | Critical | 9 |
| 4 | DDoS | Critical | 10 |
| 5 | SYN Flood | Critical | 9 |
| 6 | Port Scan | Medium | 5 |
| 7 | SQL Injection | Critical | 9 |
| 8 | XSS | High | 8 |
| 9 | R2L | High | 8 |
| 10 | Botnet | Critical | 9 |

### 3.4.5 Model Evaluation

All five models are evaluated on the held-out 20% test set using the following weighted metrics:
- **Accuracy:** Overall correct classification rate.
- **Precision:** Weighted average of per-class precision.
- **Recall:** Weighted average of per-class recall.
- **F1-Score:** Harmonic mean of precision and recall (weighted).
- **Confusion Matrix:** Full 11Ã—11 matrix for detailed error analysis.

## 3.5 Backend API Development

### 3.5.1 Server Architecture

The backend API is built with Node.js and Express, serving as the central orchestration hub for the entire VAULTO ecosystem. The server initializes with MongoDB connection establishment, demo API key seeding, and listener startup on port 4000.

Figure 3.6: Backend API Route Architecture
[Insert Screenshot Here]

The backend provides five route modules:

1. **Auth Routes (`/api/auth`):** Handles user registration, login, and session validation using JWT tokens with 7-day expiry. Passwords are hashed using bcrypt before storage.

2. **Predict Routes (`/api/predict`):** Proxies prediction requests to the Flask ML API. Supports single prediction, multi-model comparison (`/all`), prediction history retrieval, model information, and dashboard statistics.

3. **Alert Routes (`/api`):** Manages the complete alert lifecycle â€” creation, retrieval, statistical aggregation, triage status updates, and deletion. The `/analyze` endpoint is the primary entry point for threat analysis, combining ML prediction with prevention engine evaluation and automatic alert creation.

4. **SafeZone Routes (`/api/safezone`):** Provides URL-based threat analysis, monitored site management, and an auto-monitoring loop that periodically re-scans all active sites.

5. **AI Agent Routes (`/api/agent`):** Integrates with the Cerebras LLM API to power the DEV chat assistant, maintaining session-level conversation history and injecting live alert context into the system prompt.

### 3.5.2 Database Models

The MongoDB schema design includes five collections:

- **User:** Stores user credentials with bcrypt-hashed passwords and profile information.
- **Prediction:** Records individual prediction results with associated features, model used, confidence, and severity.
- **Alert:** Comprehensive alert records including source IP, attack classification, severity, confidence, prevention action, triage status, and timestamps. Indexed on status, severity, creation time, source IP, and source URL for efficient querying.
- **ApiKey:** Manages API keys for external integration with third-party sites (e.g., the Safe Zone protection SDK).
- **MonitoredSite:** Tracks URL monitoring state, scan counts, threat counts, and last-checked timestamps.

### 3.5.3 Middleware and Security

The backend implements JWT-based authentication middleware with both strict and optional variants. The strict middleware (`auth`) blocks unauthenticated requests, while the optional variant (`optionalAuth`) extracts user context when available but allows anonymous access for public-facing endpoints. CORS is configured to allow requests from the frontend origin (both local and deployed URLs) with credentials support.

## 3.6 Frontend Dashboard Development

### 3.6.1 Technology Stack

The frontend is built using React.js 18 with Vite as the build tool, providing fast hot-module replacement during development and optimized production builds. Tailwind CSS provides utility-first styling, while Lucide React supplies a consistent icon library. Recharts handles data visualization (charts, graphs, radar plots), and React Router manages client-side navigation.

Figure 3.7: Frontend Component Hierarchy
[Insert Screenshot Here]

### 3.6.2 Page Architecture

The application consists of seven main pages, each serving a distinct functional role:

1. **Dashboard (`/`):** The primary landing page displaying network risk intelligence. Features four stat cards (Protection Status, Open Alerts, 24-Hour Threats, Average Response Time), a 24-hour attack activity timeline (line chart), a threat distribution breakdown (bar chart), a recent threats feed, and a monitored sites panel. Data refreshes automatically every 30 seconds.

2. **Prediction Console (`/prediction`):** Allows manual submission of 20 network telemetry features for ML classification. Includes pre-loaded sample attack vectors for all 11 classes, model selection dropdown, single-model prediction, and multi-model comparison. Results display the detected class, confidence score, severity level, and AI-generated recommendation.

3. **Models (`/models`):** Benchmarking dashboard displaying model performance metrics fetched from the ML microservice. Includes a model leaderboard, accuracy comparison bar chart, training data distribution pie chart, class frequency comparison, feature importance rankings, model performance table, before-vs-after optimization comparison, and a metric consistency radar chart.

4. **Alerts (`/alerts`):** A live SOC (Security Operations Center) feed displaying all detected threats with severity badges, action indicators, and triage controls. Features filter pills for status (open/mitigated/dismissed), severity (critical/high/medium), and trigger source (safezone/manual/auto). Each alert card shows source IP, confidence, model used, prevention actions, and provides Mitigate/Dismiss buttons.

5. **Prevention Engine (`/prevention`):** Displays the complete prevention rules table for all 11 attack classes, with expandable detail rows showing specific countermeasure actions. Includes stat cards for total blocked, rate-limited, quarantined, and flagged-for-review counts. Recent prevention action logs with triage modal support.

6. **Safe Zone (`/safezone`):** URL-based threat scanner that analyzes submitted URLs against VAULTO's ML intelligence. Generates risk scores (0â€“100), identifies threat patterns, applies automated prevention, and registers sites for continuous monitoring. Includes auto-monitor toggle for periodic re-scanning.

7. **Prediction History (`/logs`):** Displays historical prediction records for authenticated users, including timestamps, model used, predicted class, and confidence scores.

### 3.6.3 Component Design

Reusable components include:
- **Sidebar:** Collapsible navigation with route links and active state highlighting.
- **Header:** Top bar with hamburger menu toggle and user information.
- **PreventionPanel:** Displays prevention action details inline with prediction results.
- **AlertsBadge:** Real-time notification indicator for open alerts.
- **DEVChat:** Floating chat widget with conversation persistence and quick-question shortcuts.

## 3.7 Prevention Engine Design (Active IPS)

The Prevention Engine (`preventionEngine.js`) has been designed as an Active Intrusion Prevention System (IPS). It maps each of the 11 attack classes to specific countermeasure actions and actively enforces them using a custom Web Application Firewall (WAF) middleware.

### 3.7.1 Stateful Tracking (Three Strikes Rule)
The engine implements stateful tracking using an in-memory map to monitor source IPs. If an attacker triggers three low-confidence or warning-level events (such as a Rate Limit for Port Scanning) within a 5-minute sliding window, the engine automatically escalates the threat to `CRITICAL` severity and applies a `DROP_CONNECTION` penalty, overriding the ML model's lower severity assessment.

### 3.7.2 Active Enforcement Middleware
To provide real-time protection, an Active Enforcement Middleware (`waf.js`) intercepts all API traffic globally. If the Prevention Engine issues a `DROP_CONNECTION`, the WAF instantly drops any subsequent requests from that IP with a `403 Forbidden` response. If issued a `RATE_LIMIT`, the WAF tracks the IP's request count, blocking them with a `429 Too Many Requests` response if they exceed 10 requests per minute.

Figure 3.8: Prevention Engine Decision Flow
[Insert Screenshot Here]

Table 3.5: Prevention Rules Mapping

| Attack Class | Action | Timeout | Key Prevention Actions |
|-------------|--------|---------|----------------------|
| Normal | ALLOW | 0 | Passive monitoring |
| Brute Force | RATE_LIMIT | 30 min | Account lockout, CAPTCHA, MFA |
| Dictionary Attack | RATE_LIMIT | 30 min | Account lockout, Rate limiting |
| DoS | DROP_CONNECTION | 1 hour | IP blocking, Traffic shaping |
| DDoS | DROP_CONNECTION | 2 hours | CDN mitigation, GeoIP blocking |
| SYN Flood | DROP_CONNECTION | 1 hour | SYN cookies, Half-open timeout |
| Port Scan | RATE_LIMIT | 15 min | IP blocking, Port restriction |
| SQL Injection | BLOCK_AND_LOG | 2 hours | WAF rules, Input validation |
| XSS | BLOCK_AND_LOG | 2 hours | CSP headers, Output encoding |
| R2L | BLOCK_AND_LOG | 1 hour | Access control, Network segmentation |
| Botnet | QUARANTINE | 24 hours | C2 blocking, DNS sinkholing, Host isolation |

A critical design feature is the confidence-based override: when model confidence falls below 75%, the engine overrides the automatic prevention action with `FLAG_FOR_REVIEW`, escalating the event to a human analyst instead of potentially blocking legitimate traffic based on low-confidence predictions.

## 3.8 Safe Zone Module

The Safe Zone module provides URL-level threat assessment by extracting behavioral features from submitted URLs and running them through the ML prediction pipeline. The module implements URL pattern analysis that examines path segments (e.g., `/login`, `/admin`), query parameters (e.g., `?id=`, `?q=`), domain reputation against a known-safe domain list, and API endpoint patterns.

Figure 3.9: Safe Zone Analysis Workflow
[Insert Screenshot Here]

Each URL pattern is mapped to a feature profile that resembles the corresponding attack type's traffic signature. The ML prediction result is then combined with a risk scoring algorithm that weighs model confidence (65%) and prevention action severity (35%) to produce a composite risk score between 0 and 100.

The auto-monitor feature runs a 30-second polling loop that re-analyzes all active monitored sites, creating new alerts whenever threats are detected. Monitored sites are tracked with scan counts, threat counts, and last-checked timestamps in the MongoDB `MonitoredSite` collection.

## 3.9 DEV â€” AI Security Assistant

DEV (Automated Response and Intelligence Agent) is an AI-powered chatbot integrated into the VAULTO dashboard. The backend connects to the Cerebras LLM API (using the `llama3.1-8b` model) to generate context-aware cybersecurity responses.

The system prompt explicitly instructs DEV to be an expert in all 11 attack classes monitored by VAULTO, providing explanations of attack mechanisms, real-world examples, severity assessments, and prevention recommendations. Live alert context â€” including total alert counts, severity distribution, and recent threat details â€” is injected into the system prompt to enable DEV to reference the current security posture of the monitored environment.

Session management maintains up to 10 messages per session, with conversation history stored server-side in a Map keyed by session ID. The frontend implements a simulated streaming effect that reveals the assistant's response character by character, creating a natural typing experience.

## 3.10 Deployment Architecture

Figure 3.10: Cloud Deployment Architecture
[Insert Screenshot Here]

The production deployment utilizes three cloud platforms:

- **Vercel (Frontend):** The React.js application is deployed via Vercel with automatic builds from the Git repository. A `vercel.json` configuration handles SPA routing rewrites. Environment variables point the API base URL to the Render-hosted backend.
- **Render (Backend + ML):** Both the Node.js backend and the Flask ML service are deployed as separate Render web services. Each uses a `Procfile` to specify the start command (`web: node server.js` and `web: gunicorn app:app`, respectively).
- **MongoDB Atlas (Database):** A cloud-hosted MongoDB cluster provides persistent storage for users, predictions, alerts, API keys, and monitored sites. Connection is established via the `MONGODB_URI` environment variable.

## 3.11 Tools and Technologies Used

Table 3.6: Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| ML Framework | Scikit-Learn | 1.3.2 | Model training, evaluation, preprocessing |
| Gradient Boosting | XGBoost | 2.0.3 | Gradient boosted classification |
| ML API | Flask | 3.0.0 | REST API for model serving |
| Backend | Node.js + Express | 18+ | API orchestration, auth, alerts |
| Frontend | React.js + Vite | 18+ | Interactive SPA dashboard |
| Styling | Tailwind CSS | 3.x | Utility-first CSS framework |
| Charts | Recharts | 2.x | Data visualization |
| Database | MongoDB Atlas | 7.x | Cloud NoSQL storage |
| Auth | JSON Web Tokens | - | Stateless authentication |
| LLM API | Cerebras (Llama 3.1) | - | AI assistant backend |
| Deployment | Vercel + Render | - | Cloud hosting |
| Data Processing | Pandas, NumPy | 2.1.4, 1.26.4 | Dataset manipulation |
| Model Serialization | Joblib | 1.3.2 | Model persistence |
| Version Control | Git + GitHub | - | Source code management |

# CHAPTER 4: RESULTS AND DISCUSSION

## 4.1 Introduction

This chapter presents the results obtained from the training and evaluation of the five machine learning models, the feature importance analysis, and the functional output of each system module. Screenshots and output visualizations are included to demonstrate the working state of the deployed VAULTO platform. A detailed discussion of the results, their implications, and observed patterns follows the presentation of individual module outputs.

## 4.2 Model Training Results

The five ML models were trained on the preprocessed dataset of 110,000 samples (88,000 training, 22,000 testing after the 80-20 split). SMOTE oversampling was applied to the training set to further balance class representation. The training was executed sequentially, with epoch-level progress monitoring and automated model serialization upon completion.

### 4.2.1 Model Accuracy Summary

The following table presents the complete performance metrics for all five models, evaluated on the held-out test set:

Table 4.1: Complete Model Performance Metrics

| Rank | Model | Accuracy (%) | Precision (%) | Recall (%) | F1-Score (%) |
|------|-------|-------------|---------------|------------|-------------|
| 1 | XGBoost | 99.78 | 99.76 | 99.73 | 99.74 |
| 2 | Random Forest | 99.76 | 99.74 | 99.71 | 99.72 |
| 3 | MLP | 99.60 | 99.58 | 99.55 | 99.56 |
| 4 | SVM (Linear) | 99.57 | 99.55 | 99.52 | 99.53 |
| 5 | KNN | 98.75 | 98.70 | 98.68 | 98.69 |

XGBoost emerged as the top-performing model with 99.78% accuracy, closely followed by Random Forest at 99.76%. The MLP neural network achieved 99.60%, demonstrating competitive performance despite its fundamentally different learning paradigm. The Linear SVM, after probability calibration, reached 99.57%, while KNN, though the lowest-performing model, still maintained a strong 98.75% accuracy.

Figure 4.1: Model Accuracy Comparison Bar Chart
[Insert Screenshot Here]

### 4.2.2 Training Time Analysis

The training times varied significantly across models due to their algorithmic complexity:

- **Random Forest:** Completed in approximately 45â€“60 seconds across 8 batches of 100 trees each. The warm-start mechanism allowed incremental tree addition without retraining from scratch.
- **XGBoost:** Required approximately 90â€“120 seconds for 800 boosting rounds with per-round loss logging.
- **SVM:** The two-step process (LinearSVC fit + 3-fold calibration) took approximately 30â€“40 seconds total.
- **KNN:** Near-instantaneous fit time (2â€“3 seconds) due to the lazy learning paradigm â€” KNN simply stores the training data and builds a KD-Tree index.
- **MLP:** The longest training time at approximately 120â€“180 seconds, though early stopping typically terminated training before reaching the maximum 300 epochs.

## 4.3 Model Performance Comparison

### 4.3.1 Before vs After Optimization

To quantify the impact of the feature engineering pipeline and hyperparameter optimization, performance was compared between a baseline configuration (raw features, default hyperparameters) and the final optimized configuration:

Table 4.2: Before vs After Optimization Comparison

| Metric | Before Optimization | After Optimization | Improvement |
|--------|-------------------|-------------------|-------------|
| Accuracy | 94.2% | 99.78% | +5.58% |
| Precision | 93.4% | 99.76% | +6.36% |
| Recall | 92.8% | 99.73% | +6.93% |
| F1 Score | 93.1% | 99.74% | +6.64% |
| False Positive Rate | 5.2% | 0.8% | -4.4% |

The improvement was attributed primarily to three factors: (a) the addition of 8 derived features that increased inter-class separability, (b) log transformation of skewed features that normalized the feature space, and (c) careful hyperparameter tuning that maximized each model's learning capacity without overfitting.

### 4.3.2 Radar Chart Analysis

The metric consistency radar chart provides a visual comparison of all five models across four evaluation dimensions (accuracy, precision, recall, F1-score). All models demonstrated strong consistency across metrics, indicating balanced performance without significant bias toward any particular evaluation criterion. XGBoost and Random Forest showed the most uniform radar profiles, suggesting they are the most reliable choices for production deployment.

Figure 4.2: Model Performance Radar Chart
[Insert Screenshot Here]

## 4.4 Feature Importance Analysis

Feature importance was extracted from the trained XGBoost model to identify which network traffic characteristics contributed most significantly to classification decisions:

Table 4.3: Top 10 Features by Importance Score

| Rank | Feature Name | Importance Score |
|------|-------------|-----------------|
| 1 | flow_bytes_per_sec | 0.95 |
| 2 | syn_flag_count | 0.92 |
| 3 | total_fwd_packets | 0.88 |
| 4 | flow_packets_per_sec | 0.85 |
| 5 | flow_duration | 0.82 |
| 6 | fwd_iat_mean | 0.79 |
| 7 | rst_flag_count | 0.75 |
| 8 | ack_flag_count | 0.72 |
| 9 | total_bwd_packets | 0.68 |
| 10 | avg_packet_size | 0.65 |

The results indicate that throughput-related features (`flow_bytes_per_sec`, `flow_packets_per_sec`) and protocol flag features (`syn_flag_count`, `rst_flag_count`) are the most discriminative for attack classification. This aligns with domain knowledge: volumetric attacks are characterized by extreme throughput values, while protocol-level attacks (SYN Flood, Port Scan) are distinguished by abnormal flag patterns.

Figure 4.3: Feature Importance Rankings
[Insert Screenshot Here]

Figure 4.4: Training Data Distribution (Pie Chart)
[Insert Screenshot Here]

## 4.5 Dashboard Screenshots and Analysis

### 4.5.1 Main Dashboard â€” Network Risk Intelligence

The main dashboard provides a comprehensive overview of the system's security posture. The four stat cards at the top display: (1) Protection Status (YES/NO based on open alerts), (2) Open Alert Count, (3) Threats detected in the last 24 hours, and (4) Average Response Time from detection to triage.

Below the stat cards, a dual-axis line chart displays the 24-hour attack activity timeline, comparing detected threats (red line) against mitigated threats (green line). This visualization allows security analysts to quickly assess whether the mitigation rate is keeping pace with detection. Adjacent to the timeline, a horizontal bar chart shows the threat distribution by attack type, color-coded by severity.

The lower section features a Recent Threats feed displaying the five most recent non-normal alerts with source IP, action taken, and relative timestamp, alongside a Monitored Sites panel showing Safe Zone-registered URLs with their health indicators.

Figure 4.5: VAULTO Dashboard â€” Network Risk Intelligence
[Insert Screenshot Here]

Figure 4.6: Attack Activity Timeline (24-Hour View)
[Insert Screenshot Here]

### 4.5.2 Dashboard Observation

During testing, the dashboard accurately reflected all prediction and alert activities in real time. The 30-second auto-refresh interval ensured that new threats appeared promptly without requiring manual page reloads. The stat cards correctly toggled the protection status based on the presence of open alerts, and the average response time metric accurately calculated the mean duration between alert creation and triage action.

## 4.6 Prediction Module Output

### 4.6.1 Single Model Prediction

The Prediction Console accepts 20 input features and classifies the traffic using the selected model. Pre-loaded sample attack vectors allow quick testing of each attack type. The result panel displays: the detected attack class, confidence percentage, severity badge, model used, and AI-generated recommendation for the appropriate response.

Figure 4.7: Prediction Console â€” Traffic Classification
[Insert Screenshot Here]

### 4.6.2 Multi-Model Comparison

The "Compare All" function submits the same feature vector to all five models simultaneously, displaying the results in a comparison table. This feature allows analysts to assess prediction consensus â€” when all five models agree on the attack class, confidence in the classification is highest. Discrepancies between models indicate borderline cases that may warrant additional investigation.

Figure 4.8: Multi-Model Comparison Output
[Insert Screenshot Here]

### 4.6.3 Prediction Observations

Testing with the pre-loaded sample attack vectors confirmed that all five models correctly classified each of the 11 attack types with high confidence. XGBoost consistently produced the highest confidence scores, typically exceeding 99%, while KNN occasionally showed marginally lower confidence values for attack types with closely overlapping feature distributions (e.g., Brute Force vs. Dictionary Attack).

## 4.7 Alerts and Prevention Engine Output

### 4.7.1 Alerts Dashboard

The Alerts page displays threat events as individual cards with severity indicators, action badges, source IP, confidence, and triage controls. The filter system allows rapid narrowing by status, severity, and trigger source. During testing, alerts generated from both the Prediction Console (manual trigger) and the Safe Zone module (safezone trigger) appeared correctly and were successfully triaged.

Figure 4.9: Alerts Dashboard with Triage Controls
[Insert Screenshot Here]

### 4.7.2 Prevention Engine Rules

The Prevention Engine page displays all 11 rules in a structured table with expandable detail rows. Each rule shows the attack type, severity, automated action, timeout duration, and an Active/Paused toggle. The expandable rows reveal the specific prevention actions that would be applied, such as "Account lockout after 5 fails" for Brute Force or "DNS sinkholing" for Botnet.

Figure 4.10: Prevention Engine Rules Table
[Insert Screenshot Here]

### 4.7.3 Prevention Action Statistics

Table 4.4: Prevention Action Statistics

| ACTION TYPE | DESCRIPTION | ENFORCEMENT LAYER |
|------------|-------------|----------------------|
| DROP_CONNECTION | Active connection termination | WAF Middleware (403 Forbidden) |
| RATE_LIMIT | Throttle source IP requests | WAF Middleware (429 Too Many Requests) |
| BLOCK_AND_LOG | Block and record forensic data | WAF Middleware (403 Forbidden) |
| QUARANTINE | Isolate infected host/network | WAF Middleware / Edge |
| FLAG_FOR_REVIEW | Escalate to human analyst | Database Logging only |
| ALLOW | Permit traffic (normal class) | Passthrough |

## 4.8 Safe Zone Module Output

The Safe Zone module was tested with various URL patterns to validate its threat detection capabilities:

- **Safe URL (e.g., https://google.com):** Risk Score 5/100, Risk Level LOW, Action ALLOW, no alerts generated.
- **Login Endpoint (e.g., https://unknown-site.com/login):** Risk Score 55â€“70/100, Risk Level MEDIUMâ€“HIGH, Action RATE_LIMIT, alert generated for Brute Force pattern.
- **SQL Injection Probe (e.g., https://test.com/page?id=1&q=select):** Risk Score 70â€“85/100, Risk Level HIGH, Action BLOCK_AND_LOG, alert generated for SQL Injection pattern.

The auto-monitor feature successfully re-scanned all registered sites at 30-second intervals, creating new alerts when threat indicators were detected on subsequent scans.

Figure 4.11: Safe Zone â€” URL Risk Scanner Output
[Insert Screenshot Here]

## 4.9 DEV AI Assistant Output

DEV was tested with various cybersecurity queries to validate its response quality:

- **"What is DDoS?"** â€” DEV provided a comprehensive explanation of Distributed Denial-of-Service attacks, including attack mechanisms, real-world examples, and VAULTO-specific prevention capabilities.
- **"Current threats"** â€” DEV referenced the live alert context injected into its system prompt, summarizing the number of open alerts, severity distribution, and recent threat events.
- **"How safe am I?"** â€” DEV assessed the current security posture based on alert statistics and provided targeted recommendations.

The simulated streaming effect in the frontend created a natural conversation experience, with responses appearing character-by-character.

Figure 4.12: DEV AI Chat Assistant Interface
[Insert Screenshot Here]

## 4.10 Discussion of Results

The experimental results demonstrate that VAULTO successfully achieves its design objectives across all functional modules:

**ML Performance:** All five models achieved accuracy above 98.7%, with the top model (XGBoost) reaching 99.78%. This performance level is consistent with or exceeds results reported in contemporary IDS literature for the CICIDS2017 dataset family. The high accuracy is attributed to the careful feature engineering pipeline (28 features), log transformation of skewed distributions, and systematic hyperparameter tuning. The improvement from 94.2% to 99.78% after optimization validates the importance of derived features and data preprocessing in network traffic classification.

**Multi-Model Consensus:** The inclusion of five distinct algorithms provides a consensus mechanism that increases classification reliability. During testing, cases where all five models agreed on the attack class were almost always correctly classified, while inter-model disagreements flagged genuinely ambiguous traffic patterns that warranted additional scrutiny.

**Prevention Engine Effectiveness:** The confidence-based thresholding mechanism (75% threshold for automatic enforcement) successfully prevented false positive blocks. Low-confidence predictions were correctly escalated to FLAG_FOR_REVIEW status, demonstrating a balanced approach between automated response speed and accuracy.

**System Integration:** The three-tier microservice architecture proved robust and maintainable throughout development and testing. The decoupled design allowed independent iteration on the ML models, backend logic, and frontend UI without cascading deployment issues. The PowerShell startup script provided a single-command launch mechanism for the entire stack.

**User Experience:** The glassmorphism-styled React.js dashboard provided an intuitive, visually cohesive interface for interacting with all system capabilities. The 30-second auto-refresh on the Dashboard and Alerts pages ensured real-time awareness without excessive API calls.

Figure 4.13: Before vs After Optimization Metrics
[Insert Screenshot Here]

---

# CHAPTER 5: CONCLUSION

## 5.1 Conclusion

This project successfully designed, developed, and deployed VAULTO â€” an Intelligent Cybersecurity Attack Prediction and Prevention System that integrates machine learning-based threat classification with automated response capabilities. The system demonstrates that a comprehensive, end-to-end cybersecurity platform can be built using modern open-source technologies and deployed to cloud infrastructure at a production-ready quality level.

The ML engine, featuring five distinct classification algorithms trained on a 28-feature pipeline with 110,000 samples across 11 traffic classes, achieved a peak accuracy of 99.78% (XGBoost) with consistently high precision, recall, and F1-scores across all models. The automated Prevention Engine successfully maps each detected attack type to context-appropriate countermeasures, while the confidence-based thresholding mechanism ensures that low-confidence predictions are escalated to human analysts rather than triggering automatic enforcement.

The VAULTO dashboard provides security analysts with a unified interface for real-time monitoring, manual prediction, model benchmarking, alert triage, URL-based threat scanning, and AI-assisted security guidance. The microservice architecture ensures modularity, independent scalability, and clear separation of concerns â€” qualities essential for production cybersecurity infrastructure.

## 5.2 Key Contributions

The key contributions of this project are:

1. **Multi-Model Benchmarking Framework:** A unified training, evaluation, and serving pipeline for five ML algorithms (XGBoost, Random Forest, SVM, KNN, MLP) on the same dataset and preprocessing pipeline, enabling direct comparative analysis.

2. **28-Feature Engineering Pipeline:** A comprehensive feature set combining 20 base network telemetry features with 8 derived statistical features, enhanced by log transformation and standard scaling, achieving 5.58% accuracy improvement over baseline.

3. **Active Intrusion Prevention System (IPS):** An integrated WAF middleware and stateful tracking engine (Three Strikes Rule) that actively drops malicious connections and rate-limits suspicious IPs in real-time.

4. **Integrated Security Dashboard:** A production-quality React.js SPA providing seven functional pages for complete cybersecurity operations workflow â€” from detection through triage to resolution.

5. **Safe Zone URL Analyzer:** A URL-based threat assessment module with automated site monitoring, risk scoring, and alert escalation.

6. **DEV AI Assistant:** An LLM-powered chatbot providing contextual cybersecurity guidance with live alert context injection.

7. **Cloud-Native Deployment:** Demonstrated end-to-end production deployment across Vercel, Render, and MongoDB Atlas.

## 5.3 Limitations

Despite the strong results, several limitations should be acknowledged:

1. **Synthetic Dataset:** The use of synthetically generated data, while providing controlled class distributions, may not capture the full complexity and variability of real-world network traffic. The feature distributions, though modeled after CICIDS2017 patterns, are approximations that may not generalize to all production environments.

2. **No Live Packet Capture:** VAULTO does not currently integrate with live network interfaces for real-time packet capture. All analysis is performed on pre-extracted feature vectors, requiring an external tool to convert raw traffic into the expected feature format.

3. **Rule-Based Prevention:** The Prevention Engine uses static rule mappings rather than adaptive, context-learning prevention strategies. While effective for known attack patterns, the rules cannot automatically evolve in response to new threat behaviors.

4. **Single Dataset Evaluation:** All models were trained and evaluated on the same synthetic dataset. Cross-dataset validation (e.g., training on synthetic data and testing on CICIDS2017 or UNSW-NB15) was not performed, which limits claims about generalization capability.

5. **DEV Dependency:** The DEV assistant relies on an external LLM API (Cerebras), creating a dependency on third-party service availability and introducing potential latency in responses.

## 5.4 Future Scope

The following enhancements are planned or envisioned for future iterations of VAULTO:

1. **Real-Time Packet Capture Integration:** Implement integration with packet capture tools (e.g., CICFlowMeter, tshark) to enable automatic feature extraction from live network interfaces, creating a fully autonomous detection pipeline.

2. **Deep Learning Models:** Incorporate Convolutional Neural Networks (CNNs) and Recurrent Neural Networks (RNNs/LSTMs) that can learn temporal patterns in sequential network traffic, potentially improving detection of slow, multi-stage attacks.

3. **Federated Learning:** Implement federated learning capabilities that allow multiple VAULTO instances to collaboratively improve model accuracy without sharing raw training data, addressing data privacy concerns in multi-organization deployments.

4. **Adaptive Prevention Engine:** Replace static prevention rules with a reinforcement learning-based engine that learns optimal response strategies from historical alert outcomes and analyst feedback.

5. **SIEM Integration:** Develop connectors for enterprise SIEM platforms (Splunk, QRadar, Elastic Security) to allow VAULTO to function as an ML-powered enrichment layer within existing security infrastructure.

6. **Mobile Application:** Build a companion mobile application for real-time alert notifications and triage actions, enabling security teams to respond to threats on the go.

7. **Threat Intelligence Feeds:** Integrate with public threat intelligence feeds (e.g., MITRE ATT&CK, VirusTotal, AbuseIPDB) to enrich predictions with external context and improve detection of known malicious indicators.

8. **Automated Reporting:** Implement scheduled and on-demand report generation for compliance documentation and security audit requirements.

---

# REFERENCES

[1] Chen, T. and Guestrin, C. (2016). "XGBoost: A Scalable Tree Boosting System." Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, pp. 785â€“794.

[2] Sharafaldin, I., Lashkari, A.H. and Ghorbani, A.A. (2018). "Toward Generating a New Intrusion Detection Dataset and Intrusion Traffic Characterization." Proceedings of the 4th International Conference on Information Systems Security and Privacy (ICISSP), pp. 108â€“116.

[3] Breiman, L. (2001). "Random Forests." Machine Learning, Vol. 45, No. 1, pp. 5â€“32.

[4] Pedregosa, F. et al. (2011). "Scikit-learn: Machine Learning in Python." Journal of Machine Learning Research, Vol. 12, pp. 2825â€“2830.

[5] Verizon (2023). "Data Breach Investigations Report (DBIR)." Verizon Enterprise Solutions.

[6] Cisco Systems (2023). "Cisco Annual Cybersecurity Report." Cisco Systems, Inc.

[7] OWASP Foundation (2021). "OWASP Top Ten â€” 2021." Available at: https://owasp.org/www-project-top-ten/

[8] Mukherjee, S. and Sharma, N. (2012). "Intrusion Detection using Naive Bayes Classifier with Feature Reduction." Procedia Technology, Vol. 4, pp. 119â€“128.

[9] Tang, T.A. et al. (2016). "Deep Learning Approach for Network Intrusion Detection in Software Defined Networking." Proceedings of the International Conference on Wireless Networks and Mobile Communications (WINCOM), pp. 258â€“263.

[10] Stein, G., Chen, B., Wu, A.S. and Hua, K.A. (2005). "Decision Tree Classifier for Network Intrusion Detection with GA-based Feature Selection." Proceedings of the 43rd ACM Southeast Conference, pp. 136â€“141.

[11] Chawla, N.V. et al. (2002). "SMOTE: Synthetic Minority Over-sampling Technique." Journal of Artificial Intelligence Research, Vol. 16, pp. 321â€“357.

[12] Moustafa, N. and Slay, J. (2015). "UNSW-NB15: A Comprehensive Dataset for Network Intrusion Detection Systems." Military Communications and Information Systems Conference (MilCIS), pp. 1â€“6.

[13] Roesch, M. (1999). "Snort â€” Lightweight Intrusion Detection for Networks." Proceedings of the 13th USENIX Conference on System Administration (LISA), pp. 229â€“238.

[14] Paxson, V. (1999). "Bro: A System for Detecting Network Intruders in Real-Time." Computer Networks, Vol. 31, No. 23â€“24, pp. 2435â€“2463.

[15] Express.js Foundation (2024). "Express.js â€” Fast, Unopinionated, Minimalist Web Framework for Node.js." Available at: https://expressjs.com/

[16] Meta Platforms (2024). "React â€” A JavaScript Library for Building User Interfaces." Available at: https://react.dev/

[17] MongoDB, Inc. (2024). "MongoDB Atlas â€” Cloud Database Service." Available at: https://www.mongodb.com/atlas

[18] Pallets Projects (2024). "Flask â€” Web Development, One Drop at a Time." Available at: https://flask.palletsprojects.com/

[19] Vercel Inc. (2024). "Vercel â€” Develop. Preview. Ship." Available at: https://vercel.com/

[20] Render (2024). "Render â€” Cloud Application Hosting for Developers." Available at: https://render.com/

---

# ANNEXURES

## Annexure A: Project Directory Structure

```
VAULTO_PREDICTION_MODEL/
├── backend/                         # Node.js Express Backend API
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   ├── models/
│   │   ├── Alert.js                 # Alert schema (Mongoose)
│   │   ├── ApiKey.js                # API Key schema
│   │   ├── MonitoredSite.js         # Safe Zone monitored site schema
│   │   ├── Prediction.js            # Prediction history schema
│   │   └── User.js                  # User schema with bcrypt
│   ├── routes/
│   │   ├── ai-agent.js              # DEV LLM integration
│   │   ├── alerts.js                # Alert CRUD + analysis
│   │   ├── auth.js                  # Register/Login/Me
│   │   ├── predict.js               # ML prediction proxy
│   │   └── safezone.js              # URL scanner + monitor
│   ├── services/
│   │   └── preventionEngine.js      # Rule-based prevention logic
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   └── Procfile                     # Render deployment
├── frontend/                        # React.js + Vite Dashboard
│   ├── src/
│   │   ├── api/
│   │   │   ├── agent.js             # DEV API calls
│   │   │   ├── alerts.js            # Alert API calls
│   │   │   └── safezone.js          # Safe Zone API calls
│   │   ├── components/
│   │   │   ├── DEVChat.jsx         # AI chat floating widget
│   │   │   ├── AlertsBadge.jsx      # Notification badge
│   │   │   ├── Header.jsx           # Top bar
│   │   │   ├── Navbar.jsx           # Navigation
│   │   │   ├── PreventionPanel.jsx  # Inline prevention display
│   │   │   └── Sidebar.jsx          # Side navigation
│   │   ├── pages/
│   │   │   ├── AlertsPage.jsx       # SOC alert feed
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── History.jsx          # Prediction logs
│   │   │   ├── Login.jsx            # Authentication
│   │   │   ├── Models.jsx           # Model benchmarking
│   │   │   ├── Predict.jsx          # Prediction console
│   │   │   ├── PreventionPage.jsx   # Prevention rules
│   │   │   └── SafeZone.jsx         # URL scanner
│   │   ├── services/
│   │   │   └── api.js               # Base API service
│   │   ├── App.jsx                  # Root component + routing
│   │   ├── main.jsx                 # Vite entry point
│   │   └── index.css                # Global styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── ml/                              # Python ML Microservice
│   ├── data/
│   │   └── vaulto_dataset.csv       # Generated dataset (110K samples)
│   ├── models/
│   │   ├── Random_Forest.joblib     # Trained model artifacts
│   │   ├── XGBoost.joblib
│   │   ├── SVM.joblib
│   │   ├── KNN.joblib
│   │   ├── MLP.joblib
│   │   ├── scaler.joblib            # StandardScaler
│   │   ├── feature_names.joblib     # Feature name list
│   │   ├── labels.json              # Class label mapping
│   │   └── metrics.json             # Performance metrics
│   ├── app.py                       # Flask API server
│   ├── train_models.py              # Training pipeline
│   ├── generate_dataset.py          # Synthetic data generator
│   ├── requirements.txt
│   └── Procfile                     # Render deployment
├── viper.ps1                        # Multi-service launcher
├── STARTUP_GUIDE.md
└── README.md
```

## Annexure B: API Endpoint Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | System health check |
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login (returns JWT) |
| GET | /api/auth/me | Get current user profile |
| POST | /api/predict | Single model prediction |
| POST | /api/predict/all | Multi-model comparison |
| GET | /api/predict/history | Prediction history |
| GET | /api/predict/models | Model info + metrics |
| GET | /api/predict/features | Feature name list |
| POST | /api/analyze | Full threat analysis |
| GET | /api/alerts | List alerts (filtered) |
| GET | /api/alerts/stats | Alert statistics |
| PATCH | /api/alerts/:id/triage | Update alert status |
| DELETE | /api/alerts/:id | Delete alert |
| POST | /api/safezone/analyze | URL threat scan |
| GET | /api/safezone/sites | List monitored sites |
| DELETE | /api/safezone/sites/:id | Remove monitored site |
| POST | /api/safezone/monitor/start | Start auto-monitor |
| POST | /api/safezone/monitor/stop | Stop auto-monitor |
| POST | /api/agent/chat | DEV AI chat |

## Annexure C: Sample Prediction Input/Output

**Input (DDoS Attack Features):**
```
[15832478.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.13,
 15800000.0, 15800000.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
 1.0, 0.0, 0.0]
```

**Output:**
```json
{
  "prediction": 4,
  "attack_name": "DDoS",
  "confidence": 99.87,
  "severity": {
    "level": "Critical",
    "color": "#ef4444",
    "score": 10
  },
  "recommendation": "Activate DDoS mitigation service, scale infrastructure, implement traffic filtering, contact ISP for upstream filtering.",
  "model_used": "XGBoost"
}
```

## Annexure D: Prevention Engine Response Example

```json
{
  "attack_class": 4,
  "attack_label": "DDoS",
  "action": "DROP_CONNECTION",
  "timeout": 7200,
  "severity": "critical",
  "prevention_actions": [
    "CDN/DDoS mitigation activation",
    "Traffic scrubbing at edge",
    "Auto-scaling infrastructure",
    "GeoIP blocking"
  ],
  "reason": "Distributed attack indicators detected. Edge mitigation and connection dropping are applied to reduce blast radius.",
  "ip": "192.168.1.100",
  "confidence": 0.9987
}
```


## Annexure E: Hardware & Software Requirements

**Hardware Requirements:**
- Processor: Intel Core i5 / AMD Ryzen 5 or higher
- RAM: Minimum 8 GB (16 GB recommended for ML training)
- Storage: 256 GB SSD (for fast data I/O)
- Network: Active internet connection for API services

**Software Requirements:**
- Operating System: Windows 10/11, macOS, or Linux (Ubuntu 20.04+)
- Environment: Node.js (v18+), Python (3.9+)
- Database: MongoDB Atlas (Cloud)
- Key Libraries: 
  - Frontend: React 18, Vite, Tailwind CSS, Recharts
  - Backend: Express.js, Mongoose
  - ML Microservice: Flask, Scikit-Learn, XGBoost, Pandas, NumPy

## Annexure F: ML Model Hyperparameters

The following configuration was used during the final training phase for the top-performing models:

**1. XGBoost (Accuracy: 99.78%)**
- `n_estimators`: 800
- `learning_rate`: 0.05
- `max_depth`: 8
- `subsample`: 0.8
- `colsample_bytree`: 0.8
- `tree_method`: 'hist' (for fast histogram optimization)

**2. Random Forest (Accuracy: 99.76%)**
- `n_estimators`: 800 (trained in batches of 100 via warm start)
- `max_depth`: 25
- `min_samples_split`: 5
- `n_jobs`: -1 (utilizing all CPU cores)

**3. Multi-Layer Perceptron (Accuracy: 99.60%)**
- `hidden_layer_sizes`: (128, 64, 32)
- `activation`: 'relu'
- `solver`: 'adam'
- `alpha`: 0.0001
- `early_stopping`: True


## Annexure G: Core Implementation Snippets

**G.1 Simplified ML Training Logic (Python)**
```python
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
import joblib

# 1. Load Dataset
data = pd.read_csv('vaulto_dataset.csv')
X = data.drop('label', axis=1)
y = data['label']

# 2. Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 3. Initialize and Train Model
model = XGBClassifier(n_estimators=100, learning_rate=0.05)
model.fit(X_train, y_train)

# 4. Evaluate Model Accuracy
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy * 100}%")

# 5. Save Trained Model
joblib.dump(model, 'XGBoost.joblib')
```

**G.2 Simplified Prediction API (Flask)**
```python
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load('models/XGBoost.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    # 1. Receive traffic features from the dashboard
    data = request.json
    features = np.array([data['features']])
    
    # 2. Predict the attack class
    prediction = model.predict(features)[0]
    
    # 3. Calculate model confidence
    probabilities = model.predict_proba(features)[0]
    confidence = max(probabilities) * 100
    
    # 4. Return result
    return jsonify({
        "attack_class": int(prediction),
        "confidence": confidence
    })

if __name__ == '__main__':
    app.run(port=5000)
```

**G.3 Simplified Prevention Engine (Node.js)**
```javascript
// A simple mapping of attack classes to mitigation actions
const PREVENTION_RULES = {
  0: { action: "ALLOW", severity: "None" },
  1: { action: "RATE_LIMIT", severity: "High" },
  4: { action: "DROP_CONNECTION", severity: "Critical" }, // DDoS
  7: { action: "BLOCK_AND_LOG", severity: "Critical" }    // SQL Injection
};

function determineAction(attackClass, confidence) {
  const rule = PREVENTION_RULES[attackClass] || PREVENTION_RULES[0];

  // If model is unsure, flag it for a human analyst
  if (confidence < 0.75 && attackClass !== 0) {
    return {
      action: "FLAG_FOR_REVIEW",
      severity: rule.severity,
      message: "Low confidence. Sent to SOC analyst for manual review."
    };
  }

  // Otherwise, automatically apply the mitigation action
  return {
    action: rule.action,
    severity: rule.severity,
    message: "High confidence. Auto-mitigation applied."
  };
}

module.exports = { determineAction };
```
