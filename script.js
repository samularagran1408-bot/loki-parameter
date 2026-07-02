const API_KEY = "32df31ee";
const BASE_URL = "https://www.omdbapi.com/";

// ============================================
// LISTA DE AÑOS PARA BÚSQUEDA
// ============================================

const yearList = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
    { value: '2014', label: '2014' },
    { value: '2013', label: '2013' },
    { value: '2012', label: '2012' },
    { value: '2011', label: '2011' },
    { value: '2010', label: '2010' },
    { value: '2009', label: '2009' },
    { value: '2008', label: '2008' },
    { value: '2007', label: '2007' },
    { value: '2006', label: '2006' },
    { value: '2005', label: '2005' },
    { value: '2004', label: '2004' },
    { value: '2003', label: '2003' },
    { value: '2002', label: '2002' },
    { value: '2001', label: '2001' },
    { value: '2000', label: '2000' }
];

let currentMenuType = "year";

// ============================================
// FUNCIONES DEL MENÚ
// ============================================

function changeMenuType(type) {
    currentMenuType = type;
    document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.menu-btn[data-menu="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    renderSelectionArea();
}

function renderSelectionArea() {
    const selectionArea = document.getElementById('selectionArea');
    if (!selectionArea) return;

    if (currentMenuType === 'year') {
        selectionArea.innerHTML = `
            <div class="input-group">
                <label>Selecciona un año para buscar contenido de Loki:</label>
                <select id="yearSelect">
                    ${yearList.map(year => `<option value="${year.value}">${year.label}</option>`).join('')}
                </select>
            </div>
            <button class="search-btn" onclick="buscarPorAño()">Buscar por Año</button>
        `;
    }
}

// ============================================
// FUNCIONES DE BÚSQUEDA (SOLO LOKI)
// ============================================

// Búsqueda general de Loki
function buscarLoki() {
    const searchTerm = 'Loki';
    
    showLoading();
    
    try {
        let url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`;
        
        console.log("🔍 Buscando Loki en API externa:", url);
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True' && data.Search) {
                    displayMultipleResults(data.Search, 'Loki');
                } else {
                    displayError('No se encontraron resultados para Loki');
                }
            })
            .catch(error => {
                displayError('Error de conexión: ' + error.message);
            });
    } catch (error) {
        displayError('Error de conexión: ' + error.message);
    }
}

// Búsqueda por término específico (sugerencias)
function buscarPorTermino(term) {
    showLoading();
    
    try {
        const termLimpio = term.trim();
        const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(termLimpio)}`;
        console.log("🔍 Buscando término específico:", url);
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True') {
                    displayResults(data, 'busqueda');
                } else {
                    displayError('No se encontraron resultados para: ' + termLimpio);
                }
            })
            .catch(error => {
                displayError('Error de conexión: ' + error.message);
            });
    } catch (error) {
        displayError('Error de conexión: ' + error.message);
    }
}

// Búsqueda por año
function buscarPorAño() {
    const yearSelect = document.getElementById('yearSelect');
    if (!yearSelect) return;
    
    const selectedYear = yearSelect.value.trim();
    showLoading();
    
    try {
        const url = `${BASE_URL}?apikey=${API_KEY}&s=Loki&y=${selectedYear}`;
        console.log("🔍 Buscando Loki por año:", selectedYear);
        console.log("📡 URL:", url);
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True' && data.Search) {
                    displayMultipleResults(data.Search, 'Loki del año ' + selectedYear);
                } else {
                    displayError('No se encontraron resultados para Loki del año ' + selectedYear);
                }
            })
            .catch(error => {
                displayError('Error de conexión: ' + error.message);
            });
    } catch (error) {
        displayError('Error de conexión: ' + error.message);
    }
}

// ============================================
// FUNCIÓN PARA VER DETALLES
// ============================================

