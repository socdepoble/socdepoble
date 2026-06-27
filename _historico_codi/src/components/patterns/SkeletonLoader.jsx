
/**
 * Skeleton Loader Genérico
 * Purgador explícito de "Spinners" en blanco. 
 * Implementa un efecto pulse sutil.
 * 
 * @param {Object} props
 * @param {'card' | 'text' | 'avatar' | 'title'} props.variant 
 * @param {string} props.className - Utilidades custom Tailwind
 */
const SkeletonLoader = ({ variant = 'card', className = '' }) => {
  const baseClass = "animate-pulse rounded-md bg-black/10 dark:bg-white/10";
  
  const variants = {
    avatar: "h-11 w-11 rounded-full",
    title: "h-6 w-3/4",
    text: "h-4 w-full",
    card: "h-32 w-full rounded-2xl",
  };

  return (
    <div 
      className={`${baseClass} ${variants[variant] || variants.card} ${className}`}
      aria-hidden="true" 
    />
  );
};

export const FeedPostSkeleton = () => (
  <div className="atom-card atom-root">
    <header className="atom-row">
      <SkeletonLoader variant="avatar" className="shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonLoader variant="title" className="w-1/3" />
        <SkeletonLoader variant="text" className="w-1/4" />
      </div>
    </header>
    <section className="atom-stack mt-4 space-y-2">
      <SkeletonLoader variant="text" />
      <SkeletonLoader variant="text" className="w-5/6" />
      <SkeletonLoader variant="card" className="mt-4" />
    </section>
  </div>
);

export default SkeletonLoader;
