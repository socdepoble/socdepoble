import React, { createContext, useContext } from 'react';

const LayoutContext = createContext({ hideActionBar: false });

export const LayoutProvider = ({ children, hideActionBar = false }) => (
  <LayoutContext.Provider value={{ hideActionBar }}>
    {children}
  </LayoutContext.Provider>
);

export const useLayout = () => useContext(LayoutContext);
