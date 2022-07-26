const video = document.querySelector('.player__video');
const videoSrc = 'https://live-streams.cdnvideo.ru/cdnvideo/caminandes/playlist.m3u8';

// video.forEach((item) => {
  if (Hls.isSupported()) {
    const hls = new Hls();

    hls.loadSource(videoSrc);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
  }
// });