function verDetalles(omdbID) {
    if (!omdbID) {
        displayError('No se proporcionó un ID válido');
        return;
    }
    
    showLoading();
    
    try {
        const idLimpio = omdbID.toString().trim();
        
        if (!idLimpio.startsWith('tt') || idLimpio.length < 7) {
            displayError('El ID proporcionado no es válido: ' + idLimpio);
            return;
        }
        
        const url = `${BASE_URL}?apikey=${API_KEY}&i=${idLimpio}`;
        console.log("🔍 Buscando por ID en OMDb:", url);
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                return response.json();
            })
            .then(data => {
                console.log("📦 Datos recibidos:", data);
                if (data.Response === 'True') {
                    displayResults(data, 'id');
                } else {
                    displayError('No se encontraron resultados para el ID: ' + idLimpio + '. Error: ' + (data.Error || 'Desconocido'));
                }
            })
            .catch(error => {
                console.error("❌ Error en fetch:", error);
                displayError('Error de conexión: ' + error.message);
            });
    } catch (error) {
        console.error("❌ Error en verDetalles:", error);
        displayError('Error al procesar la solicitud: ' + error.message);
    }
}

// ============================================
// FUNCIONES DE VISUALIZACIÓN
// ============================================

function displayMultipleResults(searchResults, searchTerm) {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    
    let html = `<div class="card"><h3 style="color:#8B0000; margin-bottom:15px;">📋 Resultados para ${searchTerm}</h3>
        <p style="margin-bottom:20px; color:#6c757d;">Se encontraron ${searchResults.length} resultados en la API de OMDb</p><div style="display:grid; gap:15px;">`;
    
    searchResults.forEach(item => {
        const id = item.imdbID ? item.imdbID.trim() : '';
        
        html += `
            <div class="result-item">
                <div class="result-poster">${item.Poster && item.Poster !== 'N/A' ? `<img src="${item.Poster}" alt="${item.Title}" loading="lazy">` : `<div class="result-poster-placeholder">🎬</div>`}</div>
                <div class="result-info">
                    <h4>${item.Title || 'Sin título'}</h4>
                    <p>Año: ${item.Year || 'N/A'} | Tipo: ${item.Type === 'series' ? 'Serie' : item.Type === 'movie' ? 'Película' : 'N/A'}</p>
                    <p>ID OMDb: ${id || 'N/A'}</p>
                    <button class="detail-btn" onclick="verDetalles('${id}')">Ver detalles</button>
                </div>
            </div>
        `;
    });
    
    html += `</div><div class="info-row" style="margin-top:20px;">
        <span class="info-label" style="background:#e8f0fe; padding:3px 8px; border-radius:5px;">Origen de datos:</span>
        <span class="info-value" style="color:#667eea; font-weight:bold;">OMDb API (https://www.omdbapi.com/)</span>
    </div></div>`;
    
    resultsContent.innerHTML = html;
}

