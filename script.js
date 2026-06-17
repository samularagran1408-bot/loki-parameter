const API_KEY = "32df31ee";
const BASE_URL = "https://www.omdbapi.com/";

const episodeList = [
    { title: 'Loki', season: '1', episode: '1', label: 'Loki - T1 E1: Glorious Purpose' },
    { title: 'Loki', season: '1', episode: '2', label: 'Loki - T1 E2: The Variant' },
    { title: 'Loki', season: '1', episode: '3', label: 'Loki - T1 E3: Lamentis' },
    { title: 'Loki', season: '1', episode: '4', label: 'Loki - T1 E4: The Nexus Event' },
    { title: 'Loki', season: '1', episode: '5', label: 'Loki - T1 E5: Journey Into Mystery' },
    { title: 'Loki', season: '1', episode: '6', label: 'Loki - T1 E6: For All Time. Always' },
    { title: 'Loki', season: '2', episode: '1', label: 'Loki - T2 E1: Ouroboros' },
    { title: 'Loki', season: '2', episode: '2', label: 'Loki - T2 E2: Breaking Brad' },
    { title: 'Loki', season: '2', episode: '3', label: 'Loki - T2 E3: 1893' },
    { title: 'Loki', season: '2', episode: '4', label: 'Loki - T2 E4: Heart of the TVA' },
    { title: 'Loki', season: '2', episode: '5', label: 'Loki - T2 E5: Science/Fiction' },
    { title: 'Loki', season: '2', episode: '6', label: 'Loki - T2 E6: Glorious Purpose' }
];

const idList = [
    { value: 'tt9140554', label: 'Loki (2021-2023) - Serie principal' },
    { value: 'tt14957270', label: 'The Good, the Bart, and the Loki (2021)' },
    { value: 'tt1922373', label: 'Thor & Loki: Blood Brothers (2011)' },
    { value: 'tt1517095', label: 'Loki: Arnaldo Baptista (2008)' },
    { value: 'tt0839199', label: 'Mythical Detective Loki Ragnarok (2003)' },
    { value: 'tt5776736', label: 'Loki 7 (2016)' },
    { value: 'tt21072140', label: 'LEGO Marvel Avengers: Loki in Training' },
    { value: 'tt5484872', label: 'A Brothers\' Journey: Thor & Loki' },
    { value: 'tt38534296', label: 'Loki IRL (2025)' }
];

const yearList = [
    { value: '2021', label: 'Loki (2021-2023) - Serie principal' },
    { value: '2021', label: 'The Good, the Bart, and the Loki (2021)' },
    { value: '2011', label: 'Thor & Loki: Blood Brothers (2011)' },
    { value: '2008', label: 'Loki: Arnaldo Baptista (2008)' },
    { value: '2003', label: 'Mythical Detective Loki Ragnarok (2003)' },
    { value: '2016', label: 'Loki 7 (2016)' },
    { value: '2021', label: 'LEGO Marvel Avengers: Loki in Training (2021)' },
    { value: '2014', label: 'A Brothers\' Journey: Thor & Loki (2014)' },
    { value: '2025', label: 'Loki IRL (2025)' }
];

let currentMenuType = "search";

function changeMenuType(type) {
    currentMenuType = type;
    document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.menu-btn[data-menu="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    renderSelectionArea();
    const resultsContent = document.getElementById('resultsContent');
    if (resultsContent) {
        resultsContent.innerHTML = `
            <div class="card">
                <p style="text-align:center; color:#6c757d;">Selecciona una opción y presiona Buscar para consultar la API externa</p>
                <p style="text-align:center; color:#6c757d; font-size:0.9em; margin-top:10px;">La API de OMDb encontró 35 resultados para el parámetro Loki</p>
            </div>
        `;
    }
}

function renderSelectionArea() {
    const selectionArea = document.getElementById('selectionArea');
    if (!selectionArea) return;
    if (currentMenuType === 'search') {
        selectionArea.innerHTML = `<div class="input-group"><label>También puedes buscar usando la barra de búsqueda de arriba</label></div>`;
    } else if (currentMenuType === 'episode') {
        selectionArea.innerHTML = `
            <div class="input-group"><label>Selecciona un episodio de la serie Loki:</label>
                <select id="episodeSelect">${episodeList.map(ep => `<option value='${JSON.stringify(ep)}'>${ep.label}</option>`).join('')}</select>
            </div>
            <button class="search-btn" onclick="searchEpisode()">Buscar Episodio</button>
        `;
    } else if (currentMenuType === 'id') {
        selectionArea.innerHTML = `
            <div class="input-group"><label>Selecciona un ID de IMDb relacionado con Loki:</label>
                <select id="idSelect">${idList.map(idItem => `<option value="${idItem.value}">${idItem.label}</option>`).join('')}</select>
            </div>
            <button class="search-btn" onclick="searchById()">Buscar por ID</button>
        `;
    } else if (currentMenuType === 'year') {
        selectionArea.innerHTML = `
            <div class="input-group"><label>Selecciona un año de estreno relacionado con Loki:</label>
                <select id="yearSelect">${yearList.map(yearItem => `<option value="${yearItem.value}">${yearItem.label}</option>`).join('')}</select>
            </div>
            <button class="search-btn" onclick="searchByYear()">Buscar por año</button>
        `;
    }
}

async function searchByText() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) { displayError('Por favor, escribe algo para buscar'); return; }
    const typeFilter = document.getElementById('typeFilter');
    const yearFilter = document.getElementById('yearFilter');
    showLoading();
    try {
        let url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`;
        if (typeFilter && typeFilter.value) url += `&type=${typeFilter.value}`;
        if (yearFilter && yearFilter.value) url += `&y=${yearFilter.value}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === 'True' && data.Search) {
            displayMultipleResults(data.Search, searchTerm);
        } else {
            displayError('No se encontraron resultados para ' + searchTerm);
        }
    } catch (error) {
        displayError('Error de conexión con API externa: ' + error.message);
    }
}

