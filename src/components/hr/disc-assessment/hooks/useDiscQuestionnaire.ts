
import { useState } from 'react';
import type { DiscScore } from "@/hooks/useDiscAssessments";

export function useDiscQuestionnaire(onComplete: (scores: DiscScore) => void) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comments, setComments] = useState("");

  const handleAnswer = (value: string, questionId: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const calculateScores = (): DiscScore => {
    const scores = {
      D: 0,
      I: 0,
      S: 0,
      C: 0
    };
    
    Object.values(answers).forEach(value => {
      scores[value as keyof DiscScore] += 1;
    });
    
    return scores;
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex(prev => prev - 1);
  };

  const canComplete = Object.keys(answers).length >= 8;

  const handleComplete = () => {
    const scores = calculateScores();
    onComplete(scores);
  };

  return {
    currentQuestionIndex,
    answers,
    comments,
    setComments,
    handleAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    canComplete,
    handleComplete
  };
}
