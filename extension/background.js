chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "download") {
        // Verificar si la URL es válida
        const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        if (youtubeUrlPattern.test(request.downloadUrl)) {
            chrome.downloads.download({
                url: request.downloadUrl,  // URL del archivo descargado
                filename: request.filename,  // Nombre del archivo
                conflictAction: 'prompt',  // Pedir al usuario qué hacer si el archivo ya existe
                saveAs: true  // Mostrar diálogo para elegir carpeta de descarga
            });

            sendResponse({ status: 'success' });  // No muestra ningún mensaje
        } else {
            sendResponse({ status: 'error', message: 'URL de YouTube no válida' });  // Mensaje de error
        }
        return true;
    }
});