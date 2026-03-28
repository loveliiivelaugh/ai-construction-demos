import type { Job, Bid, Project, Material, Worker, Payroll, Contract, KpiData, ActionRecommendation, CopperPriceData } from '../store/constructionStore';

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Master Kitchen Remodel',
    jobType: 'Renovation',
    location: '142 Maple St, Austin TX',
    budget: 45000,
    description: 'Full kitchen gut and remodel including cabinets, countertops, appliances, and flooring.',
    status: 'active',
    createdAt: '2024-05-01',
  },
  {
    id: 'job-2',
    title: 'Outdoor Cedar Deck Build',
    jobType: 'New Build',
    location: '88 Pine Ave, Denver CO',
    budget: 22000,
    description: '600 sq ft cedar deck with railing, stairs, and built-in seating.',
    status: 'pending',
    createdAt: '2024-05-10',
  },
  {
    id: 'job-3',
    title: 'Primary Bathroom Renovation',
    jobType: 'Renovation',
    location: '310 Oak Blvd, Seattle WA',
    budget: 18500,
    description: 'Luxury bathroom renovation with heated floors, new vanity, walk-in shower, and soaking tub.',
    status: 'pending',
    createdAt: '2024-05-15',
  },
];

export const mockBids: Bid[] = [
  {
    id: 'bid-1',
    jobId: 'job-1',
    estimatedCost: 41200,
    materials: ['mat-1', 'mat-3', 'mat-5', 'mat-6'],
    timeline: '10 weeks',
    status: 'sent',
  },
  {
    id: 'bid-2',
    jobId: 'job-2',
    estimatedCost: 19800,
    materials: ['mat-1', 'mat-2', 'mat-6'],
    timeline: '6 weeks',
    status: 'generated',
  },
  {
    id: 'bid-3',
    jobId: 'job-3',
    estimatedCost: 17100,
    materials: ['mat-3', 'mat-4', 'mat-5', 'mat-6'],
    timeline: '8 weeks',
    status: 'pending',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    jobId: 'job-1',
    title: 'Master Kitchen Remodel',
    status: 'in-progress',
    progress: 45,
    phases: [
      {
        id: 'phase-1-1',
        name: 'Planning',
        tasks: [
          { id: 'task-1', phaseId: 'phase-1-1', title: 'Finalize design drawings', assignee: 'Marcus Webb', status: 'done' },
          { id: 'task-2', phaseId: 'phase-1-1', title: 'Obtain building permits', assignee: 'Marcus Webb', status: 'done' },
          { id: 'task-3', phaseId: 'phase-1-1', title: 'Confirm material orders', assignee: 'Lisa Chen', status: 'done' },
        ],
      },
      {
        id: 'phase-1-2',
        name: 'Materials',
        tasks: [
          { id: 'task-4', phaseId: 'phase-1-2', title: 'Receive cabinet order', assignee: 'Lisa Chen', status: 'done' },
          { id: 'task-5', phaseId: 'phase-1-2', title: 'Countertop slab delivery', assignee: 'Lisa Chen', status: 'in-progress' },
          { id: 'task-6', phaseId: 'phase-1-2', title: 'Appliance staging', assignee: 'Tom Rivera', status: 'todo' },
        ],
      },
      {
        id: 'phase-1-3',
        name: 'Build',
        tasks: [
          { id: 'task-7', phaseId: 'phase-1-3', title: 'Demolition & rough-in', assignee: 'Tom Rivera', status: 'in-progress' },
          { id: 'task-8', phaseId: 'phase-1-3', title: 'Electrical rough-in', assignee: 'Dana Park', status: 'in-progress' },
          { id: 'task-9', phaseId: 'phase-1-3', title: 'Cabinet installation', assignee: 'Tom Rivera', status: 'todo' },
          { id: 'task-10', phaseId: 'phase-1-3', title: 'Tile backsplash', assignee: 'Tom Rivera', status: 'todo' },
        ],
      },
      {
        id: 'phase-1-4',
        name: 'Inspection',
        tasks: [
          { id: 'task-11', phaseId: 'phase-1-4', title: 'Final electrical inspection', assignee: 'Dana Park', status: 'todo' },
          { id: 'task-12', phaseId: 'phase-1-4', title: 'City permit sign-off', assignee: 'Marcus Webb', status: 'todo' },
        ],
      },
    ],
  },
  {
    id: 'proj-2',
    jobId: 'job-2',
    title: 'Outdoor Cedar Deck Build',
    status: 'in-progress',
    progress: 20,
    phases: [
      {
        id: 'phase-2-1',
        name: 'Planning',
        tasks: [
          { id: 'task-13', phaseId: 'phase-2-1', title: 'Site survey & staking', assignee: 'Marcus Webb', status: 'done' },
          { id: 'task-14', phaseId: 'phase-2-1', title: 'HOA approval', assignee: 'Marcus Webb', status: 'done' },
        ],
      },
      {
        id: 'phase-2-2',
        name: 'Materials',
        tasks: [
          { id: 'task-15', phaseId: 'phase-2-2', title: 'Cedar lumber order', assignee: 'Lisa Chen', status: 'in-progress' },
          { id: 'task-16', phaseId: 'phase-2-2', title: 'Concrete footings supply', assignee: 'Lisa Chen', status: 'todo' },
        ],
      },
      {
        id: 'phase-2-3',
        name: 'Build',
        tasks: [
          { id: 'task-17', phaseId: 'phase-2-3', title: 'Pour concrete footings', assignee: 'Tom Rivera', status: 'todo' },
          { id: 'task-18', phaseId: 'phase-2-3', title: 'Frame deck structure', assignee: 'Tom Rivera', status: 'todo' },
          { id: 'task-19', phaseId: 'phase-2-3', title: 'Install decking boards', assignee: 'Tom Rivera', status: 'todo' },
          { id: 'task-20', phaseId: 'phase-2-3', title: 'Railing & stairs', assignee: 'Tom Rivera', status: 'todo' },
        ],
      },
      {
        id: 'phase-2-4',
        name: 'Inspection',
        tasks: [
          { id: 'task-21', phaseId: 'phase-2-4', title: 'Structural inspection', assignee: 'Marcus Webb', status: 'todo' },
          { id: 'task-22', phaseId: 'phase-2-4', title: 'Client walkthrough', assignee: 'Marcus Webb', status: 'todo' },
        ],
      },
    ],
  },
];

