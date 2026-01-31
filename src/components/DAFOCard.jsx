import React from 'react';
import { Plus, Minus, ArrowUpRight, AlertTriangle } from 'lucide-react';
import './DAFOCard.css';

const DAFOCard = ({ data }) => {
    if (!data) return null;

    const { title, description, f, o, d, a } = data;

    return (
        <div className="dafo-card-premium">
            <div className="dafo-header">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>

            <div className="dafo-matrix">
                {/* 🟢 FORTALESES */}
                <div className="dafo-quadrant fortaleses">
                    <div className="quadrant-label">
                        <Plus size={18} />
                        <span>Fortaleses</span>
                    </div>
                    <ul>
                        {f.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>

                {/* 🔵 OPORTUNITATS */}
                <div className="dafo-quadrant oportunitats">
                    <div className="quadrant-label">
                        <ArrowUpRight size={18} />
                        <span>Oportunitats</span>
                    </div>
                    <ul>
                        {o.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>

                {/* 🟡 DEBILITATS */}
                <div className="dafo-quadrant debilitats">
                    <div className="quadrant-label">
                        <Minus size={18} />
                        <span>Debilitats</span>
                    </div>
                    <ul>
                        {d.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>

                {/* 🔴 AMENACES */}
                <div className="dafo-quadrant amenaces">
                    <div className="quadrant-label">
                        <AlertTriangle size={18} />
                        <span>Amenaces</span>
                    </div>
                    <ul>
                        {a.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>
            </div>

            <div className="dafo-footer-info">
                <p>⚠️ Aquests anàlisis són eines de suport per a la decisió meditada. El bategat final sempre és humà.</p>
            </div>
        </div>
    );
};

export default DAFOCard;
