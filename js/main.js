const playlistData = [
    { title: "Changes", artist: "Justin Bieber", id: "IMSEvJf7DzA" },
    { title: "Climax/Moonlight", artist: "Emily Branca", id: "w16n9y3HvrI" },
    { title: "Spite (Original Song)", artist: "Emily Branca", id: "SLgUHgDp4W4" },
    { title: "It's You (Ali Gatie Cover)", artist: "Emily Branca", id: "AEqcL9gI4OU" },
    { title: "7 Rings (Ariana Grande Cover)", artist: "Emily Branca", id: "JAMfIIJNUR0" },
    { title: "8 (Billie Eilish Cover)", artist: "Emily Branca", id: "bLaOZ4Pcq1s" },
    { title: "Falling (Trevor Daniel Remix)", artist: "Emily Branca", id: "c-cULMoytsA" },
    { title: "Falling Down", artist: "Emily Branca", id: "KZExoZkRANM" }
];

const memories = [
    { url: 'https://via.placeholder.com/300', desc: 'Aquele dia 🌊' },
    { url: 'https://via.placeholder.com/300', desc: 'Sorriso bobo ✨' },
    { url: 'https://via.placeholder.com/300', desc: 'O melhor frame' }
];

let player;
let currentTrackIndex = 0;

// Inicialização da API do YouTube
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        height: '0', width: '0', 
        videoId: playlistData[0].id,
        playerVars: { 'autoplay': 0, 'controls': 0, 'playsinline': 1, 'rel': 0 },
        events: { 'onStateChange': onPlayerStateChange }
    });
}

function onPlayerStateChange(event) {
    updatePlayerUI(event.data === YT.PlayerState.PLAYING);
    if (event.data === YT.PlayerState.ENDED) {
        playTrack((currentTrackIndex + 1) % playlistData.length);
    }
}

function updatePlayerUI(isPlaying) {
    const icon = document.getElementById('play-icon');
    const label = document.querySelector('.player-text');
    const tulip = document.getElementById('tulip-trigger');

    if(icon) icon.innerHTML = isPlaying ? "⏸" : "▶";
    if(label) label.innerText = isPlaying ? "PAUSAR MÚSICA" : "OUVIR MÚSICA";
    if(tulip) tulip.classList.toggle('pulsing', isPlaying);
}

function playTrack(index) {
    currentTrackIndex = index;
    const track = playlistData[index];

    if(player?.loadVideoById) {
        player.loadVideoById(track.id);
        player.playVideo();
    }

    const titleEl = document.querySelector('.info-track h1');
    const artistEl = document.querySelector('.info-track p');
    
    if(titleEl) {
        titleEl.style.opacity = '0';
        setTimeout(() => { titleEl.innerText = track.title; titleEl.style.opacity = '1'; }, 300);
    }
    if(artistEl) artistEl.innerText = track.artist;

    renderPlaylist();
}

function renderPlaylist() {
    const listEl = document.getElementById('playlist-list');
    if(!listEl) return;

    listEl.innerHTML = playlistData.map((track, index) => `
        <li class="track-item ${index === currentTrackIndex ? 'active-track' : ''}" onclick="playTrack(${index})">
            <span class="truncate">${track.title}</span>
            <small>${track.artist}</small>
        </li>
    `).join('');
}

function handleVibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
}

// Lógica de Transição e Efeitos
document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        btnStart: document.getElementById('botaozao'),
        intro: document.getElementById('intro-screen'),
        main: document.getElementById('main'),
        playTrigger: document.getElementById('play-trigger'),
        muralPage: document.getElementById('mural-page'),
        btnOpenMural: document.getElementById('btn-open-mural'),
        btnCloseMural: document.getElementById('btn-close-mural'),
        sfxTear: document.getElementById('sfx-tear'),
        progressFill: document.getElementById('progress-fill')
    };

    // Iniciar Site
    elements.btnStart?.addEventListener('click', () => {
        handleVibrate(40);
        elements.intro.style.opacity = '0';
        if (player) player.playVideo();
        setTimeout(() => { elements.intro.style.display = 'none'; elements.main.classList.add('active'); }, 600);
    });

    // Controle do Mural
    elements.btnOpenMural?.addEventListener('click', () => {
        handleVibrate(60);
        elements.sfxTear?.play();
        elements.muralPage.style.display = 'flex';
        setTimeout(() => elements.muralPage.classList.add('active'), 10);
    });

    elements.btnCloseMural?.addEventListener('click', () => {
        elements.muralPage.classList.remove('active');
        setTimeout(() => elements.muralPage.style.display = 'none', 800);
    });

    // Renderizar Mural
    const grid = document.getElementById('mural-grid');
    if(grid) {
        grid.innerHTML = memories.map(mem => `
            <div class="memory-card" style="--rotation: ${Math.random() * 10 - 5}deg">
                <img src="${mem.url}" alt="Memory">
                <span>${mem.desc}</span>
            </div>
        `).join('');
    }

    // Player central
    elements.playTrigger?.addEventListener('click', () => {
        if (!player) return;
        player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
    });

    // Barra de Progresso
    setInterval(() => {
        if (player?.getCurrentTime && elements.progressFill) {
            const pct = (player.getCurrentTime() / player.getDuration()) * 100;
            elements.progressFill.style.width = (pct || 0) + '%';
        }
    }, 500);

    renderPlaylist();
});