export const mockMaterials: Material[] = [
  {
    id: 'mat-1',
    name: 'Cedar Lumber 2x6x12',
    quantity: 120,
    unit: 'boards',
    vendor: 'Pacific Lumber Co.',
    unitCost: 18.5,
    status: 'ordered',
  },
  {
    id: 'mat-2',
    name: 'Concrete Mix 80lb',
    quantity: 40,
    unit: 'bags',
    vendor: 'BuildRight Supply',
    unitCost: 9.25,
    status: 'delivered',
  },
  {
    id: 'mat-3',
    name: 'Porcelain Floor Tile 12x24',
    quantity: 320,
    unit: 'sq ft',
    vendor: 'TileWorld Pro',
    unitCost: 4.75,
    status: 'ordered',
  },
  {
    id: 'mat-4',
    name: 'Electrical Wire 12AWG',
    quantity: 500,
    unit: 'ft',
    vendor: 'ElecPro Supply',
    unitCost: 0.85,
    status: 'delivered',
  },
  {
    id: 'mat-5',
    name: 'PEX Plumbing Tubing 1/2"',
    quantity: 200,
    unit: 'ft',
    vendor: 'PlumbRight Co.',
    unitCost: 1.2,
    status: 'needed',
  },
  {
    id: 'mat-6',
    name: 'Interior Paint - Eggshell',
    quantity: 15,
    unit: 'gallons',
    vendor: 'ColorMaster Paints',
    unitCost: 42.0,
    status: 'needed',
  },
];

