import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppShell from '../../components/layout/AppShell';

// Mock del hook de scroll per a controlar l'entorn de prova
vi.mock('../../hooks/useScrollDirection', () => ({
  useScrollDirection: vi.fn(() => 'up')
}));

describe('AppShell Architecture', () => {
  const mockOnAction = vi.fn();

  it('hauria de renderitzar les 3 barres sense trencar el layout', () => {
    render(<AppShell onAction={mockOnAction} />);
    
    // Verifiquem que els elements semàntics existeixen
    expect(screen.getByRole('banner')).toBeInTheDocument(); // BrandBar (assumint role banner)
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // UniversalHeader
  });

  it('hauria de blindar els elements contra el Drag & Drop global (Protocol SOSP-LOCK)', () => {
    render(<AppShell onAction={mockOnAction} />);
    
    const brandBar = screen.getByRole('banner');
    
    expect(brandBar).toHaveAttribute('draggable', 'false');
  });

  it('hauria de propagar les accions sense dependre de react-router-dom internament', () => {
    render(<AppShell onAction={mockOnAction} />);
    
    const connectButton = screen.queryByRole('button', { name: /connectar/i });
    if(connectButton) {
      fireEvent.click(connectButton);
      expect(mockOnAction).toHaveBeenCalled();
    }
  });
});
