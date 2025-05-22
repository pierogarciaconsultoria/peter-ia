
/**
 * This file is maintained for backward compatibility
 * New code should import from the training directory directly
 */

import { Training, TrainingFilters, CreateTrainingInput, UpdateTrainingInput, TrainingParticipant } from "@/types/training";

// Re-export everything from the new module
export * from './training';

// Re-export the types for backward compatibility
export type {
  Training,
  TrainingFilters,
  CreateTrainingInput,
  UpdateTrainingInput,
  TrainingParticipant
};
