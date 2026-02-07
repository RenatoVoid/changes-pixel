var player;

// Injeta o script da API do YouTube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Esta função é chamada automaticamente pela API do YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        height: '0',
        width: '0',
        videoId: 'IMSEvJf7DzA',
        playerVars: { 
            'autoplay': 0, 
            'controls': 0, 
            'modestbranding': 1, 
            'playsinline': 1 
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    var icon = document.getElementById('play-icon');
    var label = document.querySelector('.player-text');
    
    // Atualiza a UI globalmente baseada no estado do player
    if (event.data == YT.PlayerState.PLAYING) {
        if(icon) icon.innerHTML = "⏸";
        if(label) label.innerText = "PAUSAR MÚSICA";
    } else {
        if(icon) icon.innerHTML = "▶";
        if(label) label.innerText = "OUVIR MÚSICA";
    }
}