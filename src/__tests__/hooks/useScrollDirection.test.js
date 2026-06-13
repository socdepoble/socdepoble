import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useScrollDirection } from '../../hooks/useScrollDirection';

describe('useScrollDirection - Comportament del Scroll', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main id="main-content" style="height: 200px; overflow-y: scroll;"><div style="height: 1000px;"></div></main>';
  });

  it('HAURIA de detectar scroll cap avall', () => {
    const { result } = renderHook(() => useScrollDirection('main-content'));
    
    act(() => {
      const main = document.getElementById('main-content');
      main.scrollTop = 0;
      main.dispatchEvent(new Event('scroll'));
    });

    act(() => {
      const main = document.getElementById('main-content');
      main.scrollTop = 100;
      main.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe('down');
  });

  it('HAURIA d\'ignorar moviments menors que el threshold', () => {
    const { result } = renderHook(() => useScrollDirection('main-content'));
    
    act(() => {
      const main = document.getElementById('main-content');
      main.scrollTop = 0;
      main.dispatchEvent(new Event('scroll'));
    });

    act(() => {
      const main = document.getElementById('main-content');
      main.scrollTop = 5; // Menor que threshold
      main.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe('up');
  });
});
