
export type FeedbackType = "recognition" | "improvement" | "1on1";
export type FeedbackVisibility = "public" | "private";

export interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  content: string;
  visibility: FeedbackVisibility;
  sender_id: string;
  receiver_id: string;
  tags?: string[];
  due_date?: Date;
  action_items?: string[];
}
