export type Jurisdiction = 'doc_only' | 'india' | 'us' | 'uk' | 'general';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type SeverityLevel = 'concern' | 'unclear' | 'obligation' | 'one_sided';

export interface PartyObligation {
  id: string;
  party: string;
  title: string;
  obligation: string;
  deadline?: string;
  condition?: string;
  consequence?: string;
  sectionRef: string;
  confidence: ConfidenceLevel;
}

export interface ExtractedClause {
  id: string;
  title: string;
  category: 
    | 'Payment'
    | 'Term'
    | 'Termination'
    | 'Renewal'
    | 'Confidentiality'
    | 'Liability'
    | 'Indemnification'
    | 'Intellectual Property'
    | 'Non-compete'
    | 'Dispute resolution'
    | 'Governing law'
    | 'Data/privacy'
    | 'Penalties'
    | 'Notice'
    | 'General';
  plainEnglish: string;
  whoItAffects: string;
  obligation: string;
  duration?: string;
  potentialConcern?: string;
  docReference: string;
  quote: string;
  confidence: ConfidenceLevel;
  sectionNumber?: string;
}

export interface PotentialIssue {
  id: string;
  title: string;
  category: string;
  description: string;
  whyItMatters: string;
  evidence: string;
  location: string;
  confidence: ConfidenceLevel;
  findingType:
    | 'Potential concern'
    | 'Worth reviewing'
    | 'Unclear provision'
    | 'One-sided provision'
    | 'Missing information'
    | 'Potentially significant obligation'
    | 'Ambiguous language';
  suggestedQuestion: string;
}

export interface XRayNode {
  id: string;
  title: string;
  category: string;
  sectionRef: string;
  summary: string;
  status: 'normal' | 'attention' | 'critical';
  children?: XRayNode[];
}

export interface BeforeYouSignItem {
  id: string;
  topic: string;
  question: string;
  status: 'clear' | 'needs_clarification' | 'review_recommended';
  finding: string;
  clauseRef: string;
  lawyerPrompt: string;
}

export interface LawyerQuestionGroup {
  category:
    | 'Before signing'
    | 'If something goes wrong'
    | 'Money & payments'
    | 'Termination'
    | 'Liability'
    | 'Intellectual property'
    | 'Privacy'
    | 'Disputes';
  questions: {
    id: string;
    question: string;
    context: string;
    sectionRef: string;
  }[];
}

export interface ActionChecklistItem {
  id: string;
  title: string;
  description: string;
  sectionRef: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  userNotes?: string;
  category: string;
}

export interface DocumentAnalysis {
  documentId: string;
  documentTitle: string;
  documentType: string;
  executiveSummary: string;
  whatThisDocumentDoes: string;
  parties: {
    name: string;
    role: string;
    shortLabel: string;
  }[];
  partyAObligations: PartyObligation[];
  partyBObligations: PartyObligation[];
  clauses: ExtractedClause[];
  potentialIssues: PotentialIssue[];
  missingInformation: string[];
  legalXRayTree: XRayNode[];
  beforeYouSignScorecard: BeforeYouSignItem[];
  questionsForLawyer: LawyerQuestionGroup[];
  actionChecklist: ActionChecklistItem[];
  analyzedAt: string;
  jurisdiction: Jurisdiction;
}

export interface DocumentSection {
  id: string;
  number: string;
  title: string;
  content: string;
  startLine: number;
  endLine: number;
}

export interface DocumentVersion {
  id: string;
  versionNumber: string;
  timestamp: string;
  title: string;
  description: string;
  author: 'Original Baseline' | 'Manual Edit' | 'Proposed Revision' | 'AI Suggestion';
  sourceClause?: string;
  text: string;
  diffSummary?: string;
  changesCount?: number;
  highlightWords?: string[];
}

export interface LegalDocument {
  id: string;
  title: string;
  documentType: string;
  rawText: string;
  wordCount: number;
  uploadedAt: string;
  isDemo?: boolean;
  sections?: DocumentSection[];
  analysis?: DocumentAnalysis;
  versions?: DocumentVersion[];
}

export interface ComparisonDiff {
  id: string;
  category: string;
  clauseTitle: string;
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  docAQuote?: string;
  docBQuote?: string;
  whatChanged: string;
  plainMeaning: string;
  potentialSignificance: string;
  questionsToConsider: string;
}

export interface ComparisonResult {
  docAId: string;
  docBId: string;
  docATitle: string;
  docBTitle: string;
  executiveComparison: string;
  stats: {
    added: number;
    removed: number;
    modified: number;
    unchanged: number;
  };
  differences: ComparisonDiff[];
  comparedAt: string;
}

export interface ChatEvidence {
  text: string;
  section: string;
  confidence: ConfidenceLevel;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  evidence?: ChatEvidence[];
  confidence?: ConfidenceLevel;
  timestamp: string;
  suggestedQuestions?: string[];
  isNotFoundInDoc?: boolean;
}

export type ActiveTab =
  | 'overview'
  | 'workspace'
  | 'compare'
  | 'ask'
  | 'checklist'
  | 'brief';
