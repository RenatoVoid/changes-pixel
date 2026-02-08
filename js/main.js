var player;

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        height: '0', width: '0', videoId: 'm4GRthy8F_M',
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
}

document.addEventListener("DOMContentLoaded", () => {
    const btnStart = document.getElementById('botaozao');
    const intro = document.getElementById('intro-screen');
    const main = document.getElementById('main');
    const playTrigger = document.getElementById('play-trigger');
    const tulip = document.getElementById('tulip-trigger');
    const progressFill = document.getElementById('progress-fill');
    
    // Elementos do Overlay
    const btnOpenLyrics = document.getElementById('btn-open-lyrics');
    const btnCloseLyrics = document.getElementById('btn-close-lyrics');
    const lyricsOverlay = document.getElementById('lyrics-overlay');

    const vibrate = () => { if (navigator.vibrate) navigator.vibrate(40); };

    btnStart.addEventListener('click', () => {
        vibrate();
        intro.style.opacity = '0';
        intro.style.pointerEvents = 'none';

        if (player && typeof player.playVideo === "function") {
            player.playVideo();
            setTimeout(() => player.pauseVideo(), 150);
        }

        setTimeout(() => {
            intro.style.display = 'none';
            main.classList.add('active');
        }, 600);
    });

    playTrigger.addEventListener('click', (e) => {
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

    tulip.addEventListener('click', (e) => {
        vibrate();
        createHeartExplosion(e.clientX, e.clientY);
    });

    // Lógica do Overlay (Manifesto)
    const toggleOverlay = (open) => {
        vibrate();
        if (open) {
            lyricsOverlay.classList.add('active');
            main.style.filter = "blur(5px) brightness(0.7)";
        } else {
            lyricsOverlay.classList.remove('active');
            main.style.filter = "none";
        }
    };

    if(btnOpenLyrics) btnOpenLyrics.addEventListener('click', () => toggleOverlay(true));
    if(btnCloseLyrics) btnCloseLyrics.addEventListener('click', () => toggleOverlay(false));

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