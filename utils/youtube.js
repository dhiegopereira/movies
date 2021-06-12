export const init = async() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api"

    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    const player;
    const onYouTubeIframeAPIReady = () => {
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: 'OKqbP3JguDI',
        });
    }  
    onYouTubeIframeAPIReady()
}

export const play = () => {
    player.playVideo()
}

export const pause = () => {
    player.pauseVideo()
}

export const stop = () => {
    player.stopVideo();
}

