import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="navbar">
          <Link to="/" className="logo">
            SentimentFlow
          </Link>

          <nav className="nav-links">
            <Link to="/" className="nav-link">
              Analyze
            </Link>
            <Link to="/history" className="nav-link">
              History
            </Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
