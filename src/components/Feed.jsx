import React from 'react';
import CategoryTabs from './CategoryTabs';

const Feed = () => {
    return (
        <div className="feed-container">
            <header className="page-header-with-tabs">
                <h1>Muro (Test)</h1>
                <CategoryTabs selectedRole="tot" onSelectRole={() => { }} />
            </header>
            <div className="feed-list">
                <p style={{ padding: '20px', textAlign: 'center' }}>
                    Si puedes ver esto, el sistema de rutas funciona. El problema está en la lógica de Supabase o en los componentes hijos.
                </p>
            </div>
        </div>
    );
};

export default Feed;
