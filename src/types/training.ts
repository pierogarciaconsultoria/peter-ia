
/**
 * Training participant interface
 */
export interface TrainingParticipant {
  id: string;
  name: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'failed';
  attended?: boolean;
}

/**
 * Training interface representing a training session
 */
export interface Training {
  id: string;
  title: string;
  description?: string;
  trainer: string;
  training_date: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  department: string;
  participants?: TrainingParticipant[];
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  procedure_id?: string;
  evaluation_method?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Type for creating a new training
 */
export type CreateTrainingInput = Omit<Training, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing training
 */
export type UpdateTrainingInput = Partial<Omit<Training, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Filter options for fetching trainings
 */
export interface TrainingFilters {
  department?: string;
  status?: Training['status'];
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}
