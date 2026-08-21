import { useState, useRef, useEffect } from "react";
import { analyzeText } from "../api";

const MAX_LENGTH = 5000;

function AnalysisForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resultsRef = useRef(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [result]);

  const calculateConfidenceMargin = (scores) => {
    if (!scores) return 0;
    // Sort scores in descending order
    const sorted = Object.values(scores).sort((a, b) => b - a);
    // Calculate margin between highest and second highest score
    const top = sorted[0] || 0;
    const second = sorted[1] || 0;
    return top - second;
  };

  const confidence = result ? calculateConfidenceMargin(result.scores) : 0;

  // Calculates the highest raw percentage score (e.g., Positive: 67.99%)
  const maxScore = result
    ? Math.max(...Object.values(result.scores))
    : 0;

  
  const confidenceLabel =
    confidence >= 80
      ? "High confidence"
      : confidence >= 60
        ? "Moderate confidence"
        : "Low confidence";

  const handleChange = (event) => {
    setText(event.target.value);
    if (error) setError("");
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeText(text.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-card">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <label htmlFor="text-input">Enter your text</label>
          <span>{text.length} / {MAX_LENGTH}</span>
        </div>

        <textarea
          id="text-input"
          value={text}
          onChange={handleChange}
          maxLength={MAX_LENGTH}
          placeholder="Write or paste something you'd like to analyze..."
          rows="9"
        />

        <div className="form-footer">
          <button
            type="button"
            className="button button-secondary"
            onClick={handleClear}
            disabled={!text && !result}
          >
            Clear
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={loading || !text.trim()}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </form>

      <div className="sample-section">
        <span>Try a sample</span>
        <div className="sample-buttons">
          <button
            type="button"
            onClick={() => setText("I absolutely love this product. It exceeded my expectations!")}
          >
            Positive
          </button>
          <button
            type="button"
            onClick={() => setText("The service was terrible and I am very disappointed.")}
          >
            Negative
          </button>
          <button
            type="button"
            onClick={() => setText("The product works as expected. Nothing special.")}
          >
            Neutral
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="result-card" ref={resultsRef}>

          {/* Result Summary */}
          <div className={`result-summary ${result.sentiment}`}>
            <div className="result-summary-top">
              <div>
                <span className="result-label">ANALYSIS RESULT</span>

                <h2>
                  {result.sentiment} Sentiment
                </h2>

                <span className="confidence-text">
                  Confidence: {confidence.toFixed(2)}%
                </span>
              </div>

              <div
                className="result-status"
                style={{
                  background:
                    result.sentiment === "positive"
                      ? "#dcfce7"
                      : result.sentiment === "negative"
                      ? "#fee2e2"
                      : "#f5f5f5",
                  color:
                    result.sentiment === "positive"
                      ? "#16a34a"
                      : result.sentiment === "negative"
                      ? "#dc2626"
                      : "#525252",
                }}
              >
                ●
              </div>
            </div>

            <div className="analyzed-text">
              <span>Analyzed Text</span>

              <p>
                {result.text}
              </p>
            </div>
          </div>


          {/* Result Metrics */}
          <div className="result-grid">

            {/* Donut Chart */}
            <div className="result-panel">
              <div className="panel-heading">
                <span className="panel-icon">◉</span>
                <span>Sentiment Distribution</span>
              </div>

              <div className="donut-wrapper">
                <div
                  className="sentiment-donut"
                  style={{
                    background: `conic-gradient(
                      #22c55e 0% ${result.scores.positive}%,
                      #ef4444 ${result.scores.positive}% ${
                        result.scores.positive + result.scores.negative
                      }%,
                      #737373 ${
                        result.scores.positive + result.scores.negative
                      }% 100%
                    )`,
                  }}
                >
                  <div className="donut-center">
                    <strong>{maxScore.toFixed(1)}%</strong>
                    <span>{result.sentiment}</span>
                  </div>
                </div>
              </div>

              <div className="score-list">
                <div className="score-item positive">
                  <span>
                    <i></i>
                    Positive
                  </span>

                  <strong>{result.scores.positive}%</strong>
                </div>

                <div className="score-item negative">
                  <span>
                    <i></i>
                    Negative
                  </span>

                  <strong>{result.scores.negative}%</strong>
                </div>

                <div className="score-item neutral">
                  <span>
                    <i></i>
                    Neutral
                  </span>

                  <strong>{result.scores.neutral}%</strong>
                </div>
              </div>
            </div>


            {/* Confidence */}
            <div className="result-panel confidence-panel">
              <div className="panel-heading">
                <span className="panel-icon">✦</span>
                <span>Model Confidence</span>
              </div>

              <div className="confidence-value">
                <strong>{confidence.toFixed(2)}%</strong>

                <span>{confidenceLabel}</span>
              </div>

              <div className="confidence-track">
                <div
                  className="confidence-fill"
                  style={{
                    width: `${confidence}%`,
                  }}
                ></div>
              </div>

              <p className="confidence-description">
                The model is {confidenceLabel.toLowerCase()} in its
                predicted sentiment based on the text provided.
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default AnalysisForm;