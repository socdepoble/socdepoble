import React, { useEffect, useMemo, useCallback } from 'react';
import { useSession, usePermissions } from '../../adapters/authHooks';
import { useAtomicGuard } from '../../hooks/useAtomicGuard';
import UniversalShell from '../../components/universal/UniversalShell';
import { usePageData } from '../../hooks/usePageData';
import { useProcessedContent } from '../../hooks/useProcessedContent';
import { useCmsInteractions } from '../../hooks/useCmsInteractions';
import { usePreBlockFormatter } from '../../hooks/usePreBlockFormatter';
import { useOmegaTranslate } from '../../hooks/useOmegaTranslate';
import { useUniversalPageCore } from '../../hooks/useUniversalPageCore';
import { useUniversalPageSave } from '../../hooks/useUniversalPageSave';
import { PageEditStoreProvider, usePageEditStore, usePageEditStoreActions } from '../../stores/PageEditStoreProvider';
import { PageUIStoreProvider, usePageUIStore, usePageUIStoreActions } from '../../stores/PageUIStoreProvider';
import { useEphemeralUI } from '../../hooks/useEphemeralUI';
import { useScrollMetrics } from '../../hooks/useScrollMetrics';
import { FloatingScrollButton } from '../../components/ui/FloatingScrollButton';
import { UniversalPageContent } from './components/UniversalPageContent';

const EMPTY_ARRAY = Object.freeze([]);

