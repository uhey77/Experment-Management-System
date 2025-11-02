export type ExperimentStatus =
  | "planned"
  | "running"
  | "review"
  | "completed"
  | "archived";

export interface Experiment {
  id: number;
  title: string;
  description?: string | null;
  owner: string;
  status: ExperimentStatus;
  tags: string[];
  repo_url?: string | null;
  notes?: string | null;
  results_url?: string | null;
  external_links: string[];
  created_at: string;
  updated_at: string;
}

export interface ExperimentFilters {
  owner?: string;
  status?: ExperimentStatus | "";
  search?: string;
}

export interface CreateExperimentPayload {
  title: string;
  description?: string;
  owner: string;
  status?: ExperimentStatus;
  tags?: string[];
  repo_url?: string;
  notes?: string;
  results_url?: string;
  external_links?: string[];
}
