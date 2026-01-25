import React from 'react';

const StatusLoader = ({ type = 'loading', message }) => {
    const style = {
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontFamily: 'system-ui, sans-serif'
    };

    if (type === 'loading') {
        return (
            <div style={style}>
                <div style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    border: '2px solid #ddd',
                    borderTopColor: '#333',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                {message && <p style={{ marginTop: '10px' }}>{message}</p>}
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (type === 'error') {
        return (
            <div style={{ ...style, color: '#e53e3e' }}>
                <div style={{ fontSize: '24px' }}>⚠️</div>
                <p>{message || 'Error de càrrega'}</p>
            </div>
        );
    }

    return (
        <div style={style}>
            <p>{message || 'No hi ha contingut'}</p>
        </div>
    );
};

export default StatusLoader;