function searchSuggestion(term) {
    document.getElementById('searchInput').value = term;
    searchByText();
}

async function searchEpisode() {
    const episodeSelect = document.getElementById('episodeSelect');
    if (!episodeSelect) return;
    const episodeData = JSON.parse(episodeSelect.value);
    showLoading();
    try {
        const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(episodeData.title)}&Season=${episodeData.season}&Episode=${episodeData.episode}`;
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data, 'episode');
    } catch (error) {
        displayError('Error de conexión con API externa: ' + error.message);
    }
}

async function searchById() {
    const idSelect = document.getElementById('idSelect');
    if (!idSelect) return;
    const imdbID = idSelect.value;
    showLoading();
    try {
        const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`;
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data, 'id');
    } catch (error) {
        displayError('Error de conexión con API externa: ' + error.message);
    }
}

async function searchByYear() {
    const yearSelect = document.getElementById('yearSelect');
    if (!yearSelect) return;
    const selectedYear = yearSelect.value;
    showLoading();
    try {
        const url = `${BASE_URL}?apikey=${API_KEY}&s=Loki&y=${selectedYear}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === 'True' && data.Search) {
            displayMultipleResults(data.Search, 'Loki del año ' + selectedYear);
        } else {
            displayError('No se encontraron resultados para Loki del año ' + selectedYear);
        }
    } catch (error) {
        displayError('Error de conexión con API externa: ' + error.message);
    }
}

async function searchByExactId(imdbID) {
    showLoading();
    try {
        const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`;
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data, 'id');
    } catch (error) {
        displayError('Error de conexión con API externa: ' + error.message);
    }
}

function displayMultipleResults(searchResults, searchTerm) {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    let html = `<div class="card"><h3 style="color:#8B0000; margin-bottom:15px;">Resultados para ${searchTerm}</h3>
        <p style="margin-bottom:20px; color:#6c757d;">Se encontraron ${searchResults.length} resultados en la API de OMDb</p><div style="display:grid; gap:15px;">`;
    searchResults.forEach(item => {
        html += `
            <div class="result-item">
                <div class="result-poster">${item.Poster && item.Poster !== 'N/A' ? `<img src="${item.Poster}" alt="${item.Title}" loading="lazy">` : `<div class="result-poster-placeholder">Poster no disponible</div>`}</div>
                <div class="result-info">
                    <h4>${item.Title}</h4>
                    <p>Año: ${item.Year} | Tipo: ${item.Type === 'series' ? 'Serie' : 'Película'}</p>
                    <p>ID: ${item.imdbID}</p>
                    <button class="detail-btn" onclick="searchByExactId('${item.imdbID}')">Ver detalles</button>
                </div>
            </div>
        `;
    });
    html += `</div><div class="info-row" style="margin-top:20px;"><span class="info-label" style="background:#e8f0fe; padding:3px 8px; border-radius:5px;">Origen de datos:</span>
        <span class="info-value" style="color:#667eea; font-weight:bold;">OMDb API (https://www.omdbapi.com/)</span></div></div>`;
    resultsContent.innerHTML = html;
}