export const mockWorkers: Worker[] = [
  {
    id: 'worker-1',
    name: 'Marcus Webb',
    role: 'Foreman',
    email: 'marcus.webb@woodwardstudio.com',
    phone: '(512) 555-0142',
    hoursLogged: 42,
  },
  {
    id: 'worker-2',
    name: 'Dana Park',
    role: 'Electrician',
    email: 'dana.park@woodwardstudio.com',
    phone: '(512) 555-0198',
    hoursLogged: 38,
  },
  {
    id: 'worker-3',
    name: 'Tom Rivera',
    role: 'Carpenter',
    email: 'tom.rivera@woodwardstudio.com',
    phone: '(512) 555-0231',
    hoursLogged: 44,
  },
  {
    id: 'worker-4',
    name: 'Lisa Chen',
    role: 'Plumber',
    email: 'lisa.chen@woodwardstudio.com',
    phone: '(512) 555-0187',
    hoursLogged: 36,
  },
];

export const mockPayroll: Payroll[] = [
  { workerId: 'worker-1', workerName: 'Marcus Webb', hoursLogged: 42, hourlyRate: 65, totalPay: 2730, period: 'This Week' },
  { workerId: 'worker-2', workerName: 'Dana Park', hoursLogged: 38, hourlyRate: 72, totalPay: 2736, period: 'This Week' },
  { workerId: 'worker-3', workerName: 'Tom Rivera', hoursLogged: 44, hourlyRate: 58, totalPay: 2552, period: 'This Week' },
  { workerId: 'worker-4', workerName: 'Lisa Chen', hoursLogged: 36, hourlyRate: 70, totalPay: 2520, period: 'This Week' },
];

export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    jobId: 'job-1',
    title: 'Kitchen Remodel Agreement',
    status: 'sent',
    content: `CONSTRUCTION CONTRACT AGREEMENT

This Construction Contract Agreement ("Agreement") is entered into as of May 1, 2024, between WoodwardStudio Construction LLC ("Contractor") and the property owner at 142 Maple St, Austin TX ("Client").

SCOPE OF WORK
Contractor agrees to perform the following work: Full kitchen gut and remodel including demo of existing kitchen, installation of new cabinets, quartz countertops, tile backsplash, hardwood flooring, and all associated electrical and plumbing work.

CONTRACT PRICE
Total contract price: $41,200.00
Payment schedule:
  - 30% deposit upon signing: $12,360.00
  - 40% at milestone completion: $16,480.00
  - 30% final payment: $12,360.00

TIMELINE
Work shall commence within 7 days of permit approval and be substantially completed within 10 weeks.

WARRANTIES
Contractor warrants all work for a period of one (1) year from completion date.

SIGNATURES
_______________________          _______________________
Contractor                        Client`,
  },
  {
    id: 'contract-2',
    jobId: 'job-2',
    title: 'Cedar Deck Construction Contract',
    status: 'draft',
    content: `CONSTRUCTION CONTRACT AGREEMENT

This Construction Contract Agreement ("Agreement") is entered into as of May 10, 2024, between WoodwardStudio Construction LLC ("Contractor") and the property owner at 88 Pine Ave, Denver CO ("Client").

SCOPE OF WORK
Contractor agrees to perform the following work: Construction of a 600 sq ft cedar deck with railing, stairs, and built-in seating per approved design drawings.

CONTRACT PRICE
Total contract price: $19,800.00
Payment schedule:
  - 25% deposit upon signing: $4,950.00
  - 50% at framing completion: $9,900.00
  - 25% final payment: $4,950.00

TIMELINE
Work shall commence within 5 days of permit approval and be substantially completed within 6 weeks.

WARRANTIES
Contractor warrants all work for a period of two (2) years from completion date.

SIGNATURES
_______________________          _______________________
Contractor                        Client`,
  },
];

/**
 * Mock KPI data used by the Executive Dashboard top-row cards.
 * `trend` is a chronological array (oldest → newest) of normalized values.
 * `delta` is the percent change vs prior period.
 */
