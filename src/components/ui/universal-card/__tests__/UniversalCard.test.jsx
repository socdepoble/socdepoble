import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Import components under test
import UniversalCardHeader from '../UniversalCard.Header';
import UniversalCardBody from '../UniversalCard.Body';
import UniversalCardMedia from '../UniversalCard.Media';
import ActionBar from '../../ActionBar';

describe('UniversalCard subcomponents accessibility and basic behavior', () => {
  test('Header, Body, Media and ActionBar render with no accessibility violations', async () => {
    const { container } = render(
      <div>
        <UniversalCardHeader displayAuthor="María" avatarSrc="" displayTown="La Torre" />
        <UniversalCardBody displayTitle="Títol de prova" displayExcerpt="Extracte curt" subtitle="Subtítol" price={12.5} />
        <UniversalCardMedia displayTitle="Vídeo de prova" displayImage="https://example.com/img.jpg" />
        <ActionBar entityId="abc" entityType="post" entityTitle="Títol acció" primaryLabel="CONNECTAR" primaryEvent="CONNECT" />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('ActionBar contains three icon buttons and one primary action button with accessible names', () => {
    render(<ActionBar entityTitle="Test" />);

    // Icon buttons should have aria-labels and be present
    const translateBtn = screen.getByRole('button', { name: /Traduir/i });
    const commentBtn = screen.getByRole('button', { name: /Comentar/i });
    const shareBtn = screen.getByRole('button', { name: /Compartir/i });
    const primaryBtn = screen.getByRole('button', { name: /CONNECTAR|AFEGIR/i });

    expect(translateBtn).toBeInTheDocument();
    expect(commentBtn).toBeInTheDocument();
    expect(shareBtn).toBeInTheDocument();
    expect(primaryBtn).toBeInTheDocument();
  });

  test('Body renders price only when price is not null/undefined', () => {
    const { rerender } = render(
      <UniversalCardBody displayTitle="Títol" displayExcerpt="Text" price={null} />
    );
    expect(screen.queryByText(/Preu/i)).not.toBeInTheDocument();

    rerender(<UniversalCardBody displayTitle="Títol" displayExcerpt="Text" price={19.99} />);
    expect(screen.getByText(/19.99|19,99|19/)).toBeInTheDocument();
  });

  test('Media renders <video> with <track> when subtitleUrl provided', () => {
    const videoUrl = 'https://example.com/video.mp4';
    const subtitleUrl = 'https://example.com/subs.vtt';
    const { container } = render(
      <UniversalCardMedia displayTitle="Vídeo" videoUrl={videoUrl} subtitleUrl={subtitleUrl} />
    );

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();

    const track = container.querySelector('track');
    expect(track).toBeInTheDocument();
    expect(track.getAttribute('src')).toBe(subtitleUrl);
    expect(track.getAttribute('kind')).toBe('subtitles');
  });

  test('Keyboard navigation: first tabbable element receives focus', async () => {
    render(
      <div>
        <ActionBar entityTitle="Test" />
      </div>
    );

    await userEvent.tab();
    expect(document.activeElement?.tagName).toBe('BUTTON');
    const activeName = document.activeElement?.getAttribute('aria-label') || '';
    expect(activeName.length).toBeGreaterThan(0);
  });
});
