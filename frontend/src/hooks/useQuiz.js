import { useState, useCallback, useRef } from 'react';

export function useQuiz(test) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('answering'); // 'answering' | 'answered' | 'finished'
  const [timeRemainingMs, setTimeRemainingMs] = useState(test.timeLimitSeconds * 1000);
  const timeLimitMs = test.timeLimitSeconds * 1000;
  const answerStartTimeRef = useRef(Date.now());

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  const tick = useCallback((remaining) => {
    setTimeRemainingMs(remaining);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemainingMs(timeLimitMs);
    answerStartTimeRef.current = Date.now();
  }, [timeLimitMs]);

  const submitAnswer = useCallback((optionId) => {
    if (status !== 'answering') return;

    const question = currentQuestion;
    const isCorrect = optionId === question.correctOptionId;
    const timeSpentMs = timeLimitMs - timeRemainingMs;

    const answer = {
      questionId: question.id,
      selectedOptionId: optionId,
      isCorrect,
      timeSpentMs,
      speedBonus: 0,
    };

    setAnswers((prev) => [...prev, answer]);
    setSessionStreak((prev) => (isCorrect ? prev + 1 : 0));
    setScore((prev) => (isCorrect ? prev + 1 : prev));
    setStatus('answered');
  }, [status, currentQuestion, timeLimitMs, timeRemainingMs]);

  const nextQuestion = useCallback(() => {
    if (isLastQuestion) {
      setStatus('finished');
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setStatus('answering');
      resetTimer();
    }
  }, [isLastQuestion, resetTimer]);

  const timeUp = useCallback(() => {
    submitAnswer('__TIME_UP__');
  }, [submitAnswer]);

  return {
    currentQuestion,
    currentQuestionIndex,
    answers,
    sessionStreak,
    score,
    status,
    timeRemainingMs,
    timeLimitMs,
    totalQuestions: test.questions.length,
    isLastQuestion,
    submitAnswer,
    nextQuestion,
    tick,
    resetTimer,
    timeUp,
  };
}
