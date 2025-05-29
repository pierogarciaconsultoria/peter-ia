
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
      d: 0,
      i: 0,
      s: 0,
      c: 0
    };
    
    Object.values(answers).forEach(value => {
      const scoreKey = value.toLowerCase() as keyof DiscScore;
      if (scoreKey in scores) {
        scores[scoreKey] += 1;
      }
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
