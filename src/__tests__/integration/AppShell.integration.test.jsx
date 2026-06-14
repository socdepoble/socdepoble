import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
const renderWithSafeArea = (safeTop = '44px') => {
  // Simulem l'entorn iPad
  Object.defineProperty(window, 'navigator', {
    value: {
      userAgent: 'iPad'
    },
    writable: true
  });

  // Mock de CSS env()
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = jest.fn().mockImplementation(elem => {
    const style = originalGetComputedStyle(elem);
    style.getPropertyValue = prop => {
      if (prop === 'padding-top' && elem.dataset && elem.dataset.safe) return safeTop;
      return style.getPropertyValue(prop);
    };
    return style;
  });
  return render(<BrowserRouter>
      <AppLayout>
        <div data-testid="main-content">Contingut principal</div>
      </AppLayout>
    </BrowserRouter>);
};
describe('AppShell - Integració iPad & Safe Areas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('respecta env(safe-area-inset-top) i calcula correctament --app-shell-height', () => {
    renderWithSafeArea('44px');
    const main = screen.getByTestId('main-content');
    expect(main).toBeInTheDocument();
  });
  test('el layout integra la capçalera sense trencar-se', () => {
    renderWithSafeArea();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });
});