import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { TabBar } from './components/Layout/TabBar';
import { ECODashboard } from './components/ECO/ECODashboard';
import { ImpactAnalyzer } from './components/Analysis/ImpactAnalyzer';
import { CodeGenerator } from './components/CodeGen/CodeGenerator';
import { TestGenerator } from './components/TestGen/TestGenerator';
import { ReportGenerator } from './components/Report/ReportGenerator';
import { KnowledgeSearch } from './components/Knowledge/KnowledgeSearch';
import { useAppState } from './hooks/useAppState';
import type { TabType } from './types';

function App() {
  const [state, dispatch] = useAppState();
  const [selectedBOMId, setSelectedBOMId] = useState<string | null>(null);

  const renderTab = () => {
    switch (state.activeTab) {
      case 'dashboard':
        return <ECODashboard ecos={state.ecos} selectedECO={state.selectedECO} dispatch={dispatch} />;
      case 'analysis':
        return <ImpactAnalyzer selectedECO={state.selectedECO} analysisResult={state.analysisResult} isLoading={state.isLoading} dispatch={dispatch} />;
      case 'codegen':
        return <CodeGenerator selectedECO={state.selectedECO} analysisResult={state.analysisResult} generatedCode={state.generatedCode} isLoading={state.isLoading} selectedModuleId={state.selectedModuleId} dispatch={dispatch} />;
      case 'testgen':
        return <TestGenerator selectedECO={state.selectedECO} generatedCode={state.generatedCode} generatedTests={state.generatedTests} isLoading={state.isLoading} selectedModuleId={state.selectedModuleId} dispatch={dispatch} />;
      case 'report':
        return <ReportGenerator selectedECO={state.selectedECO} analysisResult={state.analysisResult} generatedCode={state.generatedCode} generatedTests={state.generatedTests} generatedReport={state.generatedReport} isLoading={state.isLoading} dispatch={dispatch} />;
      case 'knowledge':
        return <KnowledgeSearch />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-navy-950">
      <Header />
      <TabBar activeTab={state.activeTab} onTabChange={(tab: TabType) => dispatch({ type: 'SET_TAB', payload: tab })} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedBOMId={selectedBOMId} onSelectBOM={setSelectedBOMId} />
        {renderTab()}
      </div>
    </div>
  );
}

export default App;
