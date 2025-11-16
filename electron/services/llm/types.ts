/**
 * LLM (Large Language Model) types
 */

export interface LLMConfig {
  provider: 'deepseek' | 'openai' | 'anthropic' | 'localHttp';
  apiKey?: string;
  baseUrl?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface SummaryInput {
  conversationSummarySoFar: string;
  latestSegments: any[];
  meetingGoal: string | null;
  useCaseProfile: string;
  userNotes: string;
}

export interface SummaryOutput {
  shortSummary: string;
  detailedSummarySections: { title: string; bullets: string[] }[];
  decisions: string[];
  risks: string[];
  followUpQuestions: string[];
}

export interface ReplySuggestionInput {
  recentTranscriptWindow: string;
  meetingGoal: string | null;
  desiredTone: 'neutral' | 'friendly' | 'assertive' | 'polite' | 'direct';
  userRole: string;
}

export interface ReplySuggestionOutput {
  replyText: string;
  rationale: string;
}

export interface FollowupInput {
  transcriptSummary: string;
  context: string;
}

export interface FollowupOutput {
  questions: string[];
}

export interface ActionItemInput {
  transcriptSegments: any[];
  existingActions: any[];
}

export interface ActionItemOutput {
  actionItems: Array<{
    text: string;
    owner: string | null;
    dueDate: string | null;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export interface RiskAnalysisInput {
  transcriptSegments: any[];
  meetingGoal: string | null;
}

export interface RiskOutput {
  risks: Array<{
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface ToneTransformInput {
  originalText: string;
  targetTone: 'politer' | 'direct' | 'shorter' | 'longer' | 'friendly';
}

export interface ToneTransformOutput {
  transformedText: string;
}

export interface LLMProvider {
  id: string;
  displayName: string;
  isOnlineService: boolean;

  generateSummary: (input: SummaryInput) => Promise<SummaryOutput>;
  suggestReply: (input: ReplySuggestionInput) => Promise<ReplySuggestionOutput>;
  generateFollowup: (input: FollowupInput) => Promise<FollowupOutput>;
  extractActionItems: (input: ActionItemInput) => Promise<ActionItemOutput>;
  analyzeRisks: (input: RiskAnalysisInput) => Promise<RiskOutput>;
  transformTone: (input: ToneTransformInput) => Promise<ToneTransformOutput>;
}
