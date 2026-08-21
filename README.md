# SentimentFlow

A full-stack sentiment analysis web application that classifies text as **positive**, **negative**, or **neutral** using a machine learning model, with results stored and browsable through a history view.


## Features

- Real-time text sentiment classification with confidence scoring
- Visual sentiment breakdown via a donut chart (positive / negative / neutral distribution)
- One-click sample inputs for quick testing
- Full analysis history, backed by MySQL, with delete support
- Input validation (empty text, max length) with clear error handling on both client and server

## Tech Stack

**Frontend:** React (Vite), React Router
**Backend:** Flask, Flask-CORS
**Machine Learning:** scikit-learn (TF-IDF vectorization + Logistic Regression), joblib
**Database:** MySQL
**Server:** Gunicorn (production)

## How It Works

1. User submits text through the React frontend.
2. Flask backend cleans the input (strips non-alphabetic characters, lowercases) and transforms it using a saved TF-IDF vectorizer.
3. A pre-trained Logistic Regression model predicts sentiment probabilities across positive/negative/neutral classes.
4. The result — label plus per-class confidence scores — is returned to the frontend and saved to MySQL.
5. Users can revisit past analyses on the History page.

> **Note:** The ML model (`sentiment_model.pkl`, `tfidf_vectorizer.pkl`) was trained in an earlier iteration of this project and reused here; this version focuses on the full-stack application layer around it.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Analyze text sentiment (`{ "text": "..." }`) |
| GET | `/api/analyses` | List past analyses |
| GET | `/api/analyses/<id>` | Get a single analysis |
| DELETE | `/api/analyses/<id>` | Delete an analysis |

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env       # then fill in your MySQL credentials
mysql -u root -p < ../database/schema.sql
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default and expects the backend at `http://localhost:5000`.

## Project Structure
```text
SENTIMENTFLOW/
├── backend/
│   ├── models/
│   │   ├── sentiment_model.pkl
│   │   └── tfidf_vectorizer.pkl
│   ├── app.py
│   ├── database.py
│   └── requirements.txt
├── database/
│   └── schema.sql
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── AnalysisForm.jsx
│   │   ├── pages/
│   │   │   ├── History.jsx
│   │   │   └── Home.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

## Author
**Faiz Abdul Rahim** — [GitHub](https://github.com/Faizrepos) · [LinkedIn](https://www.linkedin.com/in/faizabdulrahim)