import { Injectable, signal } from '@angular/core';
import { Industry, IndustryConfig } from '../models/industry.model';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {

  readonly industries: IndustryConfig[] = [
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: 'heart-pulse',
      description: 'Clinical knowledge and medical documentation',
      themeClass: 'theme-healthcare',
      documentTypes: [
        'Clinical Guidelines',
        'Drug Information',
        'Medical Research',
        'Hospital SOPs',
        'Medical Formulas'
      ]
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: 'chart-no-axes-combined',
      description: 'Financial intelligence and business knowledge',
      themeClass: 'theme-finance',
      documentTypes: [
        'Annual Reports',
        'Financial Statements',
        'Risk Reports',
        'Investment Policies',
        'Market Research'
      ]
    }
  ];

  readonly currentIndustry = signal<Industry>('healthcare');

  setIndustry(industry: Industry): void {
    this.currentIndustry.set(industry);
  }

  getConfig(): IndustryConfig {
    return this.industries.find(
      industry => industry.id === this.currentIndustry()
    )!;
  }
}