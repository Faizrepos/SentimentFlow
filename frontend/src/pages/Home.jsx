import AnalysisForm from "../components/AnalysisForm";

function Home() {
  return (
    <section className="home-page">
      <div className="hero">
        <span className="eyebrow">AI SENTIMENT ANALYSIS</span>
        <h1>
          Understand what your
          <span> text feels like.</span>
        </h1>
        <p>
          Analyze text and discover whether the sentiment is positive,
          neutral, or negative.
        </p>
      </div>

      <AnalysisForm />
    </section>
  );
}

export default Home;
