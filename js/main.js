var player;
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        height: '0',
        width: '0',
        videoId: 'm4GRthy8F_M',
        playerVars: { 
            'autoplay': 0, 
            'controls': 0,
            'origin': window.location.origin,
            'playsinline': 1
        },
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': () => console.log("Player pronto")
        }
    });
}

function onPlayerStateChange(event) {
    const icon = document.getElementById('play-icon');
    const label = document.querySelector('.player-text');
    const isPlaying = event.data === YT.PlayerState.PLAYING;

    icon.innerHTML = isPlaying ? "⏸" : "▶";
    label.innerText = isPlaying ? "PAUSAR MÚSICA" : "OUVIR MÚSICA";
}

document.addEventListener("DOMContentLoaded", () => {
    const btnStart = document.getElementById('botaozao');
    const intro = document.getElementById('intro-screen');
    const main = document.getElementById('main');
    const playTrigger = document.getElementById('play-trigger');
    const tulip = document.getElementById('tulip-trigger');
    const progressFill = document.getElementById('progress-fill');

    btnStart.addEventListener('click', () => {
        intro.style.opacity = '0';
        intro.style.pointerEvents = 'none';
        
        if (player?.playVideo) {
            player.playVideo();
            setTimeout(() => player.pauseVideo(), 150);
        }

        setTimeout(() => {
            intro.style.display = 'none';
            main.classList.add('active');
        }, 600);
    });

    playTrigger.addEventListener('click', (e) => {
        if (!player?.getPlayerState) return;
        
        const state = player.getPlayerState();
        state === 1 ? player.pauseVideo() : (player.playVideo(), createHeartExplosion(e.clientX, e.clientY));
    });

    setInterval(() => {
        if (player?.getCurrentTime) {
            const dur = player.getDuration();
            const cur = player.getCurrentTime();
            if (dur > 0) progressFill.style.width = `${(cur / dur) * 100}%`;
        }
    }, 500);

    const createHeart = (x, y) => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = Math.random() > 0.5 ? '💖' : '✨';
        heart.style.left = `${x + (Math.random() - 0.5) * 50}px`;
        heart.style.top = `${y}px`;
        heart.style.fontSize = `${Math.random() * 10 + 15}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    };

    const createHeartExplosion = (x, y) => {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createHeart(x, y), i * 100);
        }
    };

    tulip.addEventListener('click', (e) => createHeartExplosion(e.clientX, e.clientY));
});
