import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders a progress indicator', () => {
    render(<Loader />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
