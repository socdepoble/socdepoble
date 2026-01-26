import React from 'react';
import { Home, Star, ChevronRight } from 'lucide-react';
import MyEntitiesList from './MyEntitiesList';

const CommunityTab = ({ userId, navigate }) => {
    return (
        <div className="tab-pane-fade-in community-pane">
            <section className="entities-section">
                <h3 className="section-title">Les meues Entitats</h3>
                <MyEntitiesList userId={userId} />
            </section>

            <section className="community-quick-links">
                <div className="menu-item-compact" onClick={() => navigate('/pobles')}>
                    <Home size={18} /> Els meus pobles
                    <ChevronRight size={16} />
                </div>
                <div className="menu-item-compact" onClick={() => navigate('/favorits')}>
                    <Star size={18} /> Continguts guardats
                    <ChevronRight size={16} />
                </div>
            </section>
        </div>
    );
};

export default CommunityTab;
