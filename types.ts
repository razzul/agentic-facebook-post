
export interface TriviaPost {
  id: string;
  timestamp: string;
  question: string;
  answer: string;
  funFact: string;
  imageDescription: string;
  hashtags: string[];
  status: 'scheduled' | 'posted' | 'failed';
  platform: 'facebook' | 'instagram';
  imageUrl?: string;
}

export interface AgentConfig {
  autoPostEnabled: boolean;
  postTime: string; // HH:MM
  topic: string;
  groupName: string;
  fbConnected: boolean;
}

export interface GeminiResponse {
  question: string;
  answer: string;
  funFact: string;
  imageDescription: string;
  hashtags: string[];
}
