export interface UniversalCardProps {
  /** Visual variant of the card depending on its context */
  variant?: 'post' | 'mercat' | 'market' | 'pobles' | 'ajuntament' | 'official' | 'alert' | 'sostenible';
  
  /** List vs Grid viewing mode */
  viewMode?: 'grid' | 'list' | 'single';
  
  /** Whether the card should react to hover states */
  interactive?: boolean;
  
  /** Accessibility high-contrast & robust sizing mode */
  seniorMode?: boolean;
  
  /** Forensic debugging mode for layout tracing */
  forensicMode?: boolean;
  
  /** Emphasised scale mode for touch targets */
  gloveMode?: boolean;
  
  /** Live heartbeat animation */
  isBating?: boolean;
}
