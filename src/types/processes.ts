
export interface Indicator {
  id: number;
  name: string;
  goal: string;
  current: string;
}

export interface Process {
  id: number;
  name: string;
  description: string;
  owner: string;
  status: string;
  lastUpdated: string;
  indicators: Indicator[];
  documents: number;
  risks: number;
  type?: "Gestão" | "Negócio" | "Apoio";
  
  // New fields
  createdAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  version?: string;
  objective?: string;
  problems?: string[];
  processRisks?: string[];
  entryRequirements?: string[];
  expectedResult?: string;
}
