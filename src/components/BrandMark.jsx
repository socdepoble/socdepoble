export default function BrandMark({ variant = 'light', className = '' }) {
  const src = variant === 'dark'
    ? '/assets/system/ui/logo-socdepoble-rect-negre.svg'
    : '/assets/system/ui/logo-socdepoble-rect-blanc.svg';

  return <img className={className} src={src} alt="Sóc de Poble" />;
}
