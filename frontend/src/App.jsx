import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressProvider, useProgressContext } from './contexts/ProgressContext';
import { AppShell } from './components/layout';
import { Home } from './views/Home';
import { TestList } from './views/TestList';
import { Quiz } from './views/Quiz';
import { Results } from './views/Results';
import { Profile } from './views/Profile';

const views = {
  home: 'home',
  tests: 'tests',
  quiz: 'quiz',
  results: 'results',
  profile: 'profile',
};

function AppContent() {
  const [view, setView] = useState(views.home);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const { loading } = useProgressContext();

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-bounce">🌸</div>
            <p className="text-muted">Загрузка...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const startTest = (testId) => {
    setSelectedTestId(testId);
    setView(views.quiz);
  };

  const finishTest = (result) => {
    setSessionResult(result);
    setView(views.results);
  };

  const goHome = () => setView(views.home);
  const goTests = () => setView(views.tests);
  const goProfile = () => setView(views.profile);

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {view === views.home && (
            <Home
              onStart={goTests}
              onProfile={goProfile}
            />
          )}
          {view === views.tests && (
            <TestList
              onSelect={startTest}
              onBack={goHome}
            />
          )}
          {view === views.quiz && (
            <Quiz
              testId={selectedTestId}
              onFinish={finishTest}
              onExit={goTests}
            />
          )}
          {view === views.results && (
            <Results
              result={sessionResult}
              onHome={goHome}
              onRetry={() => startTest(selectedTestId)}
              onTests={goTests}
            />
          )}
          {view === views.profile && (
            <Profile onBack={goHome} />
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}

function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}

export default App;
