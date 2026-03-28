import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UniversalCard from './index';

// Mocks to bypass context providers during isolated component testing
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({ user: null, isAdmin: false })
}));

vi.mock('../../context/ModalContext', () => ({
    useModal: () => ({ openViewer: vi.fn() })
}));

vi.mock('../../context/NavigationContext', () => ({
    useNavigation: () => ({ forensicMode: false })
}));

vi.mock('../../context/DesignContext', () => ({
    useDesign: () => ({ gloveMode: false, seniorMode: false, hapticService: null })
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' })
}));

describe('UniversalCard - Indestructible Architecture', () => {
    it('renders fallback image deterministically when no image prop or URL is provided', () => {
        render(<UniversalCard item={{ id: '123' }} title="Test Post" />);
        const images = screen.getAllByRole('img');
        
        // Assert that the image source is the computed Nano Banana fallback
        expect(images[images.length - 1].src).toMatch(/nano_.*\.png$/);
    });

    it('respects functional decoupled routing via onNavigate', () => {
        const onNavigateSpy = vi.fn();
        render(<UniversalCard item={{ id: '456' }} title="Nav Test" onNavigate={onNavigateSpy} />);
        
        // Find the article element wrapper and click it
        const article = screen.getByRole('article');
        article.click();

        expect(onNavigateSpy).toHaveBeenCalledWith(expect.objectContaining({ id: '456' }));
    });
});
