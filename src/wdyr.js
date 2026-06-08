import React from 'react';

// S'executa només en entorn de desenvolupament per a no penalitzar producció (iPad A10)
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [
      // Vigilem específicament Zustand per si AuthStore o J.A.R.V.I.S causen renders tòxics
      [require('zustand'), 'useStore']
    ],
    logOnDifferentValues: true,
    collapseGroups: true,
  });
}
