// === Enums ===

export type TimelineCategory = 'movement' | 'policy_change' | 'organization_event' | 'social_context';

export type NodeType = 'organization' | 'person' | 'concept' | 'location' | 'project' | 'timeline_event' | 'financial_model' | 'statistics' | 'governance';

export type RelationshipType = 'affiliated_with' | 'embodies_concept' | 'funds_or_supports' | 'located_in' | 'operates_project' | 'takes_place_in' | 'milestone_for' | 'uses_model' | 'described_by_statistics' | 'governed_by';

export type OrgType = 'community_cafe' | 'nonprofit' | 'sports_club' | 'support_center' | 'workers_collective' | 'community_support' | 'social_enterprise' | 'housing_collective' | 'environmental_project' | 'community_business' | 'community_space' | 'meal_service';

export type Confidence = 'high' | 'medium';

// === Data Types ===

export interface TimelineEvent {
  year: number;
  month?: number;
  event_ja: string;
  category: TimelineCategory;
  entities: string[];
}

export interface ConceptModel {
  model_name_ja: string;
  center: string;
  left_circle: { label_ja: string; points_ja: string[] };
  right_circle: { label_ja: string; points_ja: string[] };
  goal_ja: string;
}

export interface Statistics {
  dataset: string;
  period: string;
  headline_metrics: {
    loan_count_total: number;
    loan_total_yen: number;
    social_investment_count: number;
    social_investment_total_yen: number;
  };
  sector_distribution_percent: Record<string, number>;
  loan_type_distribution_percent: Record<string, number>;
  confidence: Confidence;
}

export interface FinancialModel {
  model_name: string;
  target_borrowers_ja: string[];
  loan_purposes_ja: string[];
  interest_rates: Record<string, string>;
  repayment: Record<string, string>;
  guarantee_ja: string[];
  review_body_ja: string;
  review_criteria_ja: string[];
  confidence: Confidence;
}

export interface Organization {
  organization_id: string;
  name_ja: string;
  location: string;
  type: OrgType;
}

export interface Project {
  project_id: string;
  project_name_ja: string;
  organization: string;
  location: string;
}

export interface Person {
  person_id: string;
  name_ja: string;
  role_ja: string;
  affiliation_ja: string;
  appears_on_scan_pages: number[];
  confidence: Confidence;
}

export interface Concept {
  concept_id: string;
  name_ja: string;
  name_en: string;
  description_ja: string;
  confidence: Confidence;
}

export interface Quote {
  speaker: string;
  quote_ja: string;
  theme: string;
  scan_page: number;
  confidence: Confidence;
}

export interface Governance {
  dataset: string;
  key_structures: {
    governing_bodies_ja: string[];
    membership_summary_ja: string;
    principles_ja: string[];
  };
  confidence: Confidence;
}

export interface GraphNode {
  node_id: string;
  type: NodeType;
  name_ja?: string;
  name_en?: string;
  role_ja?: string;
  year?: number;
  event_ja?: string;
  category?: string;
}

export interface GraphEdge {
  edge_id: string;
  source: string;
  target: string;
  relationship: RelationshipType;
}

export interface ProjectLocation {
  location_id: string;
  location_name: string;
  related_projects: string[];
}

export interface DocumentMetadata {
  title_ja: string;
  main_title_ja: string;
  subtitle_ja: string;
  organization_ja: string;
  organization_en: string;
  publication_date: string;
  language: string;
  archive_quality: string;
  notes: string[];
}

// === Derived View Models ===

export interface AdjacencyMap {
  [nodeId: string]: { neighbors: string[]; edges: GraphEdge[] };
}

export interface LocationOrgLookup {
  [locationName: string]: Organization[];
}

export interface PersonQuoteLookup {
  [personName: string]: Quote[];
}
