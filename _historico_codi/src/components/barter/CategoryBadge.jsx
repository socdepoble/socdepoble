
export const CategoryBadge = ({ category }) => {
  const categoryConfig = {
    Agua: { icon: '💧', color: 'bg-blue-500/20 text-blue-500' },
    Salud: { icon: '🏥', color: 'bg-red-500/20 text-red-500' },
    Herramientas: { icon: '🔧', color: 'bg-yellow-500/20 text-yellow-500' },
    Tiempo: { icon: '⏳', color: 'bg-green-500/20 text-green-500' },
    Huerta: { icon: '🌱', color: 'bg-green-600/20 text-green-600' },
    Otros: { icon: '🎭', color: 'bg-purple-500/20 text-purple-500' },
  };

  const config = categoryConfig[category] || categoryConfig.Otros;

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
      {config.icon} {category}
    </span>
  );
};
