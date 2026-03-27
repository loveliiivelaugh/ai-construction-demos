import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders the headline and primary links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /build your next product fast/i })
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /view docs/i })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('link', { name: /example feature/i })).toHaveAttribute('href', '/example');
  });
});
