export type Industry = 'healthcare' | 'finance';

export interface IndustryConfig {
  id: Industry;
  name: string;
  icon: string;
  description: string;
  themeClass: string;
  documentTypes: string[];
}