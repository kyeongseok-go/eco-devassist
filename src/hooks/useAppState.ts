import { useReducer } from 'react';
import type { AppState, Action } from '../types';
import { mockECOs } from '../data/mockECOs';

const initialState: AppState = {
  ecos: [...mockECOs],
  selectedECO: null,
  activeTab: 'dashboard',
  analysisResult: null,
  generatedCode: null,
  generatedTests: null,
  generatedReport: null,
  isLoading: false,
  selectedModuleId: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_ECO':
      return { ...state, selectedECO: action.payload };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, analysisResult: action.payload, isLoading: false };
    case 'SET_CODE':
      return { ...state, generatedCode: action.payload, isLoading: false };
    case 'SET_TESTS':
      return { ...state, generatedTests: action.payload, isLoading: false };
    case 'SET_REPORT':
      return { ...state, generatedReport: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CREATE_ECO':
      return { ...state, ecos: [...state.ecos, action.payload] };
    case 'UPDATE_ECO_STATUS':
      return {
        ...state,
        ecos: state.ecos.map((e) =>
          e.id === action.payload.id ? { ...e, status: action.payload.status } : e
        ),
      };
    case 'SELECT_MODULE':
      return { ...state, selectedModuleId: action.payload };
    default:
      return state;
  }
}

export function useAppState() {
  return useReducer(appReducer, initialState);
}
