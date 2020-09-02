document.addEventListener('DOMContentLoaded', init, false);

function init() {
    if (!navigator.onLine) {
        const element = document.getElementById('status');
        element.innerHTML = 'Offline';
    }
}