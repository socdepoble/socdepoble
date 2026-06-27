
// Caixa de Destacat / Callout Box
export const Callout = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-6 w-full mx-auto ${className}`}>
            <Stack spacing="sm">
                {title && (
                    <Text variant="h3" className="text-orange-600 dark:text-orange-500 font-bold uppercase tracking-wide">
                        {title}
                    </Text>
                )}
                {typeof children === 'string' ? (
                    <Text variant="paragraph" className="text-gray-900 dark:text-gray-100 font-medium">
                        {children}
                    </Text>
                ) : (
                    children
                )}
            </Stack>
        </div>
    );
};