export const mockKpis: KpiData[] = [
  {
    id: 'revenue-this-month',
    label: 'Revenue This Month',
    value: '$78k',
    delta: 12.5,
    deltaPositiveIsGood: true,
    trend: [52, 58, 61, 55, 67, 71, 78],
    microcopy: 'Based on 3 bids invoiced this month. Up from $69k last month.',
    icon: '💵',
    color: 'success',
    drilldownPath: '/construction/bidding',
  },
  {
    id: 'open-estimates-value',
    label: 'Open Estimates Value',
    value: '$36k',
    delta: -8.2,
    deltaPositiveIsGood: false,
    trend: [44, 41, 48, 39, 37, 40, 36],
    microcopy: '2 pending bids awaiting client approval. Conversion rate: 67%.',
    icon: '📋',
    color: 'warning',
    drilldownPath: '/construction/bidding',
  },
  {
    id: 'jobs-at-risk',
    label: 'Jobs at Risk',
    value: 1,
    delta: 0,
    deltaPositiveIsGood: false,
    trend: [0, 1, 0, 2, 1, 1, 1],
    microcopy: '1 job is behind schedule or over budget. Review recommended.',
    icon: '⚠️',
    color: 'error',
    drilldownPath: '/construction/crm',
  },
  {
    id: 'overdue-invoices',
    label: 'Overdue Invoices',
    value: '$12k',
    delta: -5.0,
    deltaPositiveIsGood: false,
    trend: [18, 16, 14, 15, 13, 14, 12],
    microcopy: '2 invoices past due 30+ days. Follow up with clients.',
    icon: '🧾',
    color: 'error',
    drilldownPath: '/construction/contracts',
  },
  {
    id: 'gross-margin-exposure',
    label: 'Gross Margin Exposure',
    value: '22%',
    delta: -3.1,
    deltaPositiveIsGood: false,
    trend: [28, 26, 25, 27, 24, 23, 22],
    microcopy: 'Material cost overruns on 2 jobs are compressing margins.',
    icon: '📉',
    color: 'warning',
    drilldownPath: '/construction/materials',
  },
  {
    id: 'crew-utilization',
    label: 'Crew Utilization',
    value: '82%',
    delta: 4.3,
    deltaPositiveIsGood: true,
    trend: [70, 74, 72, 76, 79, 80, 82],
    microcopy: '4 of 4 crew members actively assigned. Target: ≥ 85%.',
    icon: '👷',
    color: 'info',
    drilldownPath: '/construction/workforce',
  },
];

