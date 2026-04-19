export interface BOMItem {
  id: string;
  name: string;
  partNumber: string;
  type: 'system' | 'subsystem' | 'assembly' | 'part';
  children?: BOMItem[];
  relatedSWModules: string[];
}

export interface SWModule {
  id: string;
  name: string;
  description: string;
  language: string;
  filePath: string;
  dependencies: string[];
  relatedBOMItems: string[];
  testCases: string[];
  lastModified: string;
  author: string;
  codeSnippet: string;
}

export type ECOStatus = 'draft' | 'review' | 'approved' | 'in-progress' | 'completed';
export type ECOPriority = 'critical' | 'high' | 'medium' | 'low';
export type ChangeType = 'parameter' | 'design' | 'material' | 'software';

export interface ECO {
  id: string;
  title: string;
  status: ECOStatus;
  priority: ECOPriority;
  requestDate: string;
  requester: string;
  targetBOMItem: string;
  changeType: ChangeType;
  changeDescription: string;
  reason: string;
  affectedModules?: string[];
  generatedCode?: string;
  generatedTests?: string;
  generatedReport?: string;
}

export interface ECOHistory {
  id: string;
  title: string;
  date: string;
  targetPart: string;
  changeDescription: string;
  issuesEncountered: string;
  resolution: string;
  lessonsLearned: string;
}

export interface AnalysisResult {
  affectedModules: {
    moduleId: string;
    moduleName: string;
    riskLevel: 'High' | 'Medium' | 'Low';
    reason: string;
    estimatedEffort: string;
  }[];
  similarECOs: {
    ecoId: string;
    title: string;
    issues: string;
    lessons: string;
  }[];
  totalEstimatedDays: number;
  warnings: string[];
  recommendations: string[];
}

export interface TestCase {
  id: string;
  type: 'unit' | 'boundary' | 'exception' | 'regression';
  description: string;
  input: string;
  expectedResult: string;
  priority: 'High' | 'Medium' | 'Low';
}

export type TabType = 'dashboard' | 'analysis' | 'codegen' | 'testgen' | 'report' | 'knowledge' | 'compliance';

export interface AppState {
  ecos: ECO[];
  selectedECO: ECO | null;
  activeTab: TabType;
  analysisResult: AnalysisResult | null;
  generatedCode: string | null;
  generatedTests: TestCase[] | null;
  generatedReport: string | null;
  isLoading: boolean;
  selectedModuleId: string | null;
}

export type Action =
  | { type: 'SELECT_ECO'; payload: ECO }
  | { type: 'SET_TAB'; payload: TabType }
  | { type: 'SET_ANALYSIS'; payload: AnalysisResult }
  | { type: 'SET_CODE'; payload: string }
  | { type: 'SET_TESTS'; payload: TestCase[] }
  | { type: 'SET_REPORT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CREATE_ECO'; payload: ECO }
  | { type: 'UPDATE_ECO_STATUS'; payload: { id: string; status: ECOStatus } }
  | { type: 'SELECT_MODULE'; payload: string | null };
