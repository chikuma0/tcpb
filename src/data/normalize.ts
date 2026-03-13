import type {
  TimelineEvent, ConceptModel, Statistics, FinancialModel,
  Organization, Project, Person, Concept, Quote, Governance,
  GraphNode, GraphEdge, ProjectLocation, DocumentMetadata,
  AdjacencyMap, LocationOrgLookup, PersonQuoteLookup,
} from './types';

// Raw imports
import rawTimeline from './raw/timeline-events.json';
import rawConceptModel from './raw/cpb-concept-model.json';
import rawStatistics from './raw/statistics.json';
import rawFinancialModel from './raw/financial-model.json';
import rawOrganizations from './raw/organizations.json';
import rawProjects from './raw/projects.json';
import rawPeople from './raw/people.json';
import rawConcepts from './raw/concepts.json';
import rawQuotes from './raw/quotes.json';
import rawGovernance from './raw/governance.json';
import rawGraphNodes from './raw/graph-nodes.json';
import rawGraphEdges from './raw/graph-edges.json';
import rawLocations from './raw/locations.json';
import rawMetadata from './raw/metadata.json';

// === Normalized Data ===

export const timelineEvents: TimelineEvent[] = (rawTimeline as TimelineEvent[])
  .sort((a, b) => a.year - b.year);

export const conceptModel: ConceptModel = rawConceptModel as ConceptModel;

export const statistics: Statistics = rawStatistics as Statistics;

export const financialModel: FinancialModel = rawFinancialModel as FinancialModel;

export const organizations: Organization[] = (rawOrganizations as { organizations: Organization[] }).organizations;

export const projects: Project[] = (rawProjects as { projects: Project[] }).projects;

export const people: Person[] = (rawPeople as { participants: Person[] }).participants;

export const concepts: Concept[] = (rawConcepts as { concepts: Concept[] }).concepts;

export const quotes: Quote[] = (rawQuotes as { quotes: Quote[] }).quotes;

export const governance: Governance = rawGovernance as Governance;

export const graphNodes: GraphNode[] = (rawGraphNodes as { nodes: GraphNode[] }).nodes;

export const graphEdges: GraphEdge[] = (rawGraphEdges as { edges: GraphEdge[] }).edges;

export const locations: ProjectLocation[] = (rawLocations as { locations: ProjectLocation[] }).locations;

export const metadata: DocumentMetadata = rawMetadata as DocumentMetadata;

// === Derived View Models ===

export function buildAdjacencyMap(nodes: GraphNode[], edges: GraphEdge[]): AdjacencyMap {
  const map: AdjacencyMap = {};
  for (const node of nodes) {
    map[node.node_id] = { neighbors: [], edges: [] };
  }
  for (const edge of edges) {
    if (map[edge.source]) {
      map[edge.source].neighbors.push(edge.target);
      map[edge.source].edges.push(edge);
    }
    if (map[edge.target]) {
      map[edge.target].neighbors.push(edge.source);
      map[edge.target].edges.push(edge);
    }
  }
  return map;
}

export function buildLocationOrgLookup(orgs: Organization[]): LocationOrgLookup {
  const lookup: LocationOrgLookup = {};
  for (const org of orgs) {
    if (!lookup[org.location]) {
      lookup[org.location] = [];
    }
    lookup[org.location].push(org);
  }
  return lookup;
}

export function buildPersonQuoteLookup(ppl: Person[], qts: Quote[]): PersonQuoteLookup {
  const lookup: PersonQuoteLookup = {};
  for (const p of ppl) {
    lookup[p.name_ja] = qts.filter(q => q.speaker === p.name_ja);
  }
  return lookup;
}

// === Data Integrity Validation (runs once at import) ===

export function validateData() {
  const nodeIds = new Set(graphNodes.map(n => n.node_id));
  const warnings: string[] = [];

  // Check all edge references resolve
  for (const edge of graphEdges) {
    if (!nodeIds.has(edge.source)) warnings.push(`Edge ${edge.edge_id}: source "${edge.source}" not found in nodes`);
    if (!nodeIds.has(edge.target)) warnings.push(`Edge ${edge.edge_id}: target "${edge.target}" not found in nodes`);
  }

  // Check sector percentages sum to 100
  const sectorSum = Object.values(statistics.sector_distribution_percent).reduce((a, b) => a + b, 0);
  if (sectorSum !== 100) warnings.push(`Sector percentages sum to ${sectorSum}, expected 100`);

  // Check loan type percentages sum to 100
  const loanSum = Object.values(statistics.loan_type_distribution_percent).reduce((a, b) => a + b, 0);
  if (loanSum !== 100) warnings.push(`Loan type percentages sum to ${loanSum}, expected 100`);

  // Check quote speakers match people
  for (const quote of quotes) {
    if (!people.some(p => p.name_ja === quote.speaker)) {
      warnings.push(`Quote speaker "${quote.speaker}" not found in people`);
    }
  }

  // Check location→org mapping
  for (const loc of locations) {
    for (const projName of loc.related_projects) {
      if (!organizations.some(o => o.name_ja === projName) && !projects.some(p => p.project_name_ja === projName)) {
        warnings.push(`Location "${loc.location_name}" references project "${projName}" not found in organizations or projects`);
      }
    }
  }

  // Check timeline ordering
  for (let i = 1; i < timelineEvents.length; i++) {
    if (timelineEvents[i].year < timelineEvents[i - 1].year) {
      warnings.push(`Timeline not chronological at index ${i}: ${timelineEvents[i].year} < ${timelineEvents[i - 1].year}`);
    }
  }

  // Flag orphan nodes
  const connectedNodes = new Set<string>();
  for (const edge of graphEdges) {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  }
  for (const node of graphNodes) {
    if (!connectedNodes.has(node.node_id)) {
      warnings.push(`Orphan node: "${node.node_id}" (${node.name_ja || node.name_en}) has no edges`);
    }
  }

  if (warnings.length > 0) {
    console.warn('[Tokyo CPB Data Validation]', warnings);
  }

  return warnings;
}