// ---------------------------------------------------------------------------
// Suggested Next Actions (AI Recommendations)
// ---------------------------------------------------------------------------
export const mockActionRecommendations: ActionRecommendation[] = [
  {
    id: 'action-1',
    rank: 1,
    type: 'reprice',
    title: 'Reprice copper-sensitive estimates',
    reason:
      'Copper spot price has risen 14% over the past 30 days. Two open bids (Kitchen Remodel, Cedar Deck) include wiring materials priced at the old rate — estimated exposure is ~$2,400.',
    urgency: 'critical',
    confidence: 92,
    icon: '📈',
    linkedEntities: [
      { id: 'bid-1', label: 'Kitchen Remodel Bid', type: 'bid', path: '/construction/bidding' },
      { id: 'bid-2', label: 'Cedar Deck Bid', type: 'bid', path: '/construction/bidding' },
      { id: 'mat-4', label: 'Electrical Wire 12AWG', type: 'material', path: '/construction/materials' },
    ],
    primaryCta: {
      label: 'Review Bids',
      variant: 'contained',
      path: '/construction/bidding',
    },
    secondaryCta: {
      label: 'Run with Agent',
      variant: 'outlined',
      agentAction: 'reprice-copper-estimates',
    },
  },
  {
    id: 'action-2',
    rank: 2,
    type: 'follow-up',
    title: 'Follow up on unsigned proposals',
    reason:
      'The Cedar Deck contract has been in "draft" status for 12 days without client signature. Deals unsigned past 14 days have a 40% lower close rate.',
    urgency: 'high',
    confidence: 87,
    icon: '✍️',
    linkedEntities: [
      { id: 'contract-2', label: 'Cedar Deck Construction Contract', type: 'contract', path: '/construction/contracts' },
      { id: 'job-2', label: 'Outdoor Cedar Deck Build', type: 'job', path: '/construction/crm' },
    ],
    primaryCta: {
      label: 'View Contract',
      variant: 'contained',
      path: '/construction/contracts',
    },
    secondaryCta: {
      label: 'Draft Follow-up',
      variant: 'outlined',
      agentAction: 'draft-client-followup',
    },
  },
  {
    id: 'action-3',
    rank: 3,
    type: 'invoice',
    title: 'Send overdue invoice reminders',
    reason:
      '$12k in invoices are past 30 days due. Two clients have not responded to the initial invoice. Sending a reminder now recovers payment 2× faster on average.',
    urgency: 'high',
    confidence: 95,
    icon: '🧾',
    linkedEntities: [
      { id: 'job-1', label: 'Master Kitchen Remodel', type: 'job', path: '/construction/crm' },
    ],
    primaryCta: {
      label: 'View Invoices',
      variant: 'contained',
      path: '/construction/contracts',
    },
    secondaryCta: {
      label: 'Send Reminders',
      variant: 'outlined',
      agentAction: 'send-invoice-reminders',
    },
  },
  {
    id: 'action-4',
    rank: 4,
    type: 'review',
    title: 'Review over-budget jobs',
    reason:
      '1 job is tracking 8% over its original budget due to material cost overruns on tile and plumbing. Early review prevents margin erosion before final billing.',
    urgency: 'medium',
    confidence: 81,
    icon: '⚠️',
    linkedEntities: [
      { id: 'job-3', label: 'Primary Bathroom Renovation', type: 'job', path: '/construction/crm' },
      { id: 'mat-3', label: 'Porcelain Floor Tile 12x24', type: 'material', path: '/construction/materials' },
      { id: 'mat-5', label: 'PEX Plumbing Tubing 1/2"', type: 'material', path: '/construction/materials' },
    ],
    primaryCta: {
      label: 'View Job',
      variant: 'contained',
      path: '/construction/crm',
    },
    secondaryCta: {
      label: 'Analyze Budget',
      variant: 'outlined',
      agentAction: 'analyze-budget-overrun',
    },
  },
  {
    id: 'action-5',
    rank: 5,
    type: 'resolve',
    title: 'Resolve missing timesheets',
    reason:
      'Tom Rivera has not submitted a timesheet for 3 days on the Cedar Deck project. Missing timesheets delay payroll and can cause billing discrepancies.',
    urgency: 'medium',
    confidence: 78,
    icon: '🕐',
    linkedEntities: [
      { id: 'worker-3', label: 'Tom Rivera', type: 'worker', path: '/construction/workforce' },
      { id: 'proj-2', label: 'Outdoor Cedar Deck Build', type: 'project', path: '/construction/projects' },
    ],
    primaryCta: {
      label: 'View Workforce',
      variant: 'contained',
      path: '/construction/workforce',
    },
    secondaryCta: {
      label: 'Notify Worker',
      variant: 'outlined',
      agentAction: 'notify-missing-timesheet',
    },
  },
];

// ---------------------------------------------------------------------------
// Copper Price Mock Data
// Prices in USD per pound, last 30 days (oldest → newest)
// ---------------------------------------------------------------------------
function buildCopperPrices(): CopperPriceData['points'] {
  const base = 3.82;
  const prices = [
    3.82, 3.79, 3.81, 3.84, 3.86, 3.88, 3.85, 3.87, 3.91, 3.94,
    3.96, 3.93, 3.98, 4.01, 3.99, 4.02, 4.05, 4.08, 4.06, 4.09,
    4.12, 4.10, 4.14, 4.17, 4.15, 4.19, 4.22, 4.20, 4.24, 4.35,
  ];
  const today = new Date('2024-05-28');
  return prices.map((pricePerLb, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (prices.length - 1 - i));
    return {
      date: d.toISOString().split('T')[0],
      pricePerLb,
    };
  });
  void base;
}

export const mockCopperPriceData: CopperPriceData = {
  points: buildCopperPrices(),
  currentPrice: 4.35,
  priceMonthAgo: 3.82,
  estimatedImpact: 2400,
  lastUpdated: '2024-05-28T09:00:00Z',
};
