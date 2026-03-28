export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The primary objective / styling intent of the button */
  intent?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass' | 'canonic';
  
  /** The physical size of the button */
  size?: 'sm' | 'md' | 'lg' | 'touch';
  
  /** The border-radius configuration */
  shape?: 'rounded' | 'pill' | 'square' | 'genesis';
  
  /** Whether the button should span the full width of its parent */
  fullWidth?: boolean;
  
  /** Displays a loading state and disables interaction */
  isLoading?: boolean;
}
