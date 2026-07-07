export type PdfSummary = {
  fileName: string;
  title: string;
  pages: number | null;
  sizeMb: number;
  orientation: 'portrait' | 'landscape' | 'mixed';
  pageSize: string;
  encrypted: boolean;
  author: string;
  subject: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type LoadedDocument = {
  id: string;
  file: File;
  objectUrl: string;
  summary: PdfSummary;
  status: 'loading' | 'ready' | 'error';
  error?: string;
};

export type PagePreview = {
  number: number;
  label: string;
  rotated: 0 | 90 | 180 | 270;
  selected: boolean;
  splitTarget: boolean;
  removed?: boolean;
  splitHint?: 'left' | 'right' | 'top' | 'bottom';
};

export type RulePreset = {
  name: string;
  summary: string;
  steps: string[];
};

export type SplitDirection = 'vertical' | 'horizontal';
export type SplitOrder = 'left-right' | 'right-left' | 'top-bottom' | 'bottom-top';
export type SplitScope = 'all' | 'odd' | 'even' | 'range';

export type SplitSettings = {
  direction: SplitDirection;
  order: SplitOrder;
  position: number;
  overlapMm: number;
  marginMm: number;
  scope: SplitScope;
};

export type ExportStatus = 'idle' | 'exporting' | 'done' | 'error';
