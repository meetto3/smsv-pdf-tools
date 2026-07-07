import type { PagePreview, PdfSummary, RulePreset } from '../types';

export const mockPdfSummary: PdfSummary = {
  fileName: 'score-set.pdf',
  title: '練習用スコア集',
  pages: 128,
  sizeMb: 42.7,
  orientation: 'mixed',
  pageSize: 'A4 / A3 mixed',
  encrypted: false,
  author: 'SMSV PDF Tools',
  subject: '見開き分割と回転のサンプル',
  keywords: ['楽譜', 'PDF', 'SMSV'],
  createdAt: '2026-07-04 10:20',
  updatedAt: '2026-07-04 10:24',
};

export const mockPages: PagePreview[] = Array.from({ length: 16 }, (_, index) => {
  const page = index + 1;

  return {
    number: page,
    label: `P${page}`,
    rotated: page % 4 === 0 ? 90 : 0,
    selected: page === 1 || page === 2,
    splitTarget: page === 1 || page === 2,
    splitHint: page % 2 === 0 ? 'right' : 'left',
  };
});

export const mockPresets: RulePreset[] = [
  {
    name: 'SMSV向け見開き分割',
    summary: '左右2分割して単ページ化する',
    steps: ['左右分割', '左→右で出力', 'タイトル更新'],
  },
  {
    name: '奇数ページだけ回転',
    summary: '奇数ページを右へ90度回す',
    steps: ['奇数ページを対象', '右90度回転'],
  },
  {
    name: '両面スキャン整列',
    summary: '偶数ページの向きを統一して順序を整える',
    steps: ['偶数ページを対象', '左90度回転', '順序確認'],
  },
];
