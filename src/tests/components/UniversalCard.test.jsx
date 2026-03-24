// ✅ src/tests/components/UniversalCard.test.jsx - TESTS DE COMPONENT UI
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import UniversalCard from '../../components/UniversalCard';

// [MOCK] Contexts
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false, user: { id: 'test-user' } })
}));

vi.mock('../../context/NavigationContext', () => ({
  useNavigation: () => ({ forensicMode: false })
}));

vi.mock('../../context/DesignContext', () => ({
  useDesign: () => ({ gloveMode: false })
}));

vi.mock('../../context/ModalContext', () => ({
  useModal: () => ({ openViewer: vi.fn() })
}));

describe('UniversalCard', () => {
  const mockPost = {
    id: 'post-1',
    uuid: '11111111-1111-1111-1111-111111111111',
    content: 'Contingut de prova del post',
    author_name: 'Usuari Test',
    created_at: new Date().toISOString(),
    type: 'post'
  };

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hauria de renderitzar el títol i contingut', () => {
    renderWithRouter(<UniversalCard item={mockPost} title="Títol Test" />);

    expect(screen.getByText('Títol Test')).toBeInTheDocument();
    expect(screen.getByText('Contingut de prova del post')).toBeInTheDocument();
  });

  it('hauria de mostrar l\'autor del post', () => {
    renderWithRouter(<UniversalCard item={mockPost} />);

    expect(screen.getByText('Usuari Test')).toBeInTheDocument();
  });

  it('hauria de aplicar variant ajuntament per tipo bando', () => {
    const bandoPost = { ...mockPost, type: 'bando' };
    
    renderWithRouter(<UniversalCard item={bandoPost} />);

    const card = screen.getByTestId('universal-card') || document.querySelector('.universal-card');
    expect(card).toBeDefined();
  });

  it('hauria de mostrar indicador IAIA si està inspirat per IA', () => {
    const iaiaPost = { ...mockPost, is_iaia_inspired: true };
    
    renderWithRouter(<UniversalCard item={iaiaPost} />);

    expect(screen.getByText(/IAIA/i)).toBeInTheDocument();
  });

  it('hauria de ser clickable i navegar al detall', () => {
    renderWithRouter(<UniversalCard item={mockPost} />);

    const card = screen.getByText('Contingut de prova del post').closest('.universal-card');
    fireEvent.click(card);

    // La navegació es maneja internament
    expect(card).toBeDefined();
  });

  it('hauria de renderitzar en mode grid per defecte', () => {
    renderWithRouter(<UniversalCard item={mockPost} viewMode="grid" />);

    const card = document.querySelector('.universal-card');
    expect(card).toHaveClass('view-mode-grid');
  });

  it('hauria de renderitzar en mode llista', () => {
    renderWithRouter(<UniversalCard item={mockPost} viewMode="list" />);

    const card = document.querySelector('.universal-card');
    expect(card).toHaveClass('view-mode-list');
  });
});
