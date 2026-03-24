// ✅ src/tests/components/AuthContext.test.jsx - TESTS DEL CONTEXT AUTH
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

// [MOCK] Supabase auth
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn()
    }
  }
}));

// [COMPONENT] Test wrapper
const TestWrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

// [COMPONENT] Test consumer
const AuthConsumer = () => {
  const { user, loading, signOut, loginAsGuest } = useAuth();
  
  return (
    <div>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <span data-testid="user">{user?.email || 'no-user'}</span>
      <button onClick={signOut} data-testid="signout-btn">Sign Out</button>
      <button onClick={loginAsGuest} data-testid="guest-btn">Login as Guest</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('hauria de carregar sense usuari inicialment', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(<AuthConsumer />, { wrapper: TestWrapper });

    await waitFor(() => {
      // In the mockup implementation, it immediately detects no user
      expect(screen.getByTestId('user').textContent).toBe('no-user');
    });
  });

  it('hauria de carregar usuari quan hi ha sessió', async () => {
    const mockSession = {
      user: { id: 'test-id', email: 'test@example.com' }
    };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(<AuthConsumer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('test@example.com');
    });
  });

  it('hauria de permetre login com a convidat', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(<AuthConsumer />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByTestId('guest-btn'));

    await waitFor(() => {
      expect(localStorage.getItem('isGuestMode')).toBe('true');
    });
  });

  it('hauria de cridar signOut de supabase', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    supabase.auth.signOut.mockResolvedValue({});

    render(<AuthConsumer />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByTestId('signout-btn'));

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    });
  });

});
