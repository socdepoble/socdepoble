import './CronistaSummaryModal.css';

const CronistaSummaryModal = ({ isOpen, onClose, summary, onShare }) => {
    if (!isOpen) return null;

    // Split summary by sections if possible, or just render text
    const formatSummary = (text) => {
        if (!text) return null;

        // Simple heuristic: split by double newlines and detect headers
        const blocks = text.split('\n\n');

        return blocks.map((block, idx) => {
            if (block.startsWith('1.') || block.startsWith('2.') || block.startsWith('3.')) {
                return (
                    <div key={idx} className="summary-block highlight">
                        <Calendar className="block-icon" size={16} />
                        <div className="block-text">{block}</div>
                    </div>
                );
            }
            if (block.includes('Ull Crític') || block.includes('Ull de gall')) {
                return (
                    <div key={idx} className="summary-block gossip">
                        <Quote className="block-icon" size={16} />
                        <div className="block-text italic">{block}</div>
                    </div>
                );
            }
            return <p key={idx} className="summary-paragraph">{block}</p>;
        });
    };

    return (
        <div className="cronista-modal-overlay animate-fade-in" onClick={onClose}>
            <div className="cronista-modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
                <header className="cronista-header">
                    <div className="cronista-title-row">
                        <div className="cronista-header-brand">
                            <div className="cronista-icon-box">
                                <Newspaper size={20} color="white" strokeWidth={3} />
                            </div>
                            <div className="cronista-titles">
                                <h3>Cronista AI</h3>
                                <span>Resum del dia a La Torre</span>
                            </div>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </header>

                <div className="cronista-body custom-scrollbar">
                    <div className="newsletter-wrapper">
                        {formatSummary(summary)}
                    </div>
                </div>

                <footer className="cronista-footer">
                    <button className="cronista-share-btn" onClick={onShare}>
                        <Share2 size={18} />
                        <span>Compartir al Mur</span>
                    </button>
                    <button className="cronista-close-footer" onClick={onClose}>
                        Tancar
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CronistaSummaryModal;
