import React from 'react';
import { Loader2 } from 'lucide-react';
import { Stack } from '../design-system/components/Layout/Stack';
import { Text } from '../design-system/components/Typography/Text';

const NanoLoader = ({ message = "Carregant Sóc de Poble..." }) => {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[var(--bg-app)] text-[var(--text-main)] transition-opacity duration-300">
            <Stack spacing="md" alignment="center">
                <Loader2 className="animate-spin text-[var(--theme-accent-primary)]" size={48} />
                <Text variant="overline" className="tracking-widest opacity-80 uppercase">
                    {message}
                </Text>
            </Stack>
        </div>
    );
};

export default NanoLoader;
