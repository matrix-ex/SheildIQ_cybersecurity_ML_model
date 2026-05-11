
import re

md_path = "VAULTO_Final_Report.md"

with open(md_path, "r", encoding="utf-8") as f:
    content = f.read()

correct_tree = """```
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
```"""

# Replace the corrupted block
# The block starts right after '## Annexure A: Project Directory Structure'
# and ends before '## Annexure B: API Endpoint Reference'

pattern = r"(## Annexure A: Project Directory Structure\n\n)```.*?```(\n\n## Annexure B)"

new_content = re.sub(pattern, r"\1" + correct_tree.replace('\\', '\\\\') + r"\2", content, flags=re.DOTALL)

with open(md_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Report fixed.")
