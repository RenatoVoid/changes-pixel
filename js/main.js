// CONFIGURAÇÃO DA PLAYLIST
// Todos os links fornecidos foram convertidos em IDs e Títulos
const playlistData = [
    { 
        title: "Climax/Moonlight (Young Thug & XXXTentacion)", 
        artist: "Emily Branca", 
        id: "w16n9y3HvrI" 
    },
    { 
        title: "Spite (Original Song)", 
        artist: "Emily Branca", 
        id: "SLgUHgDp4W4" 
    },
    { 
        title: "It's You (Ali Gatie Cover)", 
        artist: "Emily Branca", 
        id: "AEqcL9gI4OU" 
    },
    { 
        title: "7 Rings (Ariana Grande Cover)", 
        artist: "Emily Branca", 
        id: "JAMfIIJNUR0" 
    },
    { 
        title: "8 (Billie Eilish Cover)", 
        artist: "Emily Branca", 
        id: "bLaOZ4Pcq1s" 
    },
    { 
        title: "Falling (Trevor Daniel Remix)", 
        artist: "Emily Branca", 
        id: "c-cULMoytsA" 
    },
    { 
        title: "Falling Down (Lil Peep & XXXTentacion)", 
        artist: "Emily Branca", 
        id: "KZExoZkRANM" 
    }
];

let player;
let currentTrackIndex = 0; 

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
    const icon = document.getElementById('play-icon');
    const label = document.querySelector('.player-text');
    const tulip = document.querySelector('.tulip-photo');
    const isPlaying = event.data === YT.PlayerState.PLAYING;

    if (isPlaying) {
        if(icon) icon.innerHTML = "⏸";
        if(label) label.innerText = "PAUSAR MÚSICA";
        if(tulip) tulip.classList.add('pulsing');
    } else {
        if(icon) icon.innerHTML = "▶";
        if(label) label.innerText = "OUVIR MÚSICA";
        if(tulip) tulip.classList.remove('pulsing');
    }
    
    // Auto-play para o próximo vídeo quando o atual terminar
    if (event.data === YT.PlayerState.ENDED) {
        playTrack((currentTrackIndex + 1) % playlistData.length);
    }
}

function playTrack(index) {
    if (index < 0 || index >= playlistData.length) return;
    
    currentTrackIndex = index;
    const track = playlistData[index];

    // Carrega e toca o vídeo
    if(player && player.loadVideoById) {
        player.loadVideoById(track.id);
        player.playVideo();
    }

    // Atualiza Texto na Tela Principal
    const titleEl = document.querySelector('.info-track h1');
    const artistEl = document.querySelector('.info-track p');
    
    if(titleEl) {
        titleEl.style.opacity = '0';
        setTimeout(() => {
            titleEl.innerText = track.title;
            titleEl.style.opacity = '1';
        }, 300);
    }
    
    if(artistEl) {
        artistEl.innerText = track.artist;
    }

    renderPlaylist(); 
}