const UniversalPageInner = (props) => {
  const {
    slug = null, standAlone = true, forcedHtml = null,
    forcedTitle = null, forcedSubtitle = null, forcedImages = null,
    defaultViewMode = 'document', renderKanban = null, renderCalendar = null,
    customActions = null, forcedHeroImage = null, forcedItem = null,
    routeSlug, pageItem, pageData,
    children, ...restProps
  } = props;

  const { user } = useSession();
  const { isSuperAdmin } = usePermissions();
  const { atomicYSave, startCritical } = useAtomicGuard();

  // ─── Capa 2: Local & UI Store ───
  const isEditing = usePageEditStore((s) => s.isEditing);
  const isSaving = usePageEditStore((s) => s.isSaving);
  const localSubtitle = usePageEditStore((s) => s.localSubtitle);
  
  const { setEditing, setSaving, setLocalSubtitle, resetEdit } = usePageEditStoreActions();
  
  // Selectors atòmics
  const isIndexOpen = usePageUIStore((s) => s.isIndexOpen);
  const isIndexPinned = usePageUIStore((s) => s.isIndexPinned);
  const isHistoryOpen = usePageUIStore((s) => s.isHistoryOpen);
  const currentViewMode = usePageUIStore((s) => s.currentViewMode);

  // Accions estables
  const { toggleIndex, togglePin, setHistoryOpen, setViewMode, reset: resetUI } = usePageUIStoreActions();

  useEffect(() => {
    return () => {
      resetEdit();
      resetUI();
    };
  }, [resetEdit, resetUI]);

  // ─── Capa 3: Efímer Local ───
  const ephemeral = useEphemeralUI();

  // ─── Capa 4: Scroll (Ref pura + useState només quan canvia) ───
  const { totalPages, pageNumberRef } = useScrollMetrics(ephemeral.scrollContainerRef);

  // ─── Processament HTML ───
  const { translatedContent, clearTranslation } = useOmegaTranslate(routeSlug, pageData.htmlContent);
  const activeHtmlContent = useMemo(() => translatedContent || pageData.htmlContent, [translatedContent, pageData.htmlContent]);
  
  const processedHtml = useProcessedContent(activeHtmlContent, !!children);
  const formattedHtml = usePreBlockFormatter(processedHtml);

  // ─── Interaccions CMS ───
  const cmsConfig = useMemo(() => ({
    onImageClick: ephemeral.openMediaViewer
  }), [ephemeral.openMediaViewer]);
  useCmsInteractions(ephemeral.contentRef, cmsConfig);

  // ─── Permisos ───
  const canEdit = useMemo(() => {
    return isSuperAdmin || (user && pageData.collaborators?.includes(user?.id));
  }, [isSuperAdmin, user, pageData.collaborators]);

  // ─── Save ───
  const saveConfig = useMemo(() => ({
    canEdit,
    actions: { setSaving },
    startCritical,
    atomicYSave,
    pageId: pageData.pageId,
    htmlContent: pageData.htmlContent,
    title: pageData.title,
    routeSlug,
    localSubtitle
  }), [canEdit, setSaving, startCritical, atomicYSave, pageData.pageId, pageData.htmlContent, pageData.title, routeSlug, localSubtitle]);

  const handleSave = useUniversalPageSave(saveConfig);

  // ─── Props primitives per a UniversalShell ───────────────────
  
  const seoProps = useMemo(() => ({
    seoTitle: pageData.title || 'Sóc de Poble',
    seoDescription: localSubtitle,
    seoImage: forcedHeroImage || pageData.heroImage || '',
    seoUrl: typeof window !== 'undefined' ? window.location.href : '',
  }), [pageData.title, localSubtitle, forcedHeroImage, pageData.heroImage]);

  // Defecte 4 fixat: No recrear array a cada render
  const heroImages = useMemo(() => {
    if (forcedImages) return forcedImages;
    const img = forcedHeroImage || pageData.heroImage;
    return img ? [img] : EMPTY_ARRAY;
  }, [forcedImages, forcedHeroImage, pageData.heroImage]);

  const heroProps = useMemo(() => ({
    pageSlug: routeSlug,
    pageId: pageData.pageId,
    presentationTitle: pageData.title || 'Sense Títol',
    heroImages,
    heroFormat: pageData.heroFormat,
    heroPosition: pageData.heroPosition,
    heroVideoUrl: pageItem?.video_url,
    displayTown: pageItem?.town_name || pageItem?.town || pageData.town || '',
    displayAuthor: pageItem?.author_name || pageItem?.author || pageData.author || 'Sóc de Poble',
    displayAvatar: pageItem?.author_avatar || pageItem?.logo_url || pageData.logo || '',
    displayDate: pageItem?.created_at ? new Date(pageItem.created_at).toLocaleDateString('ca-ES') : '',
    isOfficial: pageItem?.is_official ?? true,
  }), [
    routeSlug, pageData.pageId, pageData.title, pageData.heroFormat, pageData.heroPosition, 
    pageData.town, pageData.author, pageData.logo,
    pageItem, heroImages
  ]);

  const {
    mediaViewerSrc, mediaViewerImages, openMediaViewer, closeMediaViewer, scrollContainerRef
  } = ephemeral;

  const handleHistoryRestore = useCallback(() => {
    clearTranslation();
    setEditing(true);
  }, [clearTranslation, setEditing]);

  const handleHistoryClose = useCallback(() => {
    setHistoryOpen(false);
  }, [setHistoryOpen]);

  const overlayProps = useMemo(() => ({
    mediaViewerSrc,
    mediaViewerImages,
    onCloseMediaViewer: closeMediaViewer,
    onNavigateMedia: openMediaViewer,
    isIndexOpen,
    isIndexPinned,
    onToggleIndex: toggleIndex,
    onTogglePin: togglePin,
    scrollContainerRef,
    isHistoryOpen,
    onHistoryClose: handleHistoryClose,
    onHistoryRestore: handleHistoryRestore,
  }), [
    mediaViewerSrc, mediaViewerImages, closeMediaViewer, openMediaViewer,
    isIndexOpen, isIndexPinned, toggleIndex, togglePin, scrollContainerRef,
    isHistoryOpen, handleHistoryClose, handleHistoryRestore
  ]);

  const shellProps = useMemo(() => ({
    ...seoProps,
    ...heroProps,
    ...overlayProps,
  }), [seoProps, heroProps, overlayProps]);

  // ─── Props per a contingut ───
  const contentProps = useMemo(() => ({
    isLoadingPage: pageData.isLoadingPage,
    currentViewMode: currentViewMode || defaultViewMode,
    renderCalendar, renderKanban, canEdit,
    isEditing,
    localSubtitle,
    formattedHtml, activeHtmlContent,
    isSaving,
    handleSave,
    title: pageData.title,
    logoLight: pageData.logoLight,
    logoDark: pageData.logoDark,
    pageItem,
    customActions,
    setLocalSubtitle,
    children,
  }), [
    pageData.isLoadingPage, currentViewMode, defaultViewMode, renderCalendar, renderKanban,
    canEdit, isEditing, localSubtitle, formattedHtml, activeHtmlContent,
    isSaving, handleSave, pageData.title, pageData.logoLight, pageData.logoDark,
    pageItem, customActions, setLocalSubtitle, children
  ]);

  return (
    <UniversalShell {...shellProps}>
      <UniversalPageContent {...contentProps} />
      <FloatingScrollButton scrollContainerRef={ephemeral.scrollContainerRef} />
    </UniversalShell>
  );
};

const UniversalPage = (props) => {
  const { routeSlug, pageItem } = useUniversalPageCore(props.slug, props.forcedItem);
  const pageData = usePageData(routeSlug, props.forcedHtml, props.forcedTitle, props.forcedSubtitle);
  
  return (
    <PageUIStoreProvider key={`ui-${routeSlug}`} defaultViewMode={props.defaultViewMode}>
      <PageEditStoreProvider key={`edit-${routeSlug}`} initialSubtitle={pageData.subtitle || ''}>
        <UniversalPageInner 
          {...props} 
          routeSlug={routeSlug} 
          pageItem={pageItem} 
          pageData={pageData} 
        />
      </PageEditStoreProvider>
    </PageUIStoreProvider>
  );
};

export default React.memo(UniversalPage);