import { render, screen, fireEvent } from '@testing-library/react';
import { ExecutiveKpiCard } from './ExecutiveKpiCard';

describe('ExecutiveKpiCard', () => {
  it('renders label and value', () => {
    render(
      <ExecutiveKpiCard label="Revenue This Month" value="$78k" index={0} />
    );
    expect(screen.getByText('Revenue This Month')).toBeInTheDocument();
    expect(screen.getByText('$78k')).toBeInTheDocument();
  });

  it('renders positive delta with up arrow', () => {
    render(
      <ExecutiveKpiCard label="Test" value="100" delta={12.5} deltaPositiveIsGood index={0} />
    );
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('renders negative delta with down arrow', () => {
    render(
      <ExecutiveKpiCard label="Test" value="100" delta={-8.2} deltaPositiveIsGood index={0} />
    );
    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('-8.2%')).toBeInTheDocument();
  });

  it('renders microcopy text', () => {
    const copy = 'Based on 3 bids invoiced this month.';
    render(<ExecutiveKpiCard label="Test" value="50" microcopy={copy} index={0} />);
    expect(screen.getByText(copy)).toBeInTheDocument();
  });

  it('renders sparkline svg when trend has >= 2 points', () => {
    render(
      <ExecutiveKpiCard label="Test" value="50" trend={[10, 20, 30]} index={0} />
    );
    expect(screen.getByLabelText('trend sparkline')).toBeInTheDocument();
  });

  it('does not render sparkline when trend has fewer than 2 points', () => {
    render(
      <ExecutiveKpiCard label="Test" value="50" trend={[10]} index={0} />
    );
    expect(screen.queryByLabelText('trend sparkline')).not.toBeInTheDocument();
  });

  it('renders loading skeleton when status is loading', () => {
    const { container } = render(
      <ExecutiveKpiCard label="Test" status="loading" index={0} />
    );
    // Skeleton renders span elements; the value should not appear
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
  });

  it('renders error message when status is error', () => {
    render(
      <ExecutiveKpiCard label="Test" status="error" errorMessage="Failed to load" index={0} />
    );
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('renders default error message when status is error and no errorMessage', () => {
    render(<ExecutiveKpiCard label="Test" status="error" index={0} />);
    expect(screen.getByText('Unable to load data')).toBeInTheDocument();
  });

  it('renders empty state message when status is empty', () => {
    render(<ExecutiveKpiCard label="Test" status="empty" index={0} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(
      <ExecutiveKpiCard label="Test" value="50" onClick={handleClick} index={0} />
    );
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders icon badge when icon prop provided', () => {
    render(<ExecutiveKpiCard label="Test" value="50" icon="💵" index={0} />);
    expect(screen.getByText('💵')).toBeInTheDocument();
  });
});
