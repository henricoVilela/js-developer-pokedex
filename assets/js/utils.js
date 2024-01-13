const utils = {}

utils.exibirLoading = () => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay)
        overlay.style.display = 'flex';
};

utils.ocultarLoading = () => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay)
        overlay.style.display = 'none';
}

