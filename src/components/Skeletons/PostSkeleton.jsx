import './Skeletons.css';

const PostSkeleton = () => {
    return (
        <div className="universal-card skeleton-card">
            <div className="card-header skeleton-header-wrapper">
                <div className="skeleton-avatar" />
                <div className="skeleton-meta">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line extra-short" />
                </div>
            </div>
            <div className="skeleton-image" />
            <div className="card-body">
                <div className="skeleton-line full" />
                <div className="skeleton-line full" />
                <div className="skeleton-line medium" />
            </div>
            <div className="card-footer skeleton-footer-wrapper">
                <div className="skeleton-action" />
                <div className="skeleton-action" />
                <div className="skeleton-action" />
            </div>
        </div>
    );
};

export default PostSkeleton;
