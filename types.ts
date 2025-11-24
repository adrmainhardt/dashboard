
export interface DashboardMetrics {
  totalRevenue: number;
  totalLeads: number;
  totalNewBusiness: number;
  totalLost: number;
  winRate: number;
  activePipelineValue: number;
  dealsBySource: Record<string, number>;
}

// Representa a grade exata da planilha (Linhas x Colunas)
export type SheetRow = string[];
export type SheetGrid = SheetRow[];

export enum Tab {
  HOME = 'home',
  MARKETING = 'marketing',
  NEW_BUSINESS = 'new_business',
  WON = 'won',
  LOST = 'lost',
}

export type AppData = {
  [key in Tab]?: SheetGrid;
};