function renderPlaylist() {
    const listEl = document.getElementById('playlist-list');
    if(!listEl) return;

    listEl.innerHTML = ''; 

    playlistData.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = `track-item ${index === currentTrackIndex ? 'active-track' : ''}`;
        
        // Estrutura do item da lista
        li.innerHTML = `
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;">${track.title}</span>
            <small style="opacity:0.6; white-space: nowrap;">${track.artist}</small>
        `;
        
        li.addEventListener('click', () => {
            playTrack(index);
            if (navigator.vibrate) navigator.vibrate(20);
        });

        listEl.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Referências
    const btnStart = document.getElementById('botaozao');
    const intro = document.getElementById('intro-screen');
    const main = document.getElementById('main');
    const playTrigger = document.getElementById('play-trigger');
    const tulip = document.getElementById('tulip-trigger');
    const progressFill = document.getElementById('progress-fill');
    
    // Overlays Antigos
    const btnOpenLyrics = document.getElementById('btn-open-lyrics');
    const btnCloseLyrics = document.getElementById('btn-close-lyrics');
    const lyricsOverlay = document.getElementById('lyrics-overlay');
    const secretOverlay = document.getElementById('secret-overlay');
    const btnCloseSecret = document.getElementById('btn-close-secret');

    // Playlist
    const btnTogglePlaylist = document.getElementById('btn-toggle-playlist');
    const playlistContainer = document.getElementById('playlist-overlay');
    const btnClosePlaylist = document.getElementById('btn-close-playlist');

    const vibrate = () => { if (navigator.vibrate) navigator.vibrate(40); };

    // Inicialização
    renderPlaylist();
    
    // Define título inicial
    const initialTrack = playlistData[0];
    const titleEl = document.querySelector('.info-track h1');
    const artistEl = document.querySelector('.info-track p');
    if(titleEl) titleEl.innerText = initialTrack.title;
    if(artistEl) artistEl.innerText = initialTrack.artist;

    // INICIAR SITE
    if(btnStart) btnStart.addEventListener('click', () => {
        vibrate();
        intro.style.opacity = '0';
        intro.style.pointerEvents = 'none';

        if (player && typeof player.playVideo === "function") {
            player.playVideo(); 
        }

        setTimeout(() => {
            intro.style.display = 'none';
            main.classList.add('active');
        }, 600);
    });

    // BOTÃO PLAYER CENTRAL
    if(playTrigger) playTrigger.addEventListener('click', (e) => {
        vibrate();
        if (!player) return;
        const state = player.getPlayerState();
        if (state === 1) { 
            player.pauseVideo();
        } else {
            player.playVideo();
            createHeartExplosion(e.clientX, e.clientY);
        }
    });

    // CONTROLE PLAYLIST
    if(btnTogglePlaylist) {
        btnTogglePlaylist.addEventListener('click', (e) => {
            vibrate();
            e.stopPropagation();
            playlistContainer.classList.toggle('active');
        });
    }

    if(btnClosePlaylist) {
        btnClosePlaylist.addEventListener('click', () => {
            playlistContainer.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if(playlistContainer && 
           playlistContainer.classList.contains('active') && 
           !playlistContainer.contains(e.target) && 
           e.target !== btnTogglePlaylist) {
            playlistContainer.classList.remove('active');
        }
    });

    // OVERLAYS GENÉRICOS
    const toggleOverlay = (overlay, open) => {
        vibrate();
        if (open) {
            overlay.classList.add('active');
            main.style.filter = "blur(5px) brightness(0.7)";
        } else {
            overlay.classList.remove('active');
            main.style.filter = "none";
        }
    };

    if(btnOpenLyrics) btnOpenLyrics.addEventListener('click', () => toggleOverlay(lyricsOverlay, true));
    if(btnCloseLyrics) btnCloseLyrics.addEventListener('click', () => toggleOverlay(lyricsOverlay, false));
    if(btnCloseSecret) btnCloseSecret.addEventListener('click', () => toggleOverlay(secretOverlay, false));

    // TULIPA
    if(tulip) tulip.addEventListener('click', (e) => {
        vibrate();
        createHeartExplosion(e.clientX, e.clientY);
        setTimeout(() => { toggleOverlay(secretOverlay, true); }, 600);
    });

    // BARRA DE PROGRESSO
    setInterval(() => {
        if (player && player.getCurrentTime) {
            const duration = player.getDuration();
            const current = player.getCurrentTime();
            if (duration > 0) {
                const percent = (current / duration) * 100;
                progressFill.style.width = percent + '%';
            }
        }
    }, 500);

    // EFEITOS (Hearts & Fireflies)
    const createHeart = (x, y) => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = Math.random() > 0.5 ? '💖' : '✨';
        const offsetX = (Math.random() - 0.5) * 50;
        heart.style.left = (x + offsetX) + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    };

    const createHeartExplosion = (x, y) => {
        for (let i = 0; i < 8; i++) { setTimeout(() => createHeart(x, y), i * 100); }
    };

    const createFirefly = () => {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        firefly.style.left = startX + 'vw';
        firefly.style.top = startY + 'vh';
        const moveX = (Math.random() - 0.5) * 200 + 'px';
        const moveY = (Math.random() - 0.5) * 200 + 'px';
        firefly.style.setProperty('--moveX', moveX);
        firefly.style.setProperty('--moveY', moveY);
        const size = Math.random() * 4 + 2 + 'px'; 
        firefly.style.width = size; firefly.style.height = size;
        const duration = Math.random() * 3 + 4 + 's'; 
        firefly.style.animationDuration = duration;
        document.body.appendChild(firefly);
        setTimeout(() => firefly.remove(), parseFloat(duration) * 1000);
    };

    setInterval(createFirefly, 600);
});
