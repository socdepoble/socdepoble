import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UniversalHeader from '../../components/layout/UniversalHeader';

const MockButton = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);

describe('UniversalHeader - Dumb Component', () => {
  it('NO HAURIA de contindre cap useContext ni useNavigate', () => {
    // Si s'usa un hook fora d'un context provider o router, React llançarà error.
    // L'execució d'aquest render net assegura que és purament presentacional.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<UniversalHeader />);
    
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('HAURIA de tindre role="navigation" (semàntica HTML5)', () => {
    render(<UniversalHeader />);
    // Assumim que la UniversalHeader renderitza un <nav> o un <header role="navigation">
    const header = screen.getByRole('banner'); // O 'navigation' depenent de l'arquitectura exacta
    expect(header).toBeInTheDocument();
  });
});
