from pathlib import Path
import re

import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS

from database import delete_analysis, get_analyses, get_analysis, save_analysis


app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

model = joblib.load(MODEL_DIR / "sentiment_model.pkl")
vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer.pkl")


def clean_text(text: str) -> str:
    return re.sub(r"[^a-zA-Z\s]", "", text).lower().strip()


def analyze_with_model(text: str) -> dict:
    cleaned_text = clean_text(text)
    features = vectorizer.transform([cleaned_text])

    if features.nnz == 0:
        scores = {"negative": 0.0, "neutral": 100.0, "positive": 0.0}
        return {"sentiment": "neutral", "scores": scores}

    probabilities = model.predict_proba(features)[0]
    prediction = model.predict(features)[0]

    scores = {
        label: round(float(probability) * 100, 2)
        for label, probability in zip(model.classes_, probabilities)
    }

    for label in ("negative", "neutral", "positive"):
        scores.setdefault(label, 0.0)

    return {"sentiment": str(prediction), "scores": scores}


@app.get("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "SentimentFlow API is running",
    })


@app.post("/api/analyze")
def analyze_text():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body is required."}), 400

    text = data.get("text", "")

    if not isinstance(text, str):
        return jsonify({"error": "Text must be a string."}), 400

    text = text.strip()

    if not text:
        return jsonify({"error": "Text is required."}), 400

    if len(text) > 5000:
        return jsonify({"error": "Text cannot exceed 5000 characters."}), 400

    result = analyze_with_model(text)
    scores = result["scores"]

    try:
        analysis_id = save_analysis(
            text=text,
            sentiment=result["sentiment"],
            positive_score=scores["positive"],
            negative_score=scores["negative"],
            neutral_score=scores["neutral"],
        )
    except Exception as exc:
        app.logger.exception("Database save failed")
        return jsonify({
            "error": "Analysis succeeded, but the result could not be saved. Check MySQL configuration.",
            "details": str(exc),
        }), 500

    return jsonify({
        "id": analysis_id,
        "text": text,
        "sentiment": result["sentiment"],
        "scores": scores,
    }), 201


@app.get("/api/analyses")
def analyses():
    try:
        return jsonify(get_analyses())
    except Exception as exc:
        app.logger.exception("Database history query failed")
        return jsonify({
            "error": "Unable to load analysis history. Check MySQL configuration.",
            "details": str(exc),
        }), 500


@app.get("/api/analyses/<int:analysis_id>")
def analysis(analysis_id: int):
    try:
        result = get_analysis(analysis_id)
    except Exception as exc:
        app.logger.exception("Database query failed")
        return jsonify({"error": str(exc)}), 500

    if not result:
        return jsonify({"error": "Analysis not found."}), 404

    return jsonify(result)


@app.delete("/api/analyses/<int:analysis_id>")
def remove_analysis(analysis_id: int):
    try:
        deleted = delete_analysis(analysis_id)
    except Exception as exc:
        app.logger.exception("Database delete failed")
        return jsonify({"error": str(exc)}), 500

    if not deleted:
        return jsonify({"error": "Analysis not found."}), 404

    return jsonify({"message": "Analysis deleted successfully."})


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"error": "Endpoint not found."}), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
