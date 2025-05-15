/*
function addDownloadButtons() {
    const container = document.querySelector('#buttons');

    if (container && !document.querySelector('#download-button')) {
        const downloadButton = document.createElement('button');
        downloadButton.id = 'download-button';
        downloadButton.className = 'style-scope ytd-toggle-button-renderer style-default';
        downloadButton.setAttribute('aria-label', 'Descargar');
        downloadButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/>
            </svg>
        `;
        
        downloadButton.addEventListener('click', (event) => {
            const formatContainer = document.querySelector('#format-buttons-container');
            formatContainer.style.display = formatContainer.style.display === 'none' ? 'block' : 'none';

            const rect = downloadButton.getBoundingClientRect();
            const containerWidth = formatContainer.offsetWidth; 
            const centerX = rect.left + (rect.width / 2) - (containerWidth / 2); 

            formatContainer.style.top = `${rect.bottom + window.scrollY + 10}px`; 
            formatContainer.style.left = `${centerX + window.scrollX}px`; 

            event.stopPropagation();
        });

        const formatContainer = document.createElement('div');
        formatContainer.id = 'format-buttons-container';
        formatContainer.style.display = 'none';

        const mp3Button = document.createElement('button');
        mp3Button.id = 'mp3-download-button';
        mp3Button.innerText = 'MP3';
        mp3Button.className = 'style-scope ytd-toggle-button-renderer style-default';
        mp3Button.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'getUrl', format: 'mp3' });
            formatContainer.style.display = 'none'; // Oculta el contenedor de formato después de hacer clic
        });

        const mp4Button = document.createElement('button');
        mp4Button.id = 'mp4-download-button';
        mp4Button.innerText = 'MP4';
        mp4Button.className = 'style-scope ytd-toggle-button-renderer style-default';
        mp4Button.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'getUrl', format: 'mp4' });
            formatContainer.style.display = 'none'; // Oculta el contenedor de formato después de hacer clic
        });

        formatContainer.appendChild(mp3Button);
        formatContainer.appendChild(mp4Button);
        container.insertBefore(downloadButton, container.firstChild);
        document.body.appendChild(formatContainer);

        document.addEventListener('click', (event) => {
            if (!formatContainer.contains(event.target) && event.target !== downloadButton) {
                formatContainer.style.display = 'none';
            }
        });
    }
}

// Llamada inicial para agregar los botones de descarga
addDownloadButtons();

*/