function displayResults(data, type) {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    
    if (data.Response === 'False') {
        displayError(data.Error || 'No se encontraron resultados en la API externa');
        return;
    }
    
    const getValue = (value, label) => {
        if (!value || value === 'N/A') return `<span class="no-data">${label} no disponible</span>`;
        return value;
    };
    
    let html = `<div class="card"><div class="series-info"><div class="poster">`;
    
    if (data.Poster && data.Poster !== 'N/A') {
        html += `<img src="${data.Poster}" alt="${data.Title}" onerror="this.src='https://via.placeholder.com/300x450?text=Poster+no+disponible'">`;
    } else {
        html += `<div class="placeholder-poster">🪄<br>Poster no<br>disponible</div>`;
    }
    
    let tipoInfo = "";
    if (type === 'id') tipoInfo = "🆔 Búsqueda por ID OMDb";
    else if (type === 'busqueda') tipoInfo = "🔍 Búsqueda por término";
    else tipoInfo = "🔍 Búsqueda general";
    
    html += `</div><div class="details"><h3>${getValue(data.Title, 'Título')}</h3>
        <div class="year">${getValue(data.Year, 'Año')}</div>
        <div class="info-row"><span class="info-label">📅 Estreno:</span><span class="info-value">${getValue(data.Released, 'Fecha de estreno')}</span></div>
        <div class="info-row"><span class="info-label">⏱️ Duración:</span><span class="info-value">${getValue(data.Runtime, 'Duración')}</span></div>
        <div class="info-row"><span class="info-label">🎭 Género:</span><span class="info-value">${getValue(data.Genre, 'Género')}</span></div>
        <div class="info-row"><span class="info-label">🎬 Director:</span><span class="info-value">${getValue(data.Director, 'Director')}</span></div>
        <div class="info-row"><span class="info-label">✍️ Escritor:</span><span class="info-value">${getValue(data.Writer, 'Escritor')}</span></div>
        <div class="info-row"><span class="info-label">🎭 Actores:</span><span class="info-value">${getValue(data.Actors, 'Actores')}</span></div>
        <div class="info-row"><span class="info-label">📖 Trama:</span><span class="info-value">${getValue(data.Plot, 'Trama')}</span></div>
        <div class="info-row"><span class="info-label">⭐ OMDb Rating:</span><span class="info-value">${getValue(data.imdbRating, 'Rating')}</span>${data.imdbRating && data.imdbRating !== 'N/A' ? `<span class="rating">${data.imdbRating}/10</span>` : ''}</div>
        <div class="info-row"><span class="info-label">🆔 ID OMDb:</span><span class="info-value">${getValue(data.imdbID, 'ID')}</span></div>
        <div class="info-row"><span class="info-label">📺 Tipo:</span><span class="info-value">${getValue(data.Type, 'Tipo de contenido')}</span></div>
        <div class="info-row"><span class="info-label" style="background:#e8f0fe; padding:3px 8px; border-radius:5px;">🔍 Tipo de consulta:</span>
        <span class="info-value" style="color:#764ba2; font-weight:bold;">${tipoInfo}</span></div>
        <div class="info-row"><span class="info-label" style="background:#e8f0fe; padding:3px 8px; border-radius:5px;">🌐 Origen:</span>
        <span class="info-value" style="color:#667eea; font-weight:bold;">OMDb API</span></div>`;
    
    if (data.totalSeasons) {
        html += `<div class="info-row"><span class="info-label">📊 Total temporadas:</span><span class="info-value">${data.totalSeasons}</span></div>`;
    }
    
    html += `</div></div></div>`;
    resultsContent.innerHTML = html;
}

// ============================================
// FUNCIONES DE UI
// ============================================

function showLoading() {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    resultsContent.innerHTML = `<div class="card"><p style="text-align:center; color:#8B0000;">⏳ Conectando con la API de OMDb...</p>
        <p style="text-align:center; color:#8B0000;">📡 Realizando petición a: ${BASE_URL}</p>
        <div style="text-align:center; margin-top:15px;"><div class="spinner"></div></div></div>`;
}

function displayError(message) {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    resultsContent.innerHTML = `<div class="card error"><strong>❌ Error:</strong> ${message}<br><br>
        <small>● Verifica que el contenido relacionado con Loki exista en la base de datos de OMDb<br>
        ● Comprueba tu conexión a internet<br>
        ● Asegúrate de que la API key sea válida: ${API_KEY}<br>
        ● La API externa está en: https://www.omdbapi.com/</small></div>`;
}

// ============================================
// INSTALACIÓN PWA
// ============================================

let deferredPrompt = null;

function mostrarBotonInstalacion() {
    const container = document.getElementById('installContainer');
    if (container && !window.matchMedia('(display-mode: standalone)').matches) {
        container.style.display = 'block';
        console.log('✅ Botón de instalación visible');
    }
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    mostrarBotonInstalacion();
});

if (!window.matchMedia('(display-mode: standalone)').matches) {
    setTimeout(mostrarBotonInstalacion, 2000);
}

document.getElementById('installButton')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
            document.getElementById('installContainer').style.display = 'none';
        }
        deferredPrompt = null;
    }
});

window.addEventListener('appinstalled', () => {
    document.getElementById('installContainer').style.display = 'none';
});

if (window.matchMedia('(display-mode: standalone)').matches) {
    document.getElementById('installContainer').style.display = 'none';
}

// ============================================
// REGISTRO SERVICE WORKER
// ============================================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', { scope: '/' })
            .then(() => console.log('✅ Service Worker registrado'))
            .catch(err => console.error('❌ Error SW:', err));
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            changeMenuType(this.getAttribute('data-menu'));
        });
    });
    renderSelectionArea();
    registerServiceWorker();
    
    // Cargar automáticamente Loki al iniciar
    setTimeout(buscarLoki, 500);
});