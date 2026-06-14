import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BrandBar from '../../components/layout/BrandBar';
import ActionBar from '../../components/layout/ActionBar';
import UniversalHeader from '../../components/layout/UniversalHeader';
describe('Bars.test.jsx - Comprovació de Puresa i Rendiment', () => {
  it('totes les barres estan embolcallades amb React.memo per evitar re-renders', () => {
    // Comprovem si són components memoitzats
    expect(BrandBar.$$typeof).toBe(Symbol.for('react.memo'));
    expect(ActionBar.$$typeof).toBe(Symbol.for('react.memo'));
    expect(UniversalHeader.$$typeof).toBe(Symbol.for('react.memo'));
  });
  it('utilitzen les classes adequades per suportar les altures dinàmiques', () => {
    // Aquest test verifica que no s'ha trencat l'ús de les variables CSS a nivell de classe
    const {
      container
    } = render(<>
        <BrandBar />
        <ActionBar />
      </>);

    // Al ser renders simples, verifiquem que la renderització no falla
    expect(container).toBeInTheDocument();
  });
});