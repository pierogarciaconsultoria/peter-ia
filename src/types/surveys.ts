
export type QuestionType = "rating" | "text" | "boolean";

export interface SurveyQuestion {
  id: number;
  text: string;
  type: QuestionType;
  required?: boolean;
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  dateCreated: string;
  status: "active" | "inactive" | "draft";
  responses: number;
}

export interface SurveyResponse {
  id: number;
  surveyId: number;
  respondentEmail?: string;
  dateSubmitted: string;
  answers: Array<{
    questionId: number;
    value: string | number | boolean;
  }>;
}
