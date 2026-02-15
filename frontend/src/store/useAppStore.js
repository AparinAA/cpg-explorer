import { create } from 'zustand';
import { callgraphApi, sourceApi, packagesApi } from '../api';
import { VIEWS, DEFAULTS } from '../shared/constants';

export const useAppStore = create((set, get) => ({
  view: VIEWS.CALLGRAPH,

  selectedFunction: null,

  graphData: null,
  graphLoading: false,
  graphError: null,

  sourceData: null,
  highlightLine: null,

  packages: [],
  packagesLoaded: false,

  packageGraphData: null,
  packageGraphLoading: false,
  selectedPackage: null,

  maxNodes: DEFAULTS.callgraphMaxNodes,

  setMaxNodes: maxNodes => {
    set({ maxNodes });
    const state = get();
    if (state.view === VIEWS.PACKAGES && state.packageGraphData) {
      state.loadPackageGraph(state.selectedPackage);
    } else if (state.selectedFunction) {
      state.selectFunction(state.selectedFunction);
    }
  },

  setView: view => {
    set({ view });
    if (view === VIEWS.PACKAGES) {
      get().loadPackageGraph();
    }
  },

  loadPackageGraph: async (rootPackage = null) => {
    set({ packageGraphLoading: true, selectedPackage: rootPackage });

    try {
      const data = await packagesApi.getGraph({
        root: rootPackage,
        depth: DEFAULTS.packageGraphDepth,
        maxNodes: get().maxNodes,
      });
      set({
        packageGraphData: data,
        packageGraphLoading: false,
      });
    } catch (error) {
      console.error('Failed to load package graph:', error);
      set({ packageGraphLoading: false });
    }
  },

  loadPackages: async () => {
    if (get().packagesLoaded) return;

    try {
      const data = await packagesApi.getAll();
      set({
        packages: data.packages || [],
        packagesLoaded: true,
      });
    } catch (error) {
      console.error('Failed to load packages:', error);
    }
  },

  selectFunction: async func => {
    set({
      selectedFunction: func,
      graphLoading: true,
      graphError: null,
    });

    try {
      const graphData = await callgraphApi.get(func.id, {
        depth: DEFAULTS.callgraphDepth,
        maxNodes: get().maxNodes,
      });
      set({ graphData, graphLoading: false });

      if (func.file) {
        get().loadSource(func.file, func.line);
      }
    } catch (error) {
      set({
        graphError: error.message,
        graphLoading: false,
      });
    }
  },

  loadSource: async (file, line = null) => {
    try {
      const sourceData = await sourceApi.get(file);
      set({
        sourceData,
        highlightLine: line,
      });
    } catch (error) {
      console.error('Failed to load source:', error);
    }
  },

  handleNodeClick: node => {
    if (node.file) {
      get().loadSource(node.file, node.line);
    }
  },

  handleNodeDoubleClick: async node => {
    if (node.kind === 'package') {
      await get().loadPackageGraph(node.id);
    } else if (node.kind === 'function' || node.kind === 'method') {
      await get().selectFunction(node);
    }
  },

  reset: () =>
    set({
      selectedFunction: null,
      graphData: null,
      graphError: null,
      sourceData: null,
      highlightLine: null,
    }),
}));
