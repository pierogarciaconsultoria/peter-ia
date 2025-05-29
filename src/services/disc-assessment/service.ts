
import { createAssessment, fetchAllAssessments } from './api';
import { validateAssessmentLink, markAssessmentLinkAsUsed, generateAssessmentLink } from './links';
import { getDiscProfileDescription, determinePrimaryType, calculateProfileBalance } from './utils';
import { DiscAssessment, DiscScore, CreateDiscAssessmentParams } from '@/types/disc';

/**
 * Comprehensive DISC Assessment Service that combines all functionality
 */
class DiscAssessmentService {
  // Assessment creation and retrieval
  async create(assessment: CreateDiscAssessmentParams): Promise<DiscAssessment> {
    return createAssessment(assessment);
  }
  
  async fetchAll(): Promise<DiscAssessment[]> {
    return fetchAllAssessments();
  }
  
  // Link management
  async validateLink(token: string): Promise<boolean> {
    return validateAssessmentLink(token);
  }
  
  async markLinkAsUsed(token: string): Promise<boolean> {
    return markAssessmentLinkAsUsed(token);
  }
  
  async generateLink(name: string, email: string): Promise<string> {
    return generateAssessmentLink(name, email);
  }
  
  // Utility functions
  getPrimaryType(scores: DiscScore): string {
    return determinePrimaryType(scores);
  }
  
  getProfileDescription(primaryType: string): string {
    return getDiscProfileDescription(primaryType);
  }
  
  getProfileBalance(scores: DiscScore): number {
    return calculateProfileBalance(scores);
  }
}

export const discAssessmentService = new DiscAssessmentService();
