import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navigation } from './components/Navigation';
import { TypingTest } from './pages/TypingTest';
import { TestPage } from './pages/TestPage';
import { TestHome } from './pages/TestHome';
import { Home } from './pages/Home';
import { Practice } from './pages/Practice';
import { Learn } from './pages/Learn';
import { Progress } from './pages/Progress';
import { Leaderboard } from './pages/Leaderboard';
import { Settings } from './pages/Settings';
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1 container p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<TestHome />} />
              <Route path="/test/run" element={<TestPage />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:lessonId" element={<TypingTest />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
