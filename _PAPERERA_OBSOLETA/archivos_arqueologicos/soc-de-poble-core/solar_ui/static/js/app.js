/**
 * app.js - Village OS Main Logic
 */

console.log('🚜 Village OS v1.0 Iniciat.');

// GESTIÓ DE CONNEXIÓ (El Semàfor)
const showStatusSnackbar = (online) => {
    const existing = document.getElementById('status-snackbar');
    if (existing) existing.remove();

    const snackbar = document.createElement('div');
    snackbar.id = 'status-snackbar';
    snackbar.className = `snackbar ${online ? 'online' : 'offline'}`;
    snackbar.innerHTML = `
        <span class="icon">${online ? '📡' : '🚜🚭'}</span>
        <span class="msg">${online ? 'Torna a haver senyal al poble.' : 'Mode sense connexió. Estàs al tros.'}</span>
    `;

    document.body.appendChild(snackbar);

    // Fade out after 5s
    setTimeout(() => {
        snackbar.classList.add('fade-out');
        setTimeout(() => snackbar.remove(), 500);
    }, 5000);
};

window.addEventListener('online', () => showStatusSnackbar(true));
window.addEventListener('offline', () => showStatusSnackbar(false));

// Check initial status
if (!navigator.onLine) {
    showStatusSnackbar(false);
}

// Visual Haptics Placeholder
document.addEventListener('click', (e) => {
    if (e.target.closest('button, a')) {
        if ('vibrate' in navigator) navigator.vibrate(10);
    }
});