function displayResults(data, type) {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    if (data.Response === 'False') {
        displayError(data.Error || 'No se encontraron resultados en la API externa');
        return;
    }
    const getValueOrPlaceholder = (value, label) => {
        if (!value || value === 'N/A') return `<span class="no-data">${label} no disponible en la API</span>`;
        return value;
    };
    let html = `<div class="card"><div class="series-info"><div class="poster">`;
    if (data.Poster && data.Poster !== 'N/A') {
        html += `<img src="${data.Poster}" alt="${data.Title}" onerror="this.src='https://via.placeholder.com/300x450?text=Poster+no+disponible'">`;
    } else {
        html += `<div class="placeholder-poster">Poster no disponible en API</div>`;
    }
    let searchTypeInfo = "";
    if (type === 'episode') searchTypeInfo = "Búsqueda por episodio (t=Loki&Season=X&Episode=Y)";
    else if (type === 'id') searchTypeInfo = "Búsqueda por ID de IMDb (i=ttXXXXXXX)";
    else if (type === 'year') searchTypeInfo = "Búsqueda por año (s=Loki&y=XXXX)";
    else searchTypeInfo = "Búsqueda general (s=)";
    html += `</div><div class="details"><h3>${getValueOrPlaceholder(data.Title, 'Título')}</h3>
        <div class="year">${getValueOrPlaceholder(data.Year, 'Año')}</div>
        <div class="info-row"><span class="info-label">Estreno:</span><span class="info-value">${getValueOrPlaceholder(data.Released, 'Fecha de estreno')}</span></div>
        <div class="info-row"><span class="info-label">Duración:</span><span class="info-value">${getValueOrPlaceholder(data.Runtime, 'Duración')}</span></div>
        <div class="info-row"><span class="info-label">Género:</span><span class="info-value">${getValueOrPlaceholder(data.Genre, 'Género')}</span></div>
        <div class="info-row"><span class="info-label">Director:</span><span class="info-value">${getValueOrPlaceholder(data.Director, 'Director')}</span></div>
        <div class="info-row"><span class="info-label">Escritor:</span><span class="info-value">${getValueOrPlaceholder(data.Writer, 'Escritor')}</span></div>
        <div class="info-row"><span class="info-label">Actores:</span><span class="info-value">${getValueOrPlaceholder(data.Actors, 'Actores')}</span></div>
        <div class="info-row"><span class="info-label">Trama:</span><span class="info-value">${getValueOrPlaceholder(data.Plot, 'Trama')}</span></div>
        <div class="info-row"><span class="info-label">IMDb Rating:</span><span class="info-value">${getValueOrPlaceholder(data.imdbRating, 'Rating')}</span>${data.imdbRating && data.imdbRating !== 'N/A' ? `<span class="rating">${data.imdbRating}/10</span>` : ''}</div>
        <div class="info-row"><span class="info-label">IMDb ID:</span><span class="info-value">${getValueOrPlaceholder(data.imdbID, 'ID')}</span></div>
        <div class="info-row"><span class="info-label">Tipo:</span><span class="info-value">${getValueOrPlaceholder(data.Type, 'Tipo de contenido')}</span></div>
        <div class="info-row"><span class="info-label" style="background:#e8f0fe; padding:3px 8px; border-radius:5px;">Tipo de consulta:</span><span class="info-value" style="color:#764ba2; font-weight:bold;">${searchTypeInfo}</span></div>
        <div class="info-row"><span class="info-label" style="background:#e8f0fe; padding:3px 8px; border-radius:5px;">Origen de datos:</span><span class="info-value" style="color:#667eea; font-weight:bold;">OMDb API (https://www.omdbapi.com/)</span></div>`;
    if (data.totalSeasons) {
        html += `<div class="info-row"><span class="info-label">Total de temporadas:</span><span class="info-value">${data.totalSeasons}</span></div>`;
    }
    html += `</div></div></div>`;
    resultsContent.innerHTML = html;
}

function showLoading() {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    resultsContent.innerHTML = `<div class="card"><p style="text-align:center; color:#8B0000;">Conectando con la API externa de OMDb...</p>
        <p style="text-align:center; color:#8B0000;">Realizando petición a: ${BASE_URL}</p>
        <div style="text-align:center; margin-top:15px;"><div class="spinner"></div></div></div>`;
}

function displayError(message) {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    resultsContent.innerHTML = `<div class="card error"><strong>Error con la API externa de OMDb:</strong> ${message}<br><br>
        <small>Verifica que el contenido relacionado con Loki exista en la base de datos<br>Comprueba tu conexión a internet<br>Asegúrate de que la API key sea válida: ${API_KEY}<br>La API externa está en: https://www.omdbapi.com/<br>Según la API, hay 35 resultados para el parámetro Loki</small></div>`;
}

// INSTALACIÓN PWA
let deferredPrompt = null;

function mostrarBotonInstalacion() {
    const container = document.getElementById('installContainer');
    if (container && !window.matchMedia('(display-mode: standalone)').matches) {
        container.style.display = 'block';
    }
}

function ocultarBotonInstalacion() {
    const container = document.getElementById('installContainer');
    if (container) container.style.display = 'none';
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    mostrarBotonInstalacion();
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    ocultarBotonInstalacion();
});

function setupInstallButton() {
    const installButton = document.getElementById('installButton');
    if (!installButton) return;
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') ocultarBotonInstalacion();
            deferredPrompt = null;
        } else {
            alert('Usa el icono de instalar (⊕) en la barra de direcciones, o abre el menú del navegador (⋮) y selecciona "Instalar aplicación".');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') searchByText();
    });
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            changeMenuType(this.getAttribute('data-menu'));
        });
    });
    renderSelectionArea();
    if (window.matchMedia('(display-mode: standalone)').matches) {
        ocultarBotonInstalacion();
    }
    setupInstallButton();
});