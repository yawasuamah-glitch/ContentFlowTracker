export enum Platform {
  YOUTUBE = 'YouTube',
  SUBSTACK = 'Substack',
  BOTH = 'Both'
}

export enum ContentStatus {
  IDEA = 'Idea',
  RESEARCH = 'Research', // NotebookLM phase
  DRAFTING = 'Drafting', // Gemini phase
  PRODUCTION = 'Production',
  PUBLISHED = 'Published'
}

export enum ContentType {
  VIDEO = 'Video',
  ARTICLE = 'Article',
  NEWSLETTER = 'Newsletter',
  SHORT = 'Short'
}

export interface ContentItem {
  id: string;
  title: string;
  topic: string;
  type: ContentType;
  platform: Platform;
  status: ContentStatus;
  researchNotes: string; // Link to NotebookLM or raw notes
  draftContent: string; // Gemini generated draft
  thumbnailUrl?: string; // Generated or uploaded
  createdAt: number;
  updatedAt: number;
}
