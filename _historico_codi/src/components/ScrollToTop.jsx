import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // Only scroll to top on new navigation (not back/forward)
        if (navType !== 'POP') {
            window.scrollTo(0, 0);

            // Also scroll the main content area in the Google-style layout
            const mainContent = document.querySelector('.layout-main-scroll');
            if (mainContent) {
                mainContent.scrollTo({ top: 0, behavior: 'instant' });
            }
        }
    }, [pathname, navType]);

    return null;
};

export default ScrollToTop;
