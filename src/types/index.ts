export interface Question {
  id: string;
  title: string;
  text: string;
  companies: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topics?: string[];
  roundType?: 'OA' | 'Technical' | 'HR' | 'Onsite';
  frequency?: number;
  lastAsked?: string;
  sampleInput?: string;
  sampleOutput?: string;
  explanation?: string;
  description?: string;
  dateAdded?: string;
}

export interface CompanyInsight {
  company: string;
  totalQuestions: number;
  topicDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  topQuestions: Question[];
}

export interface TopicAnalysis {
  topic: string;
  count: number;
  percentage: number;
  companies: string[];
  avgDifficulty: string;
  recentTrend: 'up' | 'down' | 'stable';
}

export interface FilterState {
  search: string;
  companies: string[];
  topics: string[];
  difficulties: string[];
  roundTypes: string[];
  recency: string;
}