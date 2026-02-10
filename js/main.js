const playlistData = [
    { title: "Changes", artist: "Justin Bieber", id: "IMSEvJf7DzA" },
    { title: "Climax/Moonlight (Young Thug & XXXTentacion)", artist: "Emily Branca", id: "w16n9y3HvrI" },
    { title: "Spite (Original Song)", artist: "Emily Branca", id: "SLgUHgDp4W4" },
    { title: "It's You (Ali Gatie Cover)", artist: "Emily Branca", id: "AEqcL9gI4OU" },
    { title: "7 Rings (Ariana Grande Cover)", artist: "Emily Branca", id: "JAMfIIJNUR0" },
    { title: "8 (Billie Eilish Cover)", artist: "Emily Branca", id: "bLaOZ4Pcq1s" },
    { title: "Falling (Trevor Daniel Remix)", artist: "Emily Branca", id: "c-cULMoytsA" },
    { title: "Falling Down (Lil Peep & XXXTentacion)", artist: "Emily Branca", id: "KZExoZkRANM" }
];

let player;
let currentTrackIndex = 0;

// Carregamento da API do YouTube
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        height: '0', width: '0', 
        videoId: playlistData[0].id,
        playerVars: { 'autoplay': 0, 'controls': 0, 'playsinline': 1, 'origin': window.location.origin, 'rel': 0 },
        events: { 'onStateChange': onPlayerStateChange }
    });
}

function onPlayerStateChange(event) {
    const isPlaying = event.data === YT.PlayerState.PLAYING;
    const icon = document.getElementById('play-icon');
    const label = document.querySelector('.player-text');
    const tulip = document.querySelector('.tulip-photo');

    if (icon) icon.innerHTML = isPlaying ? "⏸" : "▶";
    if (label) label.innerText = isPlaying ? "PAUSAR MÚSICA" : "OUVIR MÚSICA";
    if (tulip) tulip.classList.toggle('pulsing', isPlaying);
    
    if (event.data === YT.PlayerState.ENDED) {
        playTrack((currentTrackIndex + 1) % playlistData.length);
    }
}

function playTrack(index) {
    if (index < 0 || index >= playlistData.length) return;
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
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;">${track.title}</span>
            <small style="opacity:0.6;">${track.artist}</small>
        </li>
    `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
    const vibrate = (ms) => { if (navigator.vibrate) navigator.vibrate(ms); };
    
    renderPlaylist();
    
    // Botão Start
    document.getElementById('botaozao')?.addEventListener('click', () => {
        vibrate(40);
        const intro = document.getElementById('intro-screen');
        const main = document.getElementById('main');
        intro.style.opacity = '0';
        if (player) player.playVideo();
        setTimeout(() => { intro.style.display = 'none'; main.classList.add('active'); }, 600);
    });

    // Player Central
    document.getElementById('play-trigger')?.addEventListener('click', () => {
        vibrate(40);
        if (!player) return;
        player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
    });

    // Playlist Toggle
    const playlistContainer = document.getElementById('playlist-overlay');
    document.getElementById('btn-toggle-playlist')?.addEventListener('click', (e) => {
        vibrate(40);
        e.stopPropagation();
        playlistContainer.classList.toggle('active');
    });

    document.getElementById('btn-close-playlist')?.addEventListener('click', () => {
        playlistContainer.classList.remove('active');
    });

    // Overlays (Manifesto e Segredo)
    const setupOverlay = (btnId, overlayId, closeId) => {
        document.getElementById(btnId)?.addEventListener('click', () => {
            vibrate(40);
            document.getElementById(overlayId).classList.add('active');
        });
        document.getElementById(closeId)?.addEventListener('click', () => {
            document.getElementById(overlayId).classList.remove('active');
        });
    };

    setupOverlay('btn-open-lyrics', 'lyrics-overlay', 'btn-close-lyrics');
    setupOverlay('tulip-trigger', 'secret-overlay', 'btn-close-secret');

    // Progresso
    setInterval(() => {
        if (player?.getCurrentTime) {
            const pct = (player.getCurrentTime() / player.getDuration()) * 100;
            document.getElementById('progress-fill').style.width = (pct || 0) + '%';
        }
    }, 500);
});
