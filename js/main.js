var player;

// 1. Carrega a API do YouTube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. Configuração do Player (Essa função o YouTube chama sozinha)
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        height: '200',
        width: '200',
        videoId: 'm4GRthy8F_M', // TROQUEI AQUI: ID novo (Lyric Video) que costuma liberar o embed
        playerVars: { 
            'autoplay': 0, 
            'controls': 0,
            'origin': window.location.origin // Ajuda a identificar o site
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// 3. Controla a UI (Texto e Ícone)
function onPlayerStateChange(event) {
    const icon = document.getElementById('play-icon');
    const label = document.querySelector('.player-text');
    
    if (event.data == YT.PlayerState.PLAYING) {
        if(icon) icon.innerHTML = "⏸";
        if(label) label.innerText = "PAUSAR MÚSICA";
    } else {
        if(icon) icon.innerHTML = "▶";
        if(label) label.innerText = "OUVIR MÚSICA";
    }
}

// 4. Interatividade do Site
document.addEventListener("DOMContentLoaded", function() {
    const btnStart = document.getElementById('botaozao');
    const intro = document.getElementById('intro-screen');
    const main = document.getElementById('main');
    const playTrigger = document.getElementById('play-trigger');
    const tulip = document.getElementById('tulip-trigger');
    const progressFill = document.getElementById('progress-fill');

    // Botão Inicial
    btnStart.addEventListener('click', () => {
        intro.style.opacity = '0';
        intro.style.pointerEvents = 'none';
        
        // Tenta acordar o player
        if (player && typeof player.playVideo === "function") {
            player.playVideo();
            setTimeout(() => player.pauseVideo(), 500); // Toca um pouquinho e pausa pra carregar
        }

        setTimeout(() => {
            intro.style.display = 'none';
            main.classList.add('active');
        }, 600);
    });

    // Botão Customizado (Play/Pause)
    playTrigger.addEventListener('click', (e) => {
        if (!player) return;
        
        const state = player.getPlayerState();
        if (state == 1) { // 1 = Tocando
            player.pauseVideo();
        } else {
            player.playVideo();
            createHeartExplosion(e.clientX, e.clientY);
        }
    });

    // Barra de Progresso
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

    // Efeitos Visuais (Tulipa e Corações)
    tulip.addEventListener('click', (e) => {
        createHeartExplosion(e.clientX, e.clientY);
    });

    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = Math.random() > 0.5 ? '💖' : '✨';
        const offsetX = (Math.random() - 0.5) * 50;
        heart.style.left = (x + offsetX) + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    }

    function createHeartExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createHeart(x, y), i * 100);
        }
    }
});