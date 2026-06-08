export function createPageViewModel(state) {
    const {
        standAlone,
        pageId,
        routeSlug,
        pageItem,

        title,
        subtitle,

        heroImage,
        forcedHeroImage,
        forcedImages,
        heroFormat,
        heroPosition,

        logoLight,
        logoDark,

        collaborators,
        customActions,

        renderKanban,
        renderCalendar,
        currentViewMode,

        mediaViewerSrc,
        mediaViewerImages,

        isLoadingPage,
        isEditing,
        canEdit,

        translatedContent,
        htmlContent,

        user
    } = state;

    const heroImages = forcedImages?.length
        ? forcedImages
        : [forcedHeroImage || heroImage].filter(Boolean);

    return {
        seo: {
            enabled: standAlone,
            title: title || 'Sóc de Poble',
            description: subtitle || '',
            image: heroImages[0] || null,
            url: routeSlug
        },

        page: {
            id: pageId,
            slug: routeSlug,
            item: pageItem
        },

        user: {
            current: user,
            canEdit
        },

        presentation: {
            title,
            subtitle,
            logoLight,
            logoDark,
            collaborators,
            customActions
        },

        hero: {
            images: heroImages,
            format: heroFormat,
            position: heroPosition
        },

        content: {
            html: translatedContent || htmlContent,
            loading: isLoadingPage,
            editing: isEditing
        },

        views: {
            mode: currentViewMode,
            hasKanban: !!renderKanban,
            hasCalendar: !!renderCalendar,
            renderKanban,
            renderCalendar
        },

        media: {
            current: mediaViewerSrc,
            images: mediaViewerImages
        }
    };
}

export default createPageViewModel;
