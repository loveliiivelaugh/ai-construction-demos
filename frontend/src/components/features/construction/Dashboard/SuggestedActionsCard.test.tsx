import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SuggestedActionsCard } from './SuggestedActionsCard';
import type { ActionRecommendation } from '../../../../utilities/store/constructionStore';

const mockActions: ActionRecommendation[] = [
  {
    id: 'action-1',
    rank: 1,
    type: 'reprice',
    title: 'Reprice copper-sensitive estimates',
    reason: 'Copper spot price has risen 14% over the past 30 days.',
    urgency: 'critical',
    confidence: 92,
    icon: '📈',
    linkedEntities: [
      { id: 'bid-1', label: 'Kitchen Remodel Bid', type: 'bid', path: '/construction/bidding' },
    ],
    primaryCta: { label: 'Review Bids', variant: 'contained', path: '/construction/bidding' },
    secondaryCta: { label: 'Run with Agent', variant: 'outlined', agentAction: 'reprice-copper-estimates' },
  },
  {
    id: 'action-2',
    rank: 2,
    type: 'follow-up',
    title: 'Follow up on unsigned proposals',
    reason: 'The Cedar Deck contract has been in "draft" status for 12 days.',
    urgency: 'high',
    confidence: 87,
    icon: '✍️',
    linkedEntities: [],
    primaryCta: { label: 'View Contract', variant: 'contained', path: '/construction/contracts' },
  },
];

function renderCard(props: Partial<Parameters<typeof SuggestedActionsCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <SuggestedActionsCard actions={mockActions} {...props} />
    </MemoryRouter>
  );
}

describe('SuggestedActionsCard', () => {
  it('renders the card header', () => {
    renderCard();
    expect(screen.getByTestId('suggested-actions-card')).toBeInTheDocument();
    expect(screen.getByText('Suggested Next Actions')).toBeInTheDocument();
  });

  it('uses a custom title when provided', () => {
    renderCard({ title: 'AI Recommendations' });
    expect(screen.getByText('AI Recommendations')).toBeInTheDocument();
  });

  it('shows action count chip', () => {
    renderCard();
    expect(screen.getByText('2 actions')).toBeInTheDocument();
  });

  it('renders action titles', () => {
    renderCard();
    expect(screen.getByText('Reprice copper-sensitive estimates')).toBeInTheDocument();
    expect(screen.getByText('Follow up on unsigned proposals')).toBeInTheDocument();
  });

  it('renders urgency chips for each action', () => {
    renderCard();
    expect(screen.getByTestId('urgency-chip-action-1')).toBeInTheDocument();
    expect(screen.getByTestId('urgency-chip-action-2')).toBeInTheDocument();
  });

  it('renders confidence bars', () => {
    renderCard();
    const bars = screen.getAllByTestId('confidence-bar');
    expect(bars).toHaveLength(2);
  });

  it('renders confidence percentages', () => {
    renderCard();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('87%')).toBeInTheDocument();
  });

  it('renders primary CTA buttons', () => {
    renderCard();
    expect(screen.getByText('Review Bids')).toBeInTheDocument();
    expect(screen.getByText('View Contract')).toBeInTheDocument();
  });

  it('renders secondary agent CTA button', () => {
    renderCard();
    expect(screen.getByTestId('secondary-cta-action-1')).toBeInTheDocument();
    expect(screen.getByText('Run with Agent')).toBeInTheDocument();
  });

  it('calls onAgentAction when agent CTA is clicked', () => {
    const onAgentAction = vi.fn();
    renderCard({ onAgentAction });
    fireEvent.click(screen.getByTestId('secondary-cta-action-1'));
    expect(onAgentAction).toHaveBeenCalledTimes(1);
    expect(onAgentAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'action-1' }),
      'reprice-copper-estimates'
    );
  });

  it('renders action icons', () => {
    renderCard();
    expect(screen.getByText('📈')).toBeInTheDocument();
    expect(screen.getByText('✍️')).toBeInTheDocument();
  });

  it('renders rank badges', () => {
    renderCard();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows empty state when actions array is empty', () => {
    renderCard({ actions: [] });
    expect(screen.getByText(/All caught up/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderCard({ loading: true });
    expect(screen.getByText(/Analyzing your portfolio/i)).toBeInTheDocument();
    expect(screen.queryByText('Reprice copper-sensitive estimates')).not.toBeInTheDocument();
  });

  it('sorts actions by rank', () => {
    const reversed = [...mockActions].reverse();
    renderCard({ actions: reversed });
    const titles = screen.getAllByText(/Reprice|Follow up/);
    // Even though actions were passed reversed, rank 1 should appear first
    expect(titles[0]).toHaveTextContent('Reprice copper-sensitive estimates');
  });

  it('expands reason text when "More" is clicked', () => {
    renderCard();
    const moreButtons = screen.getAllByText('▼ More');
    fireEvent.click(moreButtons[0]);
    // After expansion the button should read "Less"
    expect(screen.getByText('▲ Less')).toBeInTheDocument();
  });
});
