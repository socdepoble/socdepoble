import './IAIARoleSelectorModal.css';

const IAIARoleSelectorModal = ({ isOpen, onClose, currentLevel = 0, onSelect }) => {
    if (!isOpen) return null;

    const levels = [
        {
            id: 0,
            title: 'Nivell 0 (Humà)',
            desc: 'La IAIA està apagada. Només xates amb veïns reals i administres el teu poble sense cap tipus d’inferència artificial.',
            icon: <User size={24} />,
            color: 'gray'
        },
        {
            id: 1,
            title: 'Nivell 1 (Assistent)',
            desc: 'Utilitat pura. La IAIA t’ajuda amb recordatoris, receptes, tràmits del poble i funcions de productivitat diària.',
            icon: <Zap size={24} />,
            color: 'cyan'
        },
        {
            id: 2,
            title: 'Nivell 2 (Immersiu)',
            desc: 'Rol complet. La IAIA forma part del poble amb misteris, històries i una personalitat forta que t’acompanyarà sempre.',
            icon: <Brain size={24} />,
            color: 'purple'
        }
    ];

    return (
        <div className="iaia-role-overlay" onClick={onClose}>
            <div className="iaia-role-modal" onClick={e => e.stopPropagation()}>
                <header className="iaia-role-header">
                    <div className="sparkle-glow">
                        <Sparkles size={32} className="text-[#5D5FEF]" />
                    </div>
                    <h2>Selector de Realitat</h2>
                    <p>Com vols que la IAIA s'implique en la teua vida al poble?</p>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="levels-grid">
                    {levels.map(level => (
                        <div 
                            key={level.id} 
                            className={`level-card ${currentLevel === level.id ? 'active' : ''} ${level.color}`}
                            onClick={() => onSelect?.(level.id)}
                        >
                            <div className="level-icon">
                                {level.icon}
                                {currentLevel === level.id && <Check className="check-icon" size={16} />}
                            </div>
                            <div className="level-info">
                                <h3>{level.title}</h3>
                                <p>{level.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="iaia-role-footer">
                    <button className="btn-confirm" onClick={onClose}>
                        FIXAR CONFIGURACIÓ
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default IAIARoleSelectorModal;
