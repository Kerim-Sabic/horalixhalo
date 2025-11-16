/**
 * Action item domain model
 */

export type ActionItemPriority = 'low' | 'medium' | 'high';
export type ActionItemStatus = 'open' | 'in_progress' | 'done';
export type ActionItemSource = 'ai' | 'user';

export interface ActionItem {
  id: string;
  meetingId: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  owner: string | null;
  dueDate: string | null;
  priority: ActionItemPriority;
  status: ActionItemStatus;
  source: ActionItemSource;
}

export interface CreateActionItemInput {
  meetingId: string;
  text: string;
  owner?: string | null;
  dueDate?: string | null;
  priority?: ActionItemPriority;
  status?: ActionItemStatus;
  source: ActionItemSource;
}

export interface UpdateActionItemInput {
  text?: string;
  owner?: string | null;
  dueDate?: string | null;
  priority?: ActionItemPriority;
  status?: ActionItemStatus;
}
