document.getElementById("mp3").addEventListener("click", () => {
  clearQualities();
  showLoading('Audio');
  getCurrentTabUrl((url) => {
    fetchQualities('mp3', url);
  });
});

document.getElementById("mp4").addEventListener("click", () => {
  clearQualities();
  showLoading('Video');
  getCurrentTabUrl((url) => {
    fetchQualities('mp4', url);
  });
});

function getCurrentTabUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    callback(tab.url);
  });
}

function fetchQualities(format, url) {
  fetch('http://127.0.0.1:5000/qualities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url, format: format })
  })
    .then(response => response.json())
    .then(data => {
      hideLoading();
      if (data.status === 'success') {
        displayQualities(data.qualities, format, url);
      } else {
        alert(`Error al obtener las calidades: ${data.message}`);
      }
    })
    .catch(error => {
      hideLoading();
      alert('Error al obtener las calidades. Verifica que el servidor esté funcionando.');
      console.error('Error fetching qualities:', error);
    });
}

function displayQualities(qualities, format, url) {
  const qualityList = document.getElementById("qualityList");
  qualityList.innerHTML = ""; // Limpiar la lista anterior

  if (qualities.length === 0) {
    alert('No hay calidades disponibles con audio y video.');
    return;
  }

  qualities.forEach(quality => {
    const qualityButton = document.createElement('button');
    qualityButton.textContent = `Calidad: ${quality.quality} - Tamaño: ${quality.size}`;
    
    // Agregar evento de descarga cuando se haga clic
    qualityButton.addEventListener('click', () => {
      handleDownload(url, format, quality.itag);
    });

    qualityList.appendChild(qualityButton); // Agregar el botón al DOM
  });
}

function handleDownload(url, format, itag) {
  showLoading('Descargando');
  fetch('http://127.0.0.1:5000/download', {
    method: 'POST',  // debe ser POST
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url, format: format, itag: itag })
  })
  .then(response => response.json())
  .then(data => {
    hideLoading();
    if (data.status === 'success') {
      const downloadUrl = `http://127.0.0.1:5000/downloads/${data.filename}`;
      chrome.downloads.download({
        url: downloadUrl,
        filename: data.filename,
        saveAs: true
      });
      loadHistory();
    } else {
      alert(`Error en la descarga: ${data.message}`);
    }
  })
  .catch(error => {
    hideLoading();
    alert('Error al iniciar la descarga.');
    console.error('Error en la descarga:', error);
  });
}


function loadHistory(filter = "all") {
  fetch('http://127.0.0.1:5000/history')
    .then(res => res.json())
    .then(data => {
      const historyList = document.getElementById('historyList');
      historyList.innerHTML = '';

      if (data.status === 'success' && data.files.length > 0) {
        const filtered = data.files.filter(filename => {
          if (filter === "audio") return filename.endsWith('.mp3');
          if (filter === "video") return filename.endsWith('.mp4');
          return true;
        });

        if (filtered.length === 0) {
          historyList.innerHTML = '<li>No hay archivos en esta categoría.</li>';
          return;
        }

        filtered.forEach(filename => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = `http://127.0.0.1:5000/downloads/${filename}`;
          link.textContent = filename;
          link.target = '_blank';
          li.appendChild(link);
          historyList.appendChild(li);
        });
      } else {
        historyList.innerHTML = '<li>No hay archivos descargados.</li>';
      }
    })
    .catch(error => {
      console.error('Error al cargar historial:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // Verifica si el servidor está activo
  fetch('http://127.0.0.1:5000/status')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'downloading') {
        showLoading("Descargando");
      }
      updateServerStatus(true); // el servidor respondió
    })
    .catch(error => {
      updateServerStatus(false); // el servidor no respondió
    });

  // Carga el historial al iniciar
  loadHistory();

  // Filtros del historial
  document.getElementById("filter-all").addEventListener("click", () => loadHistory("all"));
  document.getElementById("filter-audio").addEventListener("click", () => loadHistory("audio"));
  document.getElementById("filter-video").addEventListener("click", () => loadHistory("video"));

  // Botón para borrar historial
  document.getElementById("clear-history").addEventListener("click", () => {
    if (confirm("¿Seguro que quieres borrar todo el historial?")) {
      fetch('http://127.0.0.1:5000/clear', { method: 'DELETE' })
        .then(res => res.json())
        .then(() => loadHistory());
    }
  });
});

// Función para actualizar el color del indicador
function updateServerStatus(isOnline) {
  const indicator = document.getElementById('server-status-indicator');
  if (indicator) {
    indicator.style.backgroundColor = isOnline ? 'green' : 'red';
  }
}

// Limpiar las opciones anteriores cuando se selecciona una nueva
function clearQualities() {
  const qualityList = document.getElementById("qualityList");
  qualityList.innerHTML = ""; // Limpiar la lista de botones
  hideLoading(); // Asegúrate de ocultar el texto de carga
}

let loadingInterval;

function showLoading(text) {
  const loadingDiv = document.getElementById('loading');
  loadingDiv.innerHTML = text;
  let dots = '';
  loadingInterval = setInterval(() => {
    dots = dots.length >= 3 ? '' : dots + '.';
    loadingDiv.innerHTML = text + dots;
  }, 500);
}

function hideLoading() {
  clearInterval(loadingInterval);
  document.getElementById('loading').innerHTML = '';
}
function updateServerStatus(isOnline) {
  const indicator = document.getElementById('server-status-indicator');
  if (indicator) {
    indicator.style.backgroundColor = isOnline ? 'green' : 'red';
  }
}
