import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';
describe('Button Component - Base Identity', () => {
  it('applies correct semantic variant classes for primary intent', () => {
    render(<Button intent="primary">Canonic Button</Button>);
    const button = screen.getByRole('button', {
      name: /canonic button/i
    });
    expect(button.className).toContain('bg-[var(--theme-accent-primary)]');
  });
  it('renders with correct accessibility focus outlines', () => {
    render(<Button intent="primary">Accessible</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('focus-visible:outline-2');
    expect(button.className).toContain('focus-visible:outline-[var(--theme-accent-primary)]');
  });
});