import { useEffect, useState } from "react";
import { deleteAnalysis, getAnalyses } from "../api";

function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const data = await getAnalyses();
        if (active) setAnalyses(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAnalysis(id);
      setAnalyses((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="history-page">
      <div className="page-heading">
        <span className="eyebrow">YOUR ANALYSES</span>
        <h1>Analysis History</h1>
        <p>Review your previous sentiment analyses.</p>
      </div>

      {loading && (
        <div className="empty-state">
          <p>Loading history...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && analyses.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">↺</div>
          <h2>No analyses yet</h2>
          <p>
            Analyze your first piece of text and your results will appear here.
          </p>
        </div>
      )}

      {!loading && analyses.length > 0 && (
        <div className="history-list">
          {analyses.map((analysis) => (
            <article className="history-item" key={analysis.id}>
              <div className="history-content">
                <p className="history-text">{analysis.text}</p>
                <div className="history-meta">
                  <span className="history-sentiment">{analysis.sentiment}</span>
                  <span>{new Date(analysis.created_at).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                className="delete-button"
                onClick={() => handleDelete(analysis.id)}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default History;
