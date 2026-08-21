import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../components/ui';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { AnswerOptions } from '../components/quiz/AnswerOptions';
import { TimerBar } from '../components/quiz/TimerBar';
import { ExplanationPanel } from '../components/quiz/ExplanationPanel';
import { XpBar, StreakFlame } from '../components/gamification/XpBar';
import { LevelUpModal } from '../components/gamification/LevelUpModal';
import { BadgeToast } from '../components/gamification/BadgeToast';
import { ItalianGreyhound } from '../components/gamification/ItalianGreyhound';
import { useQuiz } from '../hooks/useQuiz';
import { useProgressContext } from '../contexts/ProgressContext';
import { apiService } from '../lib/api';
import {
  calculateQuestionPoints,
  evaluateBadges,
  xpForNextLevel,
} from '../lib/gamification';
import { playCorrect, playWrong, playLevelUp, playBadge, playComplete } from '../lib/sounds';
import { recordActivity } from '../lib/dailyStreak';
import { getDifficulty } from '../lib/difficulty';

export function Quiz({ testId, onFinish, onExit }) {
  const { progress, saveProgress, achievements, timerEnabled } = useProgressContext();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [earnedXp, setEarnedXp] = useState(0);
  const [newBadges, setNewBadges] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [showGreyhound, setShowGreyhound] = useState(false);
  const hasFinishedRef = useRef(false);
  const greyhoundTimeoutRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = testId === 'general'
          ? await apiService.getGeneralTest(getDifficulty())
          : await apiService.getTest(testId);
        setTest(data);
      } catch (err) {
        console.error('Failed to load test:', err);
      } finally {
        setLoading(false);
      }
    };
    load();

    return () => {
      if (greyhoundTimeoutRef.current) clearTimeout(greyhoundTimeoutRef.current);
    };
  }, [testId]);

  const handleFinish = useCallback((session, points, runningBadges) => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    const totalCorrect = session.answers.filter((a) => a.isCorrect).length;
    const totalAnswered = session.totalQuestions;

    const currentStreak = progress.streak;
    const lastAnswerCorrect = session.answers[session.answers.length - 1]?.isCorrect || false;
    const newStreak = lastAnswerCorrect ? currentStreak + session.sessionStreak : 0;
    const newBestStreak = Math.max(progress.bestStreak, newStreak, session.sessionStreak);

    const completedTests = progress.completedTests.includes(testId)
      ? progress.completedTests
      : [...progress.completedTests, testId];

    const prevStat = progress.statsByTest[testId] || { bestScore: 0, attempts: 0 };
    const statsByTest = {
      ...progress.statsByTest,
      [testId]: {
        bestScore: Math.max(prevStat.bestScore, totalCorrect),
        attempts: prevStat.attempts + 1,
        lastAttemptAt: new Date().toISOString(),
      },
    };

    const activity = recordActivity(progress);
    const totalEarnedXp = points + activity.bonusXp;

    const newXp = progress.xp + totalEarnedXp;
    let newLevel = progress.level;
    let leveledUpTo = null;
    while (newXp >= xpForNextLevel(newLevel)) {
      newLevel += 1;
      leveledUpTo = newLevel;
    }

    const updatedQuestionStats = { ...progress.questionStats };
    session.answers.forEach((answer) => {
      const existing = updatedQuestionStats[answer.questionId] || { seen: 0, correct: 0 };
      updatedQuestionStats[answer.questionId] = {
        seen: existing.seen + 1,
        correct: existing.correct + (answer.isCorrect ? 1 : 0),
        lastCorrect: answer.isCorrect,
        lastSeenAt: new Date().toISOString(),
      };
    });

    const finalProgress = {
      ...progress,
      xp: newXp,
      level: newLevel,
      totalCorrect: progress.totalCorrect + totalCorrect,
      totalAnswered: progress.totalAnswered + totalAnswered,
      streak: newStreak,
      bestStreak: newBestStreak,
      completedTests,
      statsByTest,
      questionStats: updatedQuestionStats,
      lastVisitDate: activity.lastVisitDate,
      activityDates: activity.activityDates,
      dailyStreak: activity.dailyStreak,
      bestDailyStreak: activity.bestDailyStreak,
    };

    // Evaluate badges one final time with final progress (for level-based badges)
    const finalBadges = evaluateBadges({
      session,
      progress: finalProgress,
      newBadges: runningBadges,
    });
    const allNewBadges = [...new Set([...runningBadges, ...finalBadges])];
    const newlyUnlocked = allNewBadges.filter((id) => !progress.badges.includes(id));

    finalProgress.badges = [...new Set([...progress.badges, ...allNewBadges])];

    if (leveledUpTo) {
      setLevelUpLevel(leveledUpTo);
      setShowLevelUp(true);
      playLevelUp();
    } else if (newlyUnlocked.length > 0) {
      playBadge();
    } else {
      playComplete();
    }

    if (newlyUnlocked.length > 0) {
      setNewBadges(allNewBadges);
      setBadgeQueue((prev) => [...prev, ...newlyUnlocked.filter((id) => !runningBadges.includes(id))]);
    }

    saveProgress(finalProgress).then(() => {
      onFinish({
        test,
        score: totalCorrect,
        totalQuestions: totalAnswered,
        earnedXp: totalEarnedXp,
        dailyStreak: activity.dailyStreak,
        streakExtended: activity.streakExtended,
        streakBonusXp: activity.bonusXp,
        newBadges: allNewBadges,
        leveledUpTo,
      });
    });
  }, [progress, testId, saveProgress, onFinish, test]);

  const quiz = useQuiz(test || { timeLimitSeconds: 15, questions: [] }, { timerEnabled });

  useEffect(() => {
    if (!test) return;
    if (quiz.status !== 'finished') return;
    if (hasFinishedRef.current) return;

    handleFinish(
      {
        answers: quiz.answers,
        sessionStreak: quiz.sessionStreak,
        totalQuestions: quiz.totalQuestions,
      },
      earnedXp,
      newBadges
    );
  }, [quiz.status, test, earnedXp, newBadges, handleFinish]);

  const handleAnswer = useCallback((optionId) => {
    if (quiz.status !== 'answering') return;

    quiz.submitAnswer(optionId);

    const question = quiz.currentQuestion;
    const isCorrect = optionId === question.correctOptionId;
    const newSessionStreak = isCorrect ? quiz.sessionStreak + 1 : 0;

    const points = calculateQuestionPoints({
      isCorrect,
      difficulty: test.difficulty,
      streak: newSessionStreak,
      timeRemainingMs: quiz.timeRemainingMs,
      timeLimitMs: quiz.timeLimitMs,
      timerEnabled,
    });

    if (isCorrect) {
      setEarnedXp((prev) => prev + points);
      playCorrect();
      setShowGreyhound(true);
      if (greyhoundTimeoutRef.current) clearTimeout(greyhoundTimeoutRef.current);
      greyhoundTimeoutRef.current = setTimeout(() => setShowGreyhound(false), 3000);
    } else {
      playWrong();
    }

    const sessionSnapshot = {
      answers: [
        ...quiz.answers,
        {
          questionId: question.id,
          selectedOptionId: optionId,
          isCorrect,
          timeSpentMs: quiz.timeLimitMs - quiz.timeRemainingMs,
          speedBonus: timerEnabled && points > 0 && quiz.timeRemainingMs / quiz.timeLimitMs > 0.4 ? 1 : 0,
        },
      ],
      sessionStreak: newSessionStreak,
      totalQuestions: quiz.totalQuestions,
    };

    const justEarned = evaluateBadges({
      session: sessionSnapshot,
      progress,
      newBadges,
    });

    const newlyUnlocked = justEarned.filter((id) => !progress.badges.includes(id) && !newBadges.includes(id));
    if (newlyUnlocked.length > 0) {
      setNewBadges((prev) => [...prev, ...newlyUnlocked]);
      setBadgeQueue((prev) => [...prev, ...newlyUnlocked]);
      playBadge();
    }
  }, [quiz, test, progress, newBadges]);

  const handleTick = useCallback((updater) => {
    quiz.tick(updater);
  }, [quiz]);

  const handleTimeUp = useCallback(() => {
    if (quiz.status === 'answering') {
      quiz.timeUp();
    }
  }, [quiz]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3 animate-bounce">📖</div>
        <p className="text-muted">Загрузка теста...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Тест не найден.</p>
        <Button onClick={onExit} variant="secondary" className="mt-4">Назад</Button>
      </div>
    );
  }

  const isAnswered = quiz.status === 'answered';
  // answers accumulates across questions; only the just-answered one is "current"
  const currentAnswer = isAnswered ? quiz.answers[quiz.answers.length - 1] : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onExit} className="!px-3">
          <X size={20} />
        </Button>
        <div className="flex items-center gap-3">
          <XpBar value={earnedXp} label={`+${earnedXp} XP`} />
          <StreakFlame streak={quiz.sessionStreak} />
        </div>
      </div>

      {timerEnabled && (
        <TimerBar
          timeRemainingMs={quiz.timeRemainingMs}
          timeLimitMs={quiz.timeLimitMs}
          status={quiz.status}
          onTick={handleTick}
          onTimeUp={handleTimeUp}
        />
      )}

      <QuestionCard
        question={quiz.currentQuestion}
        index={quiz.currentQuestionIndex}
        total={quiz.totalQuestions}
      />

      <AnswerOptions
        questionId={quiz.currentQuestion.id}
        options={quiz.currentQuestion.options}
        selectedOptionId={currentAnswer?.selectedOptionId}
        correctOptionId={quiz.currentQuestion.correctOptionId}
        status={quiz.status}
        onSelect={handleAnswer}
      />

      <AnimatePresence>
        {isAnswered && (
          <ExplanationPanel
            question={quiz.currentQuestion}
            isCorrect={currentAnswer.isCorrect}
            onContinue={quiz.nextQuestion}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLevelUp && (
          <LevelUpModal level={levelUpLevel} onClose={() => setShowLevelUp(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {badgeQueue.map((badgeId, index) => {
          const badge = achievements.find((b) => b.id === badgeId);
          if (!badge) return null;
          return (
            <BadgeToast
              key={`${badgeId}-${index}`}
              badge={badge}
              onClose={() => setBadgeQueue((prev) => prev.filter((_, i) => i !== index))}
            />
          );
        })}
      </AnimatePresence>

      <ItalianGreyhound
        show={showGreyhound}
        onDismiss={() => {
          clearTimeout(greyhoundTimeoutRef.current);
          setShowGreyhound(false);
        }}
      />
    </motion.div>
  );
}
