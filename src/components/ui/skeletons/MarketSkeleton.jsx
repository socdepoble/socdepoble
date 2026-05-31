import './Skeletons.css';

const MarketSkeleton = () => {
    return (
        <div className="universal-card skeleton-card market-item">
            <div className="card-header skeleton-header-wrapper">
                <div className="skeleton-avatar" />
                <div className="skeleton-meta">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line extra-short" />
                </div>
            </div>
            <div className="skeleton-image-square" />
            <div className="card-body">
                <div className="skeleton-line medium" />
                <div className="skeleton-line full" />
            </div>
            <div className="card-footer skeleton-footer-wrapper">
                <div className="skeleton-button-full" />
            </div>
        </div>
    );
};

export default MarketSkeleton;
