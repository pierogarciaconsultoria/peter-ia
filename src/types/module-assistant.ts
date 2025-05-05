
export interface ModuleAssistant {
  id: string;
  name: string;
  label: string;
  description: string | null;
  enabled: boolean;
  capabilities: string | null;
  limitations: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AssistantResponse {
  response: string;
}

export interface AssistantConversation {
  id: string;
  module: string;
  role: string;
  content: string;
  user_id: string;
  timestamp: string;
}
