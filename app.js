const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
const playButton = player.querySelector('.controls__play');
const muteButton = player.querySelector('.controls__mute');
const progressBar = player.querySelector('.controls__progress-bar');
const volume = player.querySelector('.controls__volume');
const speed = player.querySelector('.controls__speed');
const timeCurrent = player.querySelector('.time__current');
const timeBuffered = player.querySelector('.time__buffered');

let volumeCurrentValue = volume.value;
const videoSrc = 'https://live-streams.cdnvideo.ru/cdnvideo/caminandes/playlist.m3u8';


if (Hls.isSupported()) {
  const hls = new Hls();

  hls.loadSource(videoSrc);
  hls.attachMedia(video);
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  video.src = videoSrc;
}

function playVideo() {
    video.play();
    playButton.classList.add('controls__play_paused');
    playButton.ariaLabel = "pause";
}

function pauseVideo() {
  video.pause();

  playButton.classList.remove('controls__play_paused');
  playButton.ariaLabel = "play";
}

function changeVideoStatus() {
  if (video.paused || video.ended) {
    playVideo();
  } else {
    pauseVideo();
  }
}

function timeRangesToString(r) {
  let log = '';

  for (let i = 0; i < r.length; i++) {
    log += '[' + r.start(i) + ', ' + r.end(i) + ']';
    log += ' ';
  }

  return log;
}

function setTime() {
  const hours = Math.floor(video.currentTime / 3600);
  const minutes = Math.floor(video.currentTime / 60);
  const seconds = Math.floor(video.currentTime);

  const hoursValue = hours.toString().padStart(2, '0');
  const minuteValue = minutes.toString().padStart(2, '0');
  const secondValue = seconds.toString().padStart(2, '0');

  return `${hoursValue}:${minuteValue}:${secondValue}`;
}

function setStatusMute() {
  video.muted = true;
  muteButton.ariaLabel = "unmute";
  muteButton.classList.add('controls__mute_muted');
}

function setStatusUnmute() {
  video.muted = false;
  muteButton.ariaLabel = "mute";
  muteButton.classList.remove('controls__mute_muted');
}

playButton.addEventListener('click', changeVideoStatus);

video.addEventListener('loadedmetadata', () => {
  progressBar.max = video.duration;
});

video.addEventListener('timeupdate', () => {
  timeCurrent.textContent = setTime(video.played);

  progressBar.value = Math.floor((video.currentTime / video.duration) * 100);
});

video.addEventListener('progress', () => {
  timeBuffered.textContent = timeRangesToString(video.buffered);
  progressBar.max = video.duration;
});

video.addEventListener('click', () => {
  playButton.focus();
  playButton.click();
  playButton.blur();
});

speed.addEventListener('change', (e) => {
  video.playbackRate = e.target.value;
});

volume.addEventListener('input', (e) => {
  video.volume = e.target.value / 100;

  if (video.volume === 0) {
    setStatusMute();
  } else {
    setStatusUnmute();
  }
});

muteButton.addEventListener('click', () => {
  if (video.muted) {
    volume.value = volumeCurrentValue;
    setStatusUnmute();
  } else {
    volumeCurrentValue = video.volume * 100;
    volume.value = 0;
    setStatusMute();
  }
});
