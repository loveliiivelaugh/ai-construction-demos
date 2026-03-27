import { create } from 'zustand';
import {
  mockJobs,
  mockBids,
  mockProjects,
  mockMaterials,
  mockWorkers,
  mockPayroll,
  mockContracts,
} from '../mock/constructionMockData';

export interface Job {
  id: string;
  title: string;
  jobType: 'Renovation' | 'New Build' | 'Repair' | 'Commercial';
  location: string;
  budget: number;
  description: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
}

export interface Bid {
  id: string;
  jobId: string;
  estimatedCost: number;
  materials: string[];
  timeline: string;
  status: 'pending' | 'generated' | 'sent';
}

export interface Task {
  id: string;
  phaseId: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'done';
}

export interface Phase {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  jobId: string;
  title: string;
  phases: Phase[];
  status: 'planning' | 'in-progress' | 'completed';
  progress: number;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  vendor: string;
  unitCost: number;
  status: 'needed' | 'ordered' | 'delivered';
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hoursLogged: number;
}

export interface Payroll {
  workerId: string;
  workerName: string;
  hoursLogged: number;
  hourlyRate: number;
  totalPay: number;
  period: string;
}

export interface Contract {
  id: string;
  jobId: string;
  title: string;
  status: 'draft' | 'sent' | 'signed';
  content: string;
}

interface ConstructionStoreState {
  jobs: Job[];
  bids: Bid[];
  projects: Project[];
  materials: Material[];
  workers: Worker[];
  payroll: Payroll[];
  contracts: Contract[];
  activeModule: string;
  isLoading: boolean;

  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'status'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  generateBid: (jobId: string) => Promise<void>;
  kickoffProject: (jobId: string) => Promise<void>;
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterialStatus: (id: string, status: Material['status']) => void;
  addWorker: (worker: Omit<Worker, 'id' | 'hoursLogged'>) => void;
  generatePayroll: (period: string) => Promise<void>;
  generateContract: (jobId: string) => Promise<void>;
  updateContractStatus: (id: string, status: Contract['status']) => void;
  setActiveModule: (module: string) => void;
  setLoading: (loading: boolean) => void;
}

const useConstructionStore = create<ConstructionStoreState>((set, get) => ({
  jobs: mockJobs,
  bids: mockBids,
  projects: mockProjects,
  materials: mockMaterials,
  workers: mockWorkers,
  payroll: mockPayroll,
  contracts: mockContracts,
  activeModule: 'dashboard',
  isLoading: false,

  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ jobs: [...state.jobs, newJob] }));
  },

  updateJob: (id, updates) => {
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    }));
  },

  generateBid: async (jobId) => {
    set({ isLoading: true });
    await new Promise((res) => setTimeout(res, 2000));
    const job = get().jobs.find((j) => j.id === jobId);
    if (!job) { set({ isLoading: false }); return; }

    const estimatedCost = Math.round(job.budget * (0.85 + Math.random() * 0.1));
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      jobId,
      estimatedCost,
      materials: ['mat-1', 'mat-3', 'mat-6'],
      timeline: `${Math.floor(6 + Math.random() * 6)} weeks`,
      status: 'generated',
    };
    set((state) => ({
      bids: [...state.bids, newBid],
      isLoading: false,
    }));
  },

  kickoffProject: async (jobId) => {
    set({ isLoading: true });
    await new Promise((res) => setTimeout(res, 1500));
    const job = get().jobs.find((j) => j.id === jobId);
    if (!job) { set({ isLoading: false }); return; }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      jobId,
      title: job.title,
      status: 'in-progress',
      progress: 0,
      phases: [
        {
          id: `phase-${Date.now()}-1`,
          name: 'Planning',
          tasks: [
            { id: `task-${Date.now()}-1`, phaseId: `phase-${Date.now()}-1`, title: 'Finalize design', assignee: 'Marcus Webb', status: 'todo' },
            { id: `task-${Date.now()}-2`, phaseId: `phase-${Date.now()}-1`, title: 'Obtain permits', assignee: 'Marcus Webb', status: 'todo' },
          ],
        },
        {
          id: `phase-${Date.now()}-2`,
          name: 'Materials',
          tasks: [
            { id: `task-${Date.now()}-3`, phaseId: `phase-${Date.now()}-2`, title: 'Order materials', assignee: 'Lisa Chen', status: 'todo' },
          ],
        },
        {
          id: `phase-${Date.now()}-3`,
          name: 'Build',
          tasks: [
            { id: `task-${Date.now()}-4`, phaseId: `phase-${Date.now()}-3`, title: 'Begin construction', assignee: 'Tom Rivera', status: 'todo' },
          ],
        },
        {
          id: `phase-${Date.now()}-4`,
          name: 'Inspection',
          tasks: [
            { id: `task-${Date.now()}-5`, phaseId: `phase-${Date.now()}-4`, title: 'Final inspection', assignee: 'Marcus Webb', status: 'todo' },
          ],
        },
      ],
    };
    set((state) => ({
      projects: [...state.projects, newProject],
      jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, status: 'active' } : j)),
      isLoading: false,
    }));
  },

  addMaterial: (materialData) => {
    const newMaterial: Material = { ...materialData, id: `mat-${Date.now()}` };
    set((state) => ({ materials: [...state.materials, newMaterial] }));
  },

  updateMaterialStatus: (id, status) => {
    set((state) => ({
      materials: state.materials.map((m) => (m.id === id ? { ...m, status } : m)),
    }));
  },

  addWorker: (workerData) => {
    const newWorker: Worker = { ...workerData, id: `worker-${Date.now()}`, hoursLogged: 0 };
    set((state) => ({ workers: [...state.workers, newWorker] }));
  },

  generatePayroll: async (period) => {
    set({ isLoading: true });
    await new Promise((res) => setTimeout(res, 2000));
    const workers = get().workers;
    const rates: Record<string, number> = { Foreman: 65, Electrician: 72, Carpenter: 58, Plumber: 70 };
    const newPayroll: Payroll[] = workers.map((w) => ({
      workerId: w.id,
      workerName: w.name,
      hoursLogged: w.hoursLogged,
      hourlyRate: rates[w.role] ?? 55,
      totalPay: w.hoursLogged * (rates[w.role] ?? 55),
      period,
    }));
    set({ payroll: newPayroll, isLoading: false });
  },

  generateContract: async (jobId) => {
    set({ isLoading: true });
    await new Promise((res) => setTimeout(res, 1500));
    const job = get().jobs.find((j) => j.id === jobId);
    if (!job) { set({ isLoading: false }); return; }

    const bid = get().bids.find((b) => b.jobId === jobId);
    const newContract: Contract = {
      id: `contract-${Date.now()}`,
      jobId,
      title: `${job.title} Contract`,
      status: 'draft',
      content: `CONSTRUCTION CONTRACT AGREEMENT\n\nThis Agreement is entered into between WoodwardStudio Construction LLC ("Contractor") and the property owner at ${job.location} ("Client").\n\nSCOPE OF WORK\n${job.description}\n\nCONTRACT PRICE\nTotal: $${bid ? bid.estimatedCost.toLocaleString() : job.budget.toLocaleString()}\nTimeline: ${bid?.timeline ?? 'TBD'}\n\nSIGNATURES\n_______________________          _______________________\nContractor                        Client`,
    };
    set((state) => ({ contracts: [...state.contracts, newContract], isLoading: false }));
  },

  updateContractStatus: (id, status) => {
    set((state) => ({
      contracts: state.contracts.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  },

  setActiveModule: (module) => set({ activeModule: module }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export { useConstructionStore };
