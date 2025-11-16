/**
 * LLM Prompt Templates
 * Structured prompts for different use cases and AI actions
 */

import type {
  SummaryInput,
  ReplySuggestionInput,
  FollowupInput,
  ActionItemInput,
  RiskAnalysisInput,
  ToneTransformInput,
} from './types';

export function buildSummaryPrompt(input: SummaryInput): string {
  return `You are an expert meeting assistant. Analyze the following conversation and provide a structured summary.

**Meeting Context:**
${input.meetingGoal ? `Goal: ${input.meetingGoal}` : 'No specific goal provided'}
Use Case Profile: ${input.useCaseProfile}

**Previous Summary (if any):**
${input.conversationSummarySoFar || 'This is the start of the meeting'}

**Latest Conversation:**
${input.latestSegments.map((s: any) => `[${s.speaker}]: ${s.text}`).join('\n')}

**User Notes:**
${input.userNotes || 'No notes provided'}

Please provide a comprehensive summary in the following JSON format:
{
  "shortSummary": "2-3 sentence executive summary",
  "detailedSummarySections": [
    {"title": "Key Points", "bullets": ["point 1", "point 2"]},
    {"title": "Discussion Topics", "bullets": ["topic 1", "topic 2"]}
  ],
  "decisions": ["decision 1", "decision 2"],
  "risks": ["risk 1", "risk 2"],
  "followUpQuestions": ["question 1?", "question 2?"]
}

Return ONLY the JSON, no additional text.`;
}

export function buildReplySuggestionPrompt(input: ReplySuggestionInput): string {
  const toneGuidance = {
    neutral: 'Keep the tone balanced and professional',
    friendly: 'Use a warm, approachable tone',
    assertive: 'Be confident and direct',
    polite: 'Be exceptionally courteous and respectful',
    direct: 'Be clear and to the point',
  };

  return `You are an AI coach helping someone during a live conversation. Based on the recent discussion, suggest what they should say next.

**Recent Conversation:**
${input.recentTranscriptWindow}

**Context:**
${input.meetingGoal ? `Meeting Goal: ${input.meetingGoal}` : ''}
Your Role: ${input.userRole}
Desired Tone: ${input.desiredTone} - ${toneGuidance[input.desiredTone]}

Please suggest a thoughtful, contextually appropriate reply. Respond in JSON format:
{
  "replyText": "The suggested reply",
  "rationale": "Why this reply is appropriate"
}

Return ONLY the JSON, no additional text.`;
}

export function buildFollowupQuestionsPrompt(input: FollowupInput): string {
  return `Based on this conversation summary, generate 3-5 intelligent follow-up questions to deepen the discussion or clarify important points.

**Conversation Summary:**
${input.transcriptSummary}

**Additional Context:**
${input.context}

Generate questions that:
- Clarify ambiguous points
- Explore implications
- Identify next steps
- Uncover potential issues

Respond in JSON format:
{
  "questions": ["question 1?", "question 2?", "question 3?"]
}

Return ONLY the JSON, no additional text.`;
}

export function buildActionItemsPrompt(input: ActionItemInput): string {
  return `Extract actionable tasks from this conversation. Focus on concrete commitments, TODOs, and next steps.

**Conversation Transcript:**
${input.transcriptSegments.map((s: any) => `[${s.speaker}]: ${s.text}`).join('\n')}

**Existing Action Items (avoid duplicates):**
${input.existingActions.map((a: any) => `- ${a.text}`).join('\n') || 'None yet'}

For each action item, identify:
- What needs to be done (be specific)
- Who should do it (if mentioned)
- When it's due (if mentioned)
- Priority level (low/medium/high based on urgency)

Respond in JSON format:
{
  "actionItems": [
    {
      "text": "Specific action description",
      "owner": "Person name or null",
      "dueDate": "YYYY-MM-DD or null",
      "priority": "low" | "medium" | "high"
    }
  ]
}

Return ONLY the JSON, no additional text.`;
}

export function buildRiskAnalysisPrompt(input: RiskAnalysisInput): string {
  return `Analyze this conversation for potential risks, concerns, or red flags.

**Conversation:**
${input.transcriptSegments.map((s: any) => `[${s.speaker}]: ${s.text}`).join('\n')}

**Meeting Goal:**
${input.meetingGoal || 'Not specified'}

Identify:
- Potential roadblocks or obstacles
- Unresolved conflicts
- Missing information or dependencies
- Timeline concerns
- Budget or resource issues
- Stakeholder misalignment

For each risk, assess severity: low (minor concern), medium (notable issue), or high (critical problem).

Respond in JSON format:
{
  "risks": [
    {
      "description": "Clear description of the risk",
      "severity": "low" | "medium" | "high"
    }
  ]
}

Return ONLY the JSON, no additional text.`;
}

export function buildToneTransformPrompt(input: ToneTransformInput): string {
  const transformations = {
    politer: 'more polite, courteous, and respectful',
    direct: 'more direct and to-the-point',
    shorter: 'more concise and brief',
    longer: 'more detailed and elaborate',
    friendly: 'warmer and more approachable',
  };

  return `Transform the following text to be ${transformations[input.targetTone]}.

**Original Text:**
${input.originalText}

**Target Style:**
${input.targetTone}

Guidelines:
- Preserve the core message and intent
- Adjust tone, length, or style as requested
- Maintain professionalism

Respond in JSON format:
{
  "transformedText": "The transformed version"
}

Return ONLY the JSON, no additional text.`;
}

/**
 * System prompts for different use case profiles
 */
export const USE_CASE_SYSTEM_PROMPTS = {
  sales: 'You are an AI sales coach. Focus on building rapport, identifying pain points, and guiding toward a close.',
  internal: 'You are an AI team collaboration assistant. Focus on clarity, alignment, and actionable outcomes.',
  standup: 'You are an AI standup facilitator. Focus on progress, blockers, and next steps. Keep things brief.',
  support: 'You are an AI customer support assistant. Focus on empathy, problem-solving, and clear resolutions.',
  custom: 'You are a helpful AI meeting assistant.',
